import { X } from "lucide-react";

interface MenuProps {
  isVisible: boolean;
  cords: { x: number; y: number };
  onClose: () => void;
  onRemove: (index: number) => void;
  onRoleChange: (role: "editor" | "viewer") => void;
}

const Menu = ({ isVisible, cords, onRemove, onRoleChange, onClose }: MenuProps) => {
  if (!isVisible) return null;
  console.log(cords);
  return (
    <div
      style={{ top: cords.y - 320, left: cords.x - 800 }}
      className="fixed z-[99] bg-white shadow-lg rounded-lg border border-gray-200 p-2 min-w-[150px]"
    >
      <header className="flex items-center justify-center gap-4">
        <h3>Options</h3>
        <X size={18} className="text-gray-600 hover:text-black transition-all duration-200 cursor-pointer" onClick={onClose}/>
      </header>

      <div className="px-3 py-2 text-sm text-gray-600 rounded-md">
        <div className="flex items-center justify-between">
          <span>Role</span>
          <select
            onChange={(e) =>
              onRoleChange(e.target.value as "editor" | "viewer")
            }
            className="ml-2 text-sm border rounded px-3 appearance-none py-2 cursor-pointer hover:bg-gray-50"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select>
        </div>
      </div>
      <button
        onClick={() => onRemove(1)}
        className="bg-red-600 text-white px-3 py-2 text-sm rounded-md w-full hover:bg-red-700 flex items-center justify-center gap-2 transitions-all duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        Remove
      </button>
    </div>
  );
};

export default Menu;
