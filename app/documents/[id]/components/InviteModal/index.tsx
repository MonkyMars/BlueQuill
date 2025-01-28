"use client";
import React, { useState } from "react";
import {
  Send,
  X,
  Mail,
  FileUser,
  ArrowRight,
} from "lucide-react";

import ProfilePictureCanvas from "@/utils/user/profilePicture";
import Menu from "./menu";

const InviteModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: (closed: boolean) => void;
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState<"editor" | "viewer">("editor");
  const [loading, setLoading] = useState<boolean>(false);
  const [usersList, setUsersList] = useState<
    {
      email: string;
      role: "editor" | "viewer";
      full_name: string;
      id: string;
    }[]
  >([]);
  const [success, setSuccess] = useState<string>("");
  const [users, setUsers] = useState<{
    email: string;
    role: "editor" | "viewer";
    full_name: string;
    id: string;
  }[]>([
    {
      full_name: "John Doe",
      email: "johndoe@hotmail.com",
      role: "editor",
      id: "1",
    },
    {
      full_name: "Jane Doe",
      email: "janedoe@hotmail.com",
      role: "viewer",
      id: "2",
    },
    {
      full_name: "John Smith",
      email: "johnsmith@hotmail.com",
      role: "editor",
      id: "3",
    },
  ]);

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleInvite = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    if(usersList.length + users.length >= 4) {
      setError("You can only invite up to 4 collaborators");
      setLoading(false);
      return;
    }
    usersList.map((user) => {
      if (!validateEmail(user.email)) {
        setError("Please enter a valid email");
        setLoading(false);
        return;
      }
    });
    setSuccess("Invite sent successfully");
    setLoading(false);
  };

  const addUserToList = () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }
    setUsersList([
      ...usersList,
      { email, role, full_name: email.split("@")[0], id: `${usersList.length + 1}` },
    ]);
    setRole("editor");
    setEmail("");
  };

  const removeUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleRoleChange = (id: string, role: "editor" | "viewer") => {
    console.log(id, role);
    const updatedUsersList = users.map((user) => {
      console.log('user', user);
      if (user.id === id) {
        return { ...user, role };
      }
      return user;
    });
    console.log(updatedUsersList);
    setUsers(updatedUsersList);
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
            {/* Success Message */}
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

            {/* Email Input */}
            <div className="space-y-1.5 mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <ArrowRight
                  onClick={addUserToList}
                  size={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-1 rounded-md cursor-pointer transition-all"
                />
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-12 py-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 ${
                    error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter email address"
                />
              </div>
              {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
            </div>

            {/* Role Select */}
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
                  onChange={(e) => setRole(e.target.value as "editor" | "viewer")}
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

            {/* Users to be Added */}
            {usersList.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">To be added</h3>
                <div className="space-y-2">
                  {usersList
                    .filter((user) => user.email.trim() !== "")
                    .map((user, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <ProfilePictureCanvas name={user.full_name} size={36} />
                          <div>
                            <p className="font-medium text-gray-900">{user.full_name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              user.role === "editor"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {user.role}
                          </span>
                          <Menu onRemove={() => removeUser(user.id)} onRoleChange={handleRoleChange} user={user} />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              disabled={!email || loading}
              className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600 flex items-center justify-center space-x-2"
            >
              <span>{usersList.length > 0 ? `Send Invites (${usersList.length})` : 'Send Invite'}</span>
              <Send size={18} />
            </button>
          </form>
        </div>

        {/* Current Collaborators */}
        <div className="border-t border-gray-100 p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            Current Collaborators <span className="ml-2 text-gray-500">({users.length}/4)</span>
          </h3>
          <div className="space-y-2">
            {users.map((user, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <ProfilePictureCanvas name={user.full_name} size={36} />
                  <div>
                    <p className="font-medium text-gray-900">{user.full_name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === "editor"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.role}
                  </span>
                  <Menu onRemove={() => removeUser(user.id)} onRoleChange={handleRoleChange} user={user} />
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
