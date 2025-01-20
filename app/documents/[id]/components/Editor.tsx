import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import TextStyle from "@tiptap/extension-text-style";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import { Extension as TiptapExtension, Mark } from "@tiptap/core";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { useEffect, useState } from "react";
import { EditorContent } from "@tiptap/react";

type FontSizeOptions = {
  types: string[];
};

const FontSize = TiptapExtension.create<FontSizeOptions>({
  name: "fontSize",
  addAttributes() {
    return {
      size: {
        default: "normal",
        parseHTML: (element: HTMLElement) =>
          element.getAttribute("data-size") || "normal",
        renderHTML: (attributes: { size: string }) => {
          const sizes: Record<string, string> = {
            small: "text-sm",
            normal: "text-base",
            large: "text-lg",
            "extra-large": "text-xl",
            huge: "text-2xl",
          };
          return {
            "data-size": attributes.size,
            class: sizes[attributes.size] || sizes.normal,
          };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "span[data-size]",
      },
    ];
  },
  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, string> }) {
    return ["span", HTMLAttributes, 0];
  },
});

const Suggestion = Mark.create({
  name: "suggestion",
  priority: 1000,
  keepOnSplit: false,
  inclusive: true,
  parseHTML() {
    return [
      {
        tag: "span[data-suggestion]",
      },
    ];
  },
  renderHTML() {
    return [
      "span",
      {
        "data-suggestion": "",
        class: "suggestion bg-blue-100/50",
      },
      0,
    ];
  },
});

interface EditorProps {
  content: string;
  onUpdate?: (html: string) => void;
}

export const Editor = ({ content, onUpdate }: EditorProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        document: false,
        paragraph: false,
        text: false,
        heading: false,
        bold: false,
        italic: false,
      }),
      Document,
      Paragraph.configure({
        HTMLAttributes: {
          class: "mb-4",
        },
      }),
      Text,
      Bold.configure({
        HTMLAttributes: {
          class: "font-bold",
        },
      }),
      Italic.configure({
        HTMLAttributes: {
          class: "italic",
        },
      }),
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: (level: number) => {
          const classes = {
            1: "text-2xl font-bold mb-4",
            2: "text-xl font-bold mb-3",
            3: "text-lg font-bold mb-2",
          };
          return {
            class: classes[level as keyof typeof classes] || "",
          };
        },
      }),
      TextStyle,
      FontSize.configure({
        types: ["textStyle"],
      }),
      Suggestion,
      Underline.configure({
        HTMLAttributes: {
          class: "underline",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 hover:underline cursor-pointer",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    content: isMounted ? content : "",
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[200px] p-4 bg-white text-gray-900",
      },
      transformPastedHTML(html) {
        return html.replace(/class="[^"]*"/g, "");
      },
    },
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && isMounted && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content, isMounted]);

  if (!editor || !isMounted) {
    return null;
  }

  return <EditorContent editor={editor} className="bg-white text-gray-900" />;
};

export const useCustomEditor = (
  content: string,
  onUpdate?: (html: string) => void
) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        document: false,
        paragraph: false,
        text: false,
        heading: false,
        bold: false,
        italic: false,
      }),
      Document,
      Paragraph.configure({
        HTMLAttributes: {
          class: "mb-4",
        },
      }),
      Text,
      Bold.configure({
        HTMLAttributes: {
          class: "font-bold",
        },
      }),
      Italic.configure({
        HTMLAttributes: {
          class: "italic",
        },
      }),
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: (level: number) => {
          const classes = {
            1: "text-2xl font-bold mb-4",
            2: "text-xl font-bold mb-3",
            3: "text-lg font-bold mb-2",
          };
          return {
            class: classes[level as keyof typeof classes] || "",
          };
        },
      }),
      TextStyle,
      FontSize.configure({
        types: ["textStyle"],
      }),
      Suggestion,
      Underline.configure({
        HTMLAttributes: {
          class: "underline",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 hover:underline cursor-pointer",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    content: isMounted ? content : "",
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[200px] p-4",
      },
      transformPastedHTML(html) {
        return html.replace(/class="[^"]*"/g, "");
      },
    },
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getHTML());
    },
  });

  return editor;
};
