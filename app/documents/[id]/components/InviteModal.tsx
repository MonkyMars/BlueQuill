"use client";
import React, { useState } from "react";
import { Send, X, Mail, FileUser, EllipsisVerticalIcon } from "lucide-react";

import ProfilePictureCanvas from "@/utils/user/profilePicture";
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
  const [success, setSuccess] = useState<string>("");
  const [users] = useState([
    {
      full_name: "John Doe",
      email: "johndoe@hotmail.com",
      role: "editor"
    },
    {
      full_name: "Jane Doe",
      email: "janedoe@hotmail.com",
      role: "viewer"
    },
    {
      full_name: "John Smith",
      email: "johnsmith@hotmail.com",
      role: "editor"
    }
  ])
  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleInvite = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true)
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    // Send invite
    setSuccess("Invite sent successfully");
    setLoading(false)
  };

  return (
    <>
      <section className="fixed flex flex-col -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-gray-50 p-4 rounded-lg">
        <header className="flex justify-between">
          <h2 className="text-2xl">Invite collaborators</h2>
          <button
            onClick={() => onClose(true)}
            className="hover:text-black text-slate-400 transition-all duration-200"
          >
            <X />
          </button>
        </header>
        <main className="flex flex-col mx-auto my-5">
          <form className="mx-auto" onSubmit={handleInvite}>
            {success && (
              <div className="bg-green-400/50 flex items-center justify-around gap-6 p-2 rounded-lg">
                <span className="text-green-600 text-sm">{success}</span>
                <button
                  onClick={() => setSuccess("")}
                  className="hover:text-black text-gray-500 transition-all duration-200"
                >
                  <X size={18}/>
                </button>
              </div>
            )}
            <div className="flex flex-col relative">
              <label htmlFor="email">Email</label>
              <div className="relative">
                <div className="flex items-center gap-2">
                  <Mail
                    size={24}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    id="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`bg-transparent w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 ${
                      error ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {error && <span className="text-red-600 text-sm">{error}</span>}
              </div>
            </div>
            <div className="w-full mx-auto flex flex-col">
              <label htmlFor="role">Role</label>
              <div className="relative">
                <FileUser size={24} className="absolute left-3 top-1/3 -translate-y-1/2 text-gray-400"/>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value as 'editor' | 'viewer')}
                  className="w-full pl-12 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 bg-transparent cursor-pointer appearance-none mb-4"
                  >
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>
            <button
              disabled={!email || loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 w-full flex align-center gap-4 justify-center"
            >
              Send Invite
              <Send />
            </button>
          </form>
        </main>
        <footer className="flex flex-col gap-4 bg-gray-50 rounded-lg p-4 mt-6">
          {users.map((user, index) => (
            <div key={index} className="flex items-center justify-between p-2 hover:bg-white rounded-md transition-colors duration-200">
              <div className="mr-2">
                <ProfilePictureCanvas name={user.full_name} size={40} />
              </div>
              <div className="flex flex-col mr-1">
          <span className="font-medium text-gray-900">{user.full_name}</span>
          <span className="text-sm text-gray-500">{user.email}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
          user.role === 'editor' 
            ? 'bg-blue-100 text-blue-700' 
            : 'bg-gray-100 text-gray-700'
              }`}>
          {user.role}
              </span>
              <EllipsisVerticalIcon size={24} className="text-gray-400 cursor-pointer hover:scale-[1.2] transition-all duration-200"/>
            </div>
          ))}
        </footer>
      </section>
    </>
  );
};

export default InviteModal;