import { useEffect, useCallback, useRef } from "react";
import { Editor } from "@tiptap/core";
import { getAutoCompletion } from "@/utils/document/AIchat";
import { DocumentType } from "@/utils/types";

interface AutoCompleteProps {
  editor: Editor | null;
  autoComplete: boolean;
  document: DocumentType;
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
  document,
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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const mounted = useRef(true);

  const insertSuggestion = useCallback(
    async (completion: string, from: number) => {
      console.log("Inserting suggestion:", completion, from);
      if (!editor?.view?.state) return;

      try {
        // Sanitize and trim the completion to ensure clean text insertion.
        const sanitizedCompletion = completion
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
          .replace(/\uFFFD/g, "")
          .trim();

        if (!sanitizedCompletion) return;

        const { state } = editor.view;
        const docSize = state.doc.nodeSize - 2;

        if (from < 1 || from > docSize) {
          console.error("Invalid position for suggestion insertion:", from);
          return;
        }

        // Create a SINGLE transaction for all changes
        const tr = state.tr;
        const suggestionMark = editor.schema.marks.suggestion;

        // Remove existing suggestion marks
        if (suggestionMark) {
          tr.removeMark(0, docSize, suggestionMark);
        }

        // Insert clean text
        tr.insertText(" " + sanitizedCompletion, from);

        // Add suggestion mark
        if (suggestionMark) {
          const mark = suggestionMark.create();
          tr.addMark(from, from + sanitizedCompletion.length, mark);
        }

        // Dispatch changes
        editor.view.dispatch(tr);

        // Use requestAnimationFrame to ensure the DOM is updated before measuring coordinates
        requestAnimationFrame(() => {
          if (!editor?.view?.coordsAtPos) return;
          try {
            const coords = editor.view.coordsAtPos(from);
            if (coords) {
              setSuggestionPosition({
                x: Math.max(0, coords.left),
                y: Math.max(0, coords.bottom + window.scrollY),
              });
              setShowSuggestionControls(true);
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
    if (!editor || !editor.view.dom) {
      console.log(
        "Skipping auto-complete setup - editor not ready:",
        editor?.view.dom
      );
      return;
    }

    const editorElement = editor.view.dom;
    const handleAutoComplete = async () => {
      console.log("Auto-complete triggered!");
      if (!autoComplete) {
        return;
      }
      console.log("Handle auto-complete called");
      const now = Date.now();
      const timeSinceLastSuggestion = now - lastSuggestionTime;
      if (timeSinceLastSuggestion <= 60000) {
        console.log("Too soon for auto-completion.");
        return;
      }

      const { from } = editor.state.selection;
      const docSize = editor.state.doc.nodeSize - 2;
      console.log("Selection for auto-completion:", from);
      if (from < 1 || from > docSize) {
        setCurrentSuggestion(null);
        setSuggestionPos(null);
        setShowSuggestionControls(false);
        console.log("Invalid selection for auto-completion.");
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
        console.log("Content too short for auto-completion.");
        return;
      }

      console.log("Content for auto-completion:", currentContent);
      try {
        const documentContext = {
          title: document.title,
          content: editor.getHTML(),
          selection: null,
        };
        const completion = await getAutoCompletion(
          currentContent,
          documentContext
        );
        if (!completion || !editor) return;
        console.warn("Auto-completion result:", completion);
        setLastSuggestionTime(now);
        setCurrentSuggestion(completion);
        setSuggestionPos(from);

        await insertSuggestion(completion, from);
      } catch (error) {
        console.error("Auto-completion error:", error);
        if (mounted.current) {
          setCurrentSuggestion(null);
          setSuggestionPos(null);
          setShowSuggestionControls(false);
          console.log("Auto-completion failed.");
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      // if (!mounted.current) return;
      console.log("KeyUp event triggered:", event.key);

      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current);
      }

      if (event.altKey || event.metaKey || event.ctrlKey) return;

      // If there's an existing suggestion, decline it on keyup.
      if (currentSuggestion && suggestionPos !== null) {
        declineSuggestion();
      }

      // Trigger auto-complete after a short pause (e.g. 1 second)
      timeoutRef.current = setTimeout(() => {
        if (mounted.current) {
          console.log("Triggering auto-complete after typing pause");
          handleAutoComplete();
        }
      }, 1000);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!mounted.current) return;
      console.log("KeyDown event triggered:", event.key);

      if (event.key === "Tab" && currentSuggestion && suggestionPos !== null) {
        event.preventDefault();
        acceptSuggestion();
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        declineSuggestion();
        return;
      }
    };

    handleAutoComplete();
    editorElement.addEventListener("keyup", handleKeyUp);
    editorElement.addEventListener("keydown", handleKeyDown);
    return () => {
      // console.log("Cleaning up auto-complete");
      mounted.current = false;
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current);
      }
      editorElement.removeEventListener("keyup", handleKeyUp);
      editorElement.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    editor,
    autoComplete,
    document,
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
