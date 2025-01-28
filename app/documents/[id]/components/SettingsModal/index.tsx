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
    id: document.id,
    title: document.title,
    type: document.type as "blog" | "article" | "academic" | "script",
    status: document.status as "draft" | "completed",
    content: document.content,
    owner: document.owner,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const updateDocument = async () => {
    if (!document.owner) {
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
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center p-4 z-50 w-screen h-screen">
      <section className="bg-white w-full max-w-md rounded-xl shadow-2xl transform transition-all">
        {/* Header */}
        <header className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Document Settings
            </h2>
            <button
              onClick={() => onClose(true)}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="text-gray-500 hover:text-gray-700" size={20} />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 space-y-6">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-center justify-between">
              <span className="text-green-700 text-sm font-medium">
                Document successfully updated!
              </span>
              <button
                onClick={() => setSuccess(false)}
                className="p-1 rounded-full hover:bg-green-100 transition-colors"
              >
                <X size={16} className="text-green-600" />
              </button>
            </div>
          )}

          {/* Document Title */}
          <div className="space-y-1.5">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
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
              className={`w-full px-3 py-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 disabled:bg-gray-50 disabled:text-gray-500 transition-colors ${
                error
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter document title"
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>

          {/* Document Type */}
          <div className="space-y-1.5">
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Document Type
            </label>
            <div className="relative">
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
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 appearance-none cursor-pointer disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed pr-10"
              >
                <option value="blog">Blog</option>
                <option value="article">Article</option>
                <option value="academic">Academic</option>
                <option value="script">Script</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Document Status */}
          <div className="space-y-1.5">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Document Status
            </label>
            <div className="relative">
              <select
                id="status"
                value={newDocument.status}
                disabled={loading}
                onChange={(e) =>
                  setNewDocument({
                    ...newDocument,
                    status: e.target.value as "draft" | "completed",
                  })
                }
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 appearance-none cursor-pointer disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed pr-10"
              >
                <option value="draft">Draft</option>
                <option value="completed">Completed</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Update Button */}
          <button
            onClick={updateDocument}
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600 flex items-center justify-center space-x-2"
          >
            {loading ? "Updating..." : "Update Document"}
          </button>
        </main>
      </section>
    </div>
  );
};

export default SettingsModal;
