"use client";
import React, { useState, useEffect } from "react";
import {
  Send,
  X,
  Mail,
  FileUser,
} from "lucide-react";

import ProfilePictureCanvas from "@/utils/user/profilePicture";
import Menu from "./menu";
import { addCollaborator, removeCollaborator, updateCollaboratorRole, getCollaborators, CollaboratorWithProfile } from '@/utils/document/collaborators';
import { DocumentType } from "@/utils/types";

type CollaboratorRole = 'editor' | 'viewer';

const InviteModal = ({
  isOpen,
  onClose,
  document
}: {
  isOpen: boolean;
  onClose: (closed: boolean) => void;
  document: DocumentType;
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState<CollaboratorRole>("editor");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");
  const [collaborators, setCollaborators] = useState<CollaboratorWithProfile[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadCollaborators();
    }
  }, [isOpen, document.id]);

  const loadCollaborators = async () => {
    const result = await getCollaborators(document.id);
    if (result.success && result.collaborators) {
      setCollaborators(result.collaborators);
    }
  };

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }
  
    const result = await addCollaborator(document.id, email, role);
    
    if (result.success) {
      setSuccess(`Successfully added ${email} as a ${role}`);
      setEmail("");
      loadCollaborators();
    } else {
      setError(result.error || "Failed to add collaborator");
    }
    
    setLoading(false);
  };

  const handleRemoveCollaborator = async (userId: string) => {
    const result = await removeCollaborator(document.id, userId);
    
    if (result.success) {
      loadCollaborators();
    } else {
      setError(result.error || "Failed to remove collaborator");
    }
  };

  const isValidRole = (value: string): value is CollaboratorRole => {
    return value === 'editor' || value === 'viewer';
  };

  const handleRoleUpdate = async (userId: string, newRole: CollaboratorRole) => {
    const result = await updateCollaboratorRole(document.id, userId, newRole);
    
    if (result.success) {
      loadCollaborators();
    } else {
      setError(result.error || "Failed to update collaborator role");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center p-4 z-50 h-screen w-screen">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl transform transition-all">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Invite Collaborators</h2>
            <button
              onClick={() => onClose(true)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="text-gray-500 hover:text-gray-700" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <form onSubmit={handleInvite}>
            {success && (
              <div className="mb-6 bg-green-50 border border-green-100 rounded-lg p-3 flex items-center justify-between">
                <span className="text-green-700 text-sm font-medium">{success}</span>
                <button
                  onClick={() => setSuccess("")}
                  className="p-1 rounded-full hover:bg-green-100 transition-colors"
                >
                  <X size={16} className="text-green-600" />
                </button>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-100 rounded-lg p-3 flex items-center justify-between">
                <span className="text-red-700 text-sm font-medium">{error}</span>
                <button
                  onClick={() => setError("")}
                  className="p-1 rounded-full hover:bg-red-100 transition-colors"
                >
                  <X size={16} className="text-red-600" />
                </button>
              </div>
            )}

            <div className="space-y-1.5 mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-12 py-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 ${
                    error ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="space-y-1.5 mb-6">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <div className="relative">
                <FileUser
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <select
                  id="role"
                  value={role}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (isValidRole(value)) {
                      setRole(value);
                    }
                  }}
                  className="w-full pl-10 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 appearance-none cursor-pointer pr-10"
                >
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600 flex items-center justify-center space-x-2"
            >
              <span>{loading ? "Adding..." : "Add Collaborator"}</span>
              <Send size={18} />
            </button>
          </form>
        </div>

        {/* Current Collaborators */}
        <div className="border-t border-gray-100 p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            Current Collaborators <span className="ml-2 text-gray-500">({collaborators.length})</span>
          </h3>
          <div className="space-y-2">
            {collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <ProfilePictureCanvas name={collaborator.profiles.full_name} size={36} />
                  <div>
                    <p className="font-medium text-gray-900">{collaborator.profiles.full_name}</p>
                    <p className="text-sm text-gray-500">{collaborator.profiles.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      collaborator.role === "editor"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {collaborator.role}
                  </span>
                  <Menu
                    onRemove={() => handleRemoveCollaborator(collaborator.user_id)}
                    onRoleChange={(role) => {
                      if (isValidRole(role)) {
                        handleRoleUpdate(collaborator.user_id, role);
                      }
                    }}
                    user={{
                      id: collaborator.user_id,
                      role: collaborator.role,
                      email: collaborator.profiles.email,
                      full_name: collaborator.profiles.full_name
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
