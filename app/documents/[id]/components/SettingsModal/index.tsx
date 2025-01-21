import { X } from "lucide-react";
import React, { useState } from "react";

const SettingsModal = ({
  isOpen,
  onClose,
  title,
}: {
  isOpen: boolean;
  onClose: (closed: boolean) => void;
  title: string;
}) => {
  const [document, setDocument] = useState({
    title,
  });
  const [error, setError] = useState("");
  if (!isOpen) return null;

  const updateDocument = () => {
    if (!document) {
      setError("Document title is required");
      return;
    }
    onClose(false);
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
        <div>
          <label htmlFor="email" className="text-gray-800">
            Document Title
          </label>
          <input
            type="text"
            id="email"
            value={document.title}
            onChange={(e) => setDocument({ ...document, title: e.target.value })}
            className={`w-full pl-2 pr-14 py-2 border mt-2 border-gray-300 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 ${
              error ? "border-red-500" : ""
            }`}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button onClick={updateDocument} className="bg-blue-600 text-white px-4 py-2 rounded-lg my-2 hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 w-full flex align-center gap-4 justify-center mt-4">
            Update Document
          </button>
        </div>
      </main>
    </section>
  );
};

export default SettingsModal;
