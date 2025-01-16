"use client";

import { useState, useCallback, useEffect } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import type { DocumentType } from "@/utils/types";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { useParams, useRouter } from "next/navigation";
import { saveDocument } from "@/utils/document/save";
import { fetchDocument } from "@/utils/document/fetch";
import { aiChatbot, getAutoCompletion } from "@/utils/document/AIchat";
import { Mark } from '@tiptap/core';
import { useAuth } from "@/utils/AuthProvider";

interface AIAssistantMessage {
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
  canApply?: boolean;
}

const Suggestion = Mark.create({
  name: 'suggestion',
  priority: 1000,
  keepOnSplit: false,
  inclusive: false,
  parseHTML() {
    return [
      {
        tag: 'span',
        class: 'suggestion',
      },
    ]
  },
  renderHTML() {
    return ['span', { class: 'suggestion' }, 0]
  }
});

const FontSize = Mark.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    }
  },
  addAttributes() {
    return {
      class: {
        default: 'text-base',
        parseHTML: element => element.getAttribute('class'),
        renderHTML: attributes => {
          if (!attributes.class) {
            return {}
          }
          return {
            class: attributes.class,
          }
        },
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'span',
        getAttrs: element => {
          const classNames = element.getAttribute('class')
          if (!classNames) return false
          return {
            class: classNames.split(' ').find(name => name.startsWith('text-')),
          }
        },
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0]
  },
});

const TEXT_SIZES = [
  { name: 'Small', class: 'text-sm' },
  { name: 'Normal', class: 'text-base' },
  { name: 'Large', class: 'text-2xl' },
  { name: 'Extra Large', class: 'text-4xl' },
  { name: 'Huge', class: 'text-6xl' },
];

interface LinkEditorProps {
  editor: ReturnType<typeof useEditor>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const LinkEditor = ({ editor, isOpen, setIsOpen }: LinkEditorProps) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  useEffect(() => {
    if (isOpen && editor) {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to);
      setLinkText(text);
      
      const linkMark = editor.getAttributes('link');
      setLinkUrl(linkMark.href || '');
    }
  }, [isOpen, editor]);

  const saveLink = () => {
    if (!editor || !linkUrl) return;

    if (linkText !== editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to)) {
      editor.commands.insertContent(linkText);
    }
    editor.chain()
      .focus()
      .setLink({ href: linkUrl })
      .run();

    setIsOpen(false);
  };

  const removeLink = () => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 bg-white rounded-lg shadow-lg p-2 w-full sm:w-[500px]">
      <input
      type="text"
      placeholder="Link text"
      value={linkText}
      onChange={(e) => setLinkText(e.target.value)}
      className="w-full sm:flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-800"
      />
      <input
      type="text"
      placeholder="URL"
      value={linkUrl}
      onChange={(e) => setLinkUrl(e.target.value)}
      className="w-full sm:flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-800"
      />
      <button
        onClick={saveLink}
        className="p-1 rounded hover:bg-blue-50 text-blue-600"
        title="Save link"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </button>
      <button
        onClick={removeLink}
        className="p-1 rounded hover:bg-red-50 text-red-600"
        title="Remove link"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default function EditDocument() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [documentTitle, setDocumentTitle] = useState("Untitled Document");
  const [isSaving, setIsSaving] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiMessages, setAiMessages] = useState<AIAssistantMessage[]>([]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [content, setContent] = useState<string>("");
  const [autoComplete, setAutoComplete] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState<string | null>(null);
  const [suggestionPos, setSuggestionPos] = useState<number | null>(null);
  const [showSuggestionControls, setShowSuggestionControls] = useState(false);
  const [suggestionPosition, setSuggestionPosition] = useState({ x: 0, y: 0 });
  const [lastSuggestionTime, setLastSuggestionTime] = useState<number>(0);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showLinkEditor, setShowLinkEditor] = useState(false);
  
  useEffect(() => {
    const fetchDocumentAction = async () => {
      if(!user) return;
      try {
        const document = await fetchDocument(params.id as string);
        if (!document) {
          router.push("/documents");
          return;
        }
        console.log(document.owner)
        if(String(document.id) !== String(params.id) || String(document.owner) !== String(user.id)) {
          window.location.href = '/documents';
          return;
        }
        setDocumentTitle(document.title);
        setContent(document.content);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching document:", error);
        router.push("/documents");
      }
    };

    fetchDocumentAction();
  }, [params.id, router, user]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      Paragraph,
      Text,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      TextStyle,
      FontSize,
      Suggestion,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:underline cursor-pointer',
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none",
      }
    }
  });

  const acceptSuggestion = useCallback(() => {
    if (!currentSuggestion || suggestionPos === null || !editor) return;
    
    const tr = editor.state.tr;
    tr.removeMark(suggestionPos, suggestionPos + currentSuggestion.length);
    editor.view.dispatch(tr);
    
    setCurrentSuggestion(null);
    setSuggestionPos(null);
    setShowSuggestionControls(false);
  }, [currentSuggestion, suggestionPos, editor]);

  const declineSuggestion = useCallback(() => {
    if (!currentSuggestion || suggestionPos === null || !editor) return;
    
    const tr = editor.state.tr.delete(
      suggestionPos,
      suggestionPos + currentSuggestion.length
    );
    editor.view.dispatch(tr);
    
    setCurrentSuggestion(null);
    setSuggestionPos(null);
    setShowSuggestionControls(false);
    editor.commands.focus();
  }, [currentSuggestion, suggestionPos, editor]);

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleSave = useCallback(async () => {
    if(!user) return;
    setIsSaving(true);
    try {
      const saveableDocument: DocumentType = {
        owner: user.id,
        id: params.id as string,
        title: documentTitle,
        content: editor?.getHTML() as string,
        updatedAt: new Date(),
      };
      await saveDocument(saveableDocument);
    } catch (error) {
      console.error("Error saving document:", error);
    } finally {
      setIsSaving(false);
    }
  }, [params.id, documentTitle, editor, user]);

  const handleAIAssist = useCallback(async () => {
    if (!aiPrompt) return;
    const newMessage: AIAssistantMessage = {
      role: "user",
      content: aiPrompt,
      timestamp: new Date(),
    };
    setAiPrompt("");
    setAiMessages((prevMessages) => [...prevMessages, newMessage]);
    
    const documentContext = {
      title: documentTitle,
      content: editor?.getHTML() || "",
      selection: editor?.state.selection.content().content.size 
        ? editor?.state.selection.content().content.toJSON()
        : null
    };

    const aiResponse = await aiChatbot([...aiMessages, newMessage], documentContext);
    if (!aiResponse) return;
    
    const newAiMessage: AIAssistantMessage = {
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
      canApply: true
    };
    setAiMessages((prevMessages) => [...prevMessages, newAiMessage]);
  }, [aiPrompt, aiMessages, documentTitle, editor]);

  const handleApplyAISuggestion = useCallback((messageIndex: number) => {
    const message = aiMessages[messageIndex];
    if (!message || message.role !== "assistant" || !editor) return;

    if (editor.state.selection.content().content.size) {
      editor.commands.insertContentAt(editor.state.selection.from, message.content);
    } else {
      editor.commands.insertContent(message.content);
    }
  }, [aiMessages, editor]);

  const handleCopyAISuggestion = useCallback((messageIndex: number) => {
    const message = aiMessages[messageIndex];
    if (!message) return;
    navigator.clipboard.writeText(message.content);
  }, [aiMessages]);

  useEffect(() => {
    if (!editor || !autoComplete) return;

    let timeout: NodeJS.Timeout;
    let lastKeyWasSpace = false;
    
    const handleAutoComplete = async () => {
      const now = Date.now();
      const timeSinceLastSuggestion = now - lastSuggestionTime;
      if (timeSinceLastSuggestion < 60000) {
        return;
      }

      const { from } = editor.state.selection;
      const currentContent = editor.state.doc.textBetween(Math.max(0, from - 100), from);
      
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
          selection: null
        };

        const completion = await getAutoCompletion(currentContent, documentContext);
        if (completion && editor) {
          setLastSuggestionTime(now);
          setCurrentSuggestion(completion);
          setSuggestionPos(from);

          // Insert suggestion with mark
          const tr = editor.state.tr.insertText(completion, from);
          tr.addMark(
            from,
            from + completion.length,
            editor.schema.marks.suggestion.create()
          );
          editor.view.dispatch(tr);

          // Get position for controls
          const coords = editor.view.coordsAtPos(from);
          setSuggestionPosition({ x: coords.left, y: coords.bottom });
          setShowSuggestionControls(true);
        }
      } catch (error) {
        console.error('Auto-completion error:', error);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && currentSuggestion && suggestionPos !== null) {
        event.preventDefault();
        acceptSuggestion();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        declineSuggestion();
      } else if (event.key === ' ') {
        lastKeyWasSpace = true;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Tab' || event.key === 'Escape') return;
      
      // Don't trigger autocompletion on space
      if (event.key === ' ') {
        lastKeyWasSpace = false;
        return;
      }

      // Only clear suggestion if it wasn't a space and we're actually typing
      if (!lastKeyWasSpace && event.key.length === 1 && currentSuggestion && suggestionPos !== null) {
        declineSuggestion();
      }
      
      clearTimeout(timeout);
      if (!lastKeyWasSpace) {
        timeout = setTimeout(handleAutoComplete, 1000);
      }
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener('keyup', handleKeyUp);
    editorElement.addEventListener('keydown', handleKeyDown);
    
    return () => {
      editorElement.removeEventListener('keyup', handleKeyUp);
      editorElement.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeout);
    };
  }, [editor, autoComplete, documentTitle, currentSuggestion, suggestionPos, acceptSuggestion, declineSuggestion, lastSuggestionTime]);

  // Add styles for suggestions
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .suggestion {
        color: #9CA3AF;
        opacity: 0;
        animation: fadeIn 0.3s ease-in-out forwards;
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateX(-5px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      /* Text size styles */
      .ProseMirror .text-sm {
        font-size: 0.875rem;
        line-height: 1.25rem;
      }
      
      .ProseMirror .text-base {
        font-size: 1rem;
        line-height: 1.5rem;
      }
      
      .ProseMirror .text-lg {
        font-size: 1.125rem;
        line-height: 1.75rem;
      }
      
      .ProseMirror .text-xl {
        font-size: 1.25rem;
        line-height: 1.75rem;
      }
      
      .ProseMirror .text-2xl {
        font-size: 1.5rem;
        line-height: 2rem;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSave();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.text-size-dropdown')) {
        setShowSizeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 z-10">
        <div className="container mx-auto px-4 text-gray-800">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-800"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <input
                type="text"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                className="text-xl font-semibold bg-transparent border-none focus:outline-none text-gray-800 px-2 py-1 rounded hover:bg-gray-100 focus:bg-gray-100"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setAutoComplete(!autoComplete)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  autoComplete
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Auto Complete
              </button>
              <button
                onClick={() => setShowAIPanel(!showAIPanel)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showAIPanel
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                AI Assistant
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>

          {/* Editor Controls */}
          {editor && (
            <div className="flex items-center space-x-2 py-2 border-t border-gray-200">
              <div className="relative text-size-dropdown">
                <button
                  onClick={() => setShowSizeDropdown(!showSizeDropdown)}
                  className="p-2 rounded hover:bg-gray-100 flex items-center"
                  title="Text size"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showSizeDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-40 z-50">
                    {TEXT_SIZES.map((size) => (
                      <button
                        key={size.class}
                        onClick={() => {
                          editor.chain().focus().setMark('fontSize', { class: size.class }).run();
                          setShowSizeDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                          editor.isActive('fontSize', { class: size.class }) ? 'bg-gray-100' : ''
                        }`}
                      >
                        <span className={size.class}>{size.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="w-px h-6 bg-gray-200 mx-2" />
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-100 ${
                  editor.isActive("bold") ? "bg-gray-100" : ""
                }`}
                title="Bold (Ctrl+B)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h8a4 4 0 100-8H6v8zm0 0h8a4 4 0 110 8H6v-8z" />
                </svg>
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-100 ${
                  editor.isActive("italic") ? "bg-gray-100" : ""
                }`}
                title="Italic (Ctrl+I)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </button>
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded hover:bg-gray-100 ${
                  editor.isActive("underline") ? "bg-gray-100" : ""
                }`}
                title="Underline (Ctrl+U)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 19h14M7 3v8a5 5 0 0010 0V3" />
                </svg>
              </button>
              <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-2 rounded hover:bg-gray-100 ${
                  editor.isActive("strike") ? "bg-gray-100" : ""
                }`}
                title="Strikethrough"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M9 5l-4 4 4 4M15 5l4 4-4 4" />
                </svg>
              </button>
              <div className="w-px h-6 bg-gray-200 mx-2" />
              <button
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={`p-2 rounded hover:bg-gray-100 ${
                  editor.isActive("paragraph") ? "bg-gray-100" : ""
                }`}
                title="Normal text"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => editor.chain().focus().clearNodes().setHeading({ level: 1 }).run()}
                className={`p-2 rounded hover:bg-gray-100 ${
                  editor.isActive("heading", { level: 1 }) ? "bg-gray-100" : ""
                }`}
                title="Heading 1"
              >
                H1
              </button>
              <button
                onClick={() => editor.chain().focus().clearNodes().setHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-gray-100 ${
                  editor.isActive("heading", { level: 2 }) ? "bg-gray-100" : ""
                }`}
                title="Heading 2"
              >
                H2
              </button>
              <button
                onClick={() => editor.chain().focus().clearNodes().setHeading({ level: 3 }).run()}
                className={`p-2 rounded hover:bg-gray-100 ${
                  editor.isActive("heading", { level: 3 }) ? "bg-gray-100" : ""
                }`}
                title="Heading 3"
              >
                H3
              </button>
              <div className="w-px h-6 bg-gray-200 mx-2" />
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-100 ${
                  editor.isActive("bulletList") ? "bg-gray-100" : ""
                }`}
                title="Bullet List"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-gray-100 ${
                  editor.isActive("orderedList") ? "bg-gray-100" : ""
                }`}
                title="Numbered List"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20h14M7 12h14M7 4h14M3 20h.01M3 12h.01M3 4h.01" />
                </svg>
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-gray-100 ${
                  editor.isActive("blockquote") ? "bg-gray-100" : ""
                }`}
                title="Quote"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              <button
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className="p-2 rounded hover:bg-gray-100"
                title="Horizontal Line"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-36">
        <div className="flex">
          {/* Editor */}
          <div className={`flex-1 ${showAIPanel ? "mr-4" : ""}`}>
            <EditorContent
              editor={editor}
              content={content}
              className="min-h-[calc(100vh-144px)] p-4"
              onChange={() => {
                if (editor) setContent(editor.getHTML());
              }}
            />
          </div>

          {showAIPanel && (
            <div className="w-80 bg-white border-l-2 border-gray-200">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  AI Assistant
                </h3>
                <div className="space-y-4 mb-4 h-[calc(100vh-400px)] overflow-y-auto">
                  {aiMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        message.role === "assistant"
                          ? "bg-blue-50 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                        {message.role === "assistant" && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleCopyAISuggestion(index)}
                              className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                            >
                              Copy
                            </button>
                            {message.canApply && (
                              <button
                                onClick={() => handleApplyAISuggestion(index)}
                                className="text-xs px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                              >
                                Apply
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Ask AI for help..."
                      className="flex-1 px-3 py-2 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleAIAssist();
                        }
                      }}
                    />
                    <button
                      onClick={handleAIAssist}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggestion Controls */}
      {showSuggestionControls && (
        <div 
          className="fixed z-50 flex items-center space-x-2 bg-white rounded-lg shadow-lg px-2 py-1 transition-opacity duration-200"
          style={{
            left: suggestionPosition.x,
            top: suggestionPosition.y + 4,
          }}
        >
          <button
            onClick={acceptSuggestion}
            className="p-1 rounded hover:bg-blue-50 text-blue-600"
            title="Accept (Tab)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button
            onClick={declineSuggestion}
            className="p-1 rounded hover:bg-red-50 text-red-600"
            title="Decline (Esc)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {editor && (
        <BubbleMenu 
          editor={editor} 
          shouldShow={({ editor }) => editor.isActive('link')}
          tippyOptions={{ duration: 100 }}
        >
          <LinkEditor editor={editor} isOpen={true} setIsOpen={() => {}} />
        </BubbleMenu>
      )}
      
      {/* Add link button to editor controls */}
      <button
        onClick={() => setShowLinkEditor(true)}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor?.isActive("link") ? "bg-gray-100" : ""
        }`}
        title="Add link"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </button>

      {/* Show link editor when button is clicked */}
      {showLinkEditor && editor && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-4">
            <LinkEditor 
              editor={editor} 
              isOpen={showLinkEditor} 
              setIsOpen={setShowLinkEditor} 
            />
          </div>
        </div>
      )}
    </main>
  );
}
