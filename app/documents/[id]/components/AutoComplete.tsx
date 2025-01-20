import { useEffect, useCallback, useRef } from "react";
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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastKeyWasSpace = useRef(false);
  const mounted = useRef(true);

  const insertSuggestion = useCallback(
    async (completion: string, from: number) => {
      console.log("Inserting suggestion:", completion, from);
      if (!editor?.view?.state) return;
  
      try {
        const sanitizedCompletion = completion
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
          .replace(/\uFFFD/g, "");
  
        if (!sanitizedCompletion) return;
  
        const { state } = editor.view;
        const docSize = state.doc.content.size;
  
        if (from < 0 || from > docSize) {
          console.error("Invalid position for suggestion insertion:", from);
          return;
        }
  
        // Create a SINGLE transaction for all changes
        const tr = state.tr;
        const suggestionMark = editor.schema.marks.suggestion;
  
        // 1. Remove existing suggestion marks
        if (suggestionMark) {
          tr.removeMark(0, docSize, suggestionMark);
        }
  
        // 2. Insert text
        tr.insertText(sanitizedCompletion, from);
  
        // 3. Add new suggestion mark
        if (suggestionMark) {
          const mark = suggestionMark.create();
          tr.addMark(from, from + sanitizedCompletion.length, mark);
        }
  
        // Dispatch all changes in one transaction
        editor.view.dispatch(tr);
  
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
    console.log("Auto-complete effect triggered!");
    if (!editor || !autoComplete || !editor.view.dom) {
      console.log("Skipping auto-complete setup - editor not ready:", editor?.view.dom);
      return;
    }

    const editorElement = editor.view.dom;
    console.log("Attaching listeners to:", editorElement);

    const handleAutoComplete = async () => {
      console.log("Handle auto-complete called");
      const now = Date.now();
      const timeSinceLastSuggestion = now - lastSuggestionTime;
      if (timeSinceLastSuggestion < 60000) {
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
          title: documentTitle,
          content: editor.getHTML(),
          selection: null,
        };
        console.log("Document context for auto-completion:", documentContext);
        const completion = await getAutoCompletion(
          currentContent,
          documentContext
        );
        console.log("Auto-completion result:", completion);
        if (!mounted.current || !completion || !editor) return;
    
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
      if (!mounted.current) return;
      console.log("KeyUp event triggered:", event.key);
    
      if (timeoutRef.current !== undefined) {
        clearTimeout(timeoutRef.current);
      }
    
      if (event.key.length > 1 || event.metaKey || event.ctrlKey) {
        return;
      }
    
      if (event.key === " ") {
        lastKeyWasSpace.current = false;
        return;
      }
    
      // Decline suggestion only if we have an active one
      if (currentSuggestion && suggestionPos !== null) {
        declineSuggestion();
      }
    
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
    
      if (event.key === " ") {
        lastKeyWasSpace.current = true;
      }
    };

    // Add event listeners
    editorElement.addEventListener("keyup", handleKeyUp);
    editorElement.addEventListener("keydown", handleKeyDown);

    return () => {
      console.log("Cleaning up auto-complete");
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