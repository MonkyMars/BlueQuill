"use client";
import { useState } from "react";

export interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newTitle: string) => void;
  currentTitle: string;
}

export function RenameModal({
  isOpen,
  onClose,
  onRename,
  currentTitle,
}: RenameModalProps) {
  const [newTitle, setNewTitle] = useState(currentTitle);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg p-6 w-96 transform transition-all duration-300 ease-in-out animate-scaleIn">
      <h3 className="text-lg font-semibold mb-4">Rename Document</h3>
      <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        placeholder="Enter new title"
      />
      <div className="flex justify-end space-x-2 mt-4">
        <button
        onClick={onClose}
        className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
        Cancel
        </button>
        <button
        onClick={() => {
          onRename(newTitle);
          onClose();
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
        Rename
        </button>
      </div>
      </div>
    </div>
  );
}
