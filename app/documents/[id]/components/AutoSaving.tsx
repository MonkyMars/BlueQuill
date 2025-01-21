import { saveDocument } from "@/utils/document/save";
import type { Editor } from "@tiptap/core";

interface AutoSavingProps {
  editor: Editor;
  documentId: string;
  documentTitle: string;
  ownerId: string;
  setSaving: (saving: boolean) => void;
}

const debounce = (func: (...args: unknown[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<typeof func>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const AutoSaving = ({
  editor,
  documentId,
  documentTitle,
  ownerId,
  setSaving,
}: AutoSavingProps) => {
  const debouncedSave = debounce(() => {
    setSaving(true);
    saveDocument({
      id: documentId,
      title: documentTitle,
      content: editor.getHTML(),
      owner: ownerId,
    }).then(() => {
      setSaving(false);
    });
  }, 2000);

  editor.on("update", debouncedSave); // editor.on("update", ...) does not work. need to find an alternative.

  return null;
};