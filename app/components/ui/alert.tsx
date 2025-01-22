import React from "react";
import { AlertTriangle } from 'lucide-react';

interface AlertProps {
  props: {
  title: string;
  message: string;
  isVisible: boolean;
  closeText: string;
  confirmText: string;
  }
  onClose: () => void;
  onConfirm: () => void;
}

const Alert: React.FC<AlertProps> = ({ props, onClose, onConfirm }) => {
  if (!props.isVisible) {
    return null;
  }
  return (
   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-96">
      <header className="flex items-center space-x-2 text-black mb-2">
        <AlertTriangle className="h-6 w-6" />
        <h3 className="text-lg font-semibold">{props.title}</h3>
      </header>
      <p className="text-slate-700">{props.message}</p>
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => onClose()}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          {props.closeText}
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {props.confirmText}
        </button>
      </div>
    </div>
   </div>
  );
};

export default Alert;