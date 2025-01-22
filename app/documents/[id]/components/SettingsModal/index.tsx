import { saveDocument } from "@/utils/document/save";
import { DocumentType } from "@/utils/types";
import { X } from "lucide-react";
import React, { useState } from "react";

const SettingsModal = ({
  isOpen,
  onClose,
  document,
  setDocument,
}: {
  isOpen: boolean;
  onClose: (closed: boolean) => void;
  document: DocumentType;
  setDocument: (document: DocumentType) => void;
}) => {
  const [newDocument, setNewDocument] = useState<DocumentType>({
    ...document,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const updateDocument = async () => {
    if (!newDocument.title) {
      setError("Document title is required");
      return;
    }
    setLoading(true);
    const response = await saveDocument(newDocument);
    setLoading(false);
    if (response.status !== 200) {
      setError(
        response.data?.message ||
          "An error occurred while updating the document"
      );
      return;
    }
    setDocument(newDocument);
    setSuccess(true);
  };

  return (
    <section className="fixed flex flex-col -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-gray-50 p-4 rounded-lg shadow-xl">
      <header className="flex justify-between">
        <h2 className="text-2xl">Document Settings</h2>
        <button
          onClick={() => onClose(true)}
          className="hover:text-black text-slate-400 transition-all duration-200"
        >
          <X />
        </button>
      </header>
      <main className="flex flex-col mx-auto my-5">
        {success && (
          <div className="bg-green-400/50 flex items-center justify-around gap-6 p-2 rounded-lg">
            <span className="text-green-600 text-sm">
              Document succesfully updated!
            </span>
            <button
              onClick={() => setSuccess(false)}
              className="hover:text-black text-gray-500 transition-all duration-200"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div>
          <label htmlFor="title" className="text-gray-800">
            Document Title
          </label>
          <input
            type="text"
            id="title"
            value={newDocument.title}
            disabled={loading}
            onChange={(e) =>
              setNewDocument({ ...newDocument, title: e.target.value })
            }
            className={`w-full pl-2 pr-14 py-2 border mt-2 border-gray-300 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 ${
              error ? "border-red-500" : ""
            }`}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <div>
          <label htmlFor="email" className="text-gray-800">
            Document Type
          </label>
          <select
            id="type"
            value={newDocument.type}
            disabled={loading}
            onChange={(e) =>
              setNewDocument({
                ...newDocument,
                type: e.target.value as
                  | "blog"
                  | "article"
                  | "academic"
                  | "script",
              })
            }
            className="w-full pl-2 pr-14 py-2 border mt-2 border-gray-300 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800"
          >
            <option value="blog">Blog</option>
            <option value="article">Article</option>
            <option value="academic">Academic</option>
            <option value="script">Script</option>
          </select>
        </div>
        <div>
          <label htmlFor="email" className="text-gray-800">
            Document Status
          </label>
          <select
            id="description"
            value={newDocument.status}
            disabled={loading}
            onChange={(e) =>
              setNewDocument({
                ...newDocument,
                status: e.target.value as "draft" | "completed",
              })
            }
            className="w-full pl-2 pr-14 py-2 border mt-2 border-gray-300 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800"
          >
            <option value="draft">Draft</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button
          onClick={updateDocument}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg my-2 hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 w-full flex align-center gap-4 justify-center mt-4"
        >
          {loading ? "Updating..." : "Update Document"}
        </button>
      </main>
    </section>
  );
};

export default SettingsModal;
