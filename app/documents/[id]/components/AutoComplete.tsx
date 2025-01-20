import { useEffect, useCallback } from "react";
import { Editor } from "@tiptap/core";
import { getAutoCompletion } from "@/utils/document/AIchat";

interface AutoCompleteProps {
  editor: Editor | null;
  autoComplete: boolean;
  documentTitle: string;
  currentSuggestion: string | null;
  suggestionPos: number | null;
  acceptSuggestion: () => void;
  declineSuggestion: () => void;
  lastSuggestionTime: number;
  setCurrentSuggestion: (suggestion: string | null) => void;
  setSuggestionPos: (pos: number | null) => void;
  setShowSuggestionControls: (show: boolean) => void;
  setSuggestionPosition: (position: { x: number; y: number }) => void;
  setLastSuggestionTime: (time: number) => void;
}

export const useEditorAutocomplete = ({
  editor,
  autoComplete,
  documentTitle,
  currentSuggestion,
  suggestionPos,
  acceptSuggestion,
  declineSuggestion,
  lastSuggestionTime,
  setCurrentSuggestion,
  setSuggestionPos,
  setShowSuggestionControls,
  setSuggestionPosition,
  setLastSuggestionTime,
}: AutoCompleteProps) => {
  const insertSuggestion = useCallback(
    async (completion: string, from: number) => {
      if (!editor?.view?.state) return;

      try {
        const sanitizedCompletion = completion
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
          .replace(/\uFFFD/g, ""); 

        if (!sanitizedCompletion) return;

        // Get the current selection and document size
        const { state } = editor.view;
        const docSize = state.doc.content.size;

        // Ensure the position is valid
        if (from < 0 || from > docSize) {
          console.error("Invalid position for suggestion insertion:", from);
          return;
        }

        // Create a new transaction
        const tr = state.tr;

        // First, remove any existing suggestion marks in the document
        const suggestionMark = editor.schema.marks.suggestion;
        if (suggestionMark) {
          const marks = state.doc.resolve(from).marks();
          if (marks.length > 0) {
            tr.removeMark(0, docSize, suggestionMark);
          }
        }

        // Apply changes in sequence
        editor.view.dispatch(tr);

        // Create a new transaction for text insertion
        const insertTr = editor.view.state.tr;

        // Insert the sanitized text
        insertTr.insertText(sanitizedCompletion, from);

        // Apply text insertion
        editor.view.dispatch(insertTr);

        // Create a new transaction for mark application
        const markTr = editor.view.state.tr;

        // Create and apply the suggestion mark
        const mark = editor.schema.marks.suggestion.create();
        markTr.addMark(from, from + sanitizedCompletion.length, mark);

        // Apply mark
        editor.view.dispatch(markTr);

        // Update suggestion controls position after the DOM has updated
        requestAnimationFrame(() => {
          if (!editor?.view?.coordsAtPos) return;

          try {
            const coords = editor.view.coordsAtPos(from);
            if (coords) {
              console.log("Suggestion position:", coords);
              setSuggestionPosition({
                x: Math.max(0, coords.left),
                y: Math.max(0, coords.bottom + window.scrollY),
              });
              setShowSuggestionControls(true);
            } else {
              console.error("Coords not found for position:", from);
            }
          } catch (error) {
            console.error("Error calculating suggestion position:", error);
            setShowSuggestionControls(false);
          }
        });
      } catch (error) {
        console.error("Error inserting suggestion:", error);
        setShowSuggestionControls(false);
      }
    },
    [editor, setSuggestionPosition, setShowSuggestionControls]
  );

  useEffect(() => {
    if (!editor || !autoComplete) return;

    let timeout: ReturnType<typeof setTimeout>;
    let lastKeyWasSpace = false;
    let mounted = true;

    const handleAutoComplete = async () => {
      const now = Date.now();
      const timeSinceLastSuggestion = now - lastSuggestionTime;
      if (timeSinceLastSuggestion < 60000) return;

      const { from } = editor.state.selection;
      const docSize = editor.state.doc.nodeSize - 2;

      if (from < 1 || from > docSize) {
        setCurrentSuggestion(null);
        setSuggestionPos(null);
        setShowSuggestionControls(false);
        return;
      }

      const currentContent = editor.state.doc.textBetween(
        Math.max(0, from - 100),
        from
      );

      if (currentContent.length < 5) {
        setCurrentSuggestion(null);
        setSuggestionPos(null);
        setShowSuggestionControls(false);
        return;
      }

      try {
        const documentContext = {
          title: documentTitle,
          content: editor.getHTML(),
          selection: null,
        };

        const completion = await getAutoCompletion(
          currentContent,
          documentContext
        );

        if (!mounted || !completion || !editor) return;

        setLastSuggestionTime(now);
        setCurrentSuggestion(completion);
        setSuggestionPos(from);

        await insertSuggestion(completion, from);
      } catch (error) {
        console.error("Auto-completion error:", error);
        if (mounted) {
          setCurrentSuggestion(null);
          setSuggestionPos(null);
          setShowSuggestionControls(false);
        }
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!mounted) return;

      if (event.key === "Tab" && currentSuggestion && suggestionPos !== null) {
        event.preventDefault();
        acceptSuggestion();
      } else if (event.key === "Escape") {
        event.preventDefault();
        declineSuggestion();
      } else if (event.key === " ") {
        lastKeyWasSpace = true;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!mounted) return;

      if (event.key === "Tab" || event.key === "Escape") return;

      if (event.key === " ") {
        lastKeyWasSpace = false;
        return;
      }

      if (
        !lastKeyWasSpace &&
        event.key.length === 1 &&
        currentSuggestion &&
        suggestionPos !== null
      ) {
        declineSuggestion();
      }

      clearTimeout(timeout);
      if (!lastKeyWasSpace) {
        timeout = setTimeout(handleAutoComplete, 1000);
      }
    };

    if (editor?.view?.dom) {
      const editorElement = editor.view.dom;
      editorElement.addEventListener("keyup", handleKeyUp);
      editorElement.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      mounted = false;
      clearTimeout(timeout);
      if (editor?.view?.dom) {
        const editorElement = editor.view.dom;
        editorElement.removeEventListener("keyup", handleKeyUp);
        editorElement.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [
    editor,
    autoComplete,
    documentTitle,
    currentSuggestion,
    suggestionPos,
    acceptSuggestion,
    declineSuggestion,
    lastSuggestionTime,
    setCurrentSuggestion,
    setSuggestionPos,
    setShowSuggestionControls,
    setSuggestionPosition,
    setLastSuggestionTime,
    insertSuggestion,
  ]);
};
