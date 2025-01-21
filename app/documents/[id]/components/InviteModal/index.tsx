"use client";
import React, { useState } from "react";
import {
  Send,
  X,
  Mail,
  FileUser,
  EllipsisVerticalIcon,
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
  const [menuVisible, setMenuVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [error, setError] = useState("");
  const [role, setRole] = useState<"editor" | "viewer">("editor");
  const [loading, setLoading] = useState<boolean>(false);
  const [usersList, setUsersList] = useState<
    {
      email: string;
      role: "editor" | "viewer";
      full_name: string;
    }[]
  >([]);
  const [success, setSuccess] = useState<string>("");
  const [users] = useState([
    {
      full_name: "John Doe",
      email: "johndoe@hotmail.com",
      role: "editor",
    },
    {
      full_name: "Jane Doe",
      email: "janedoe@hotmail.com",
      role: "viewer",
    },
    {
      full_name: "John Smith",
      email: "johnsmith@hotmail.com",
      role: "editor",
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
    // Send invite
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
      { email, role, full_name: email.split("@")[0] },
    ]);
    setRole("editor");
    setEmail("");
  };

  const removeUser = (index: number) => {
    setUsersList(usersList.filter((_, i) => i !== index));
  };

  const handleRoleChange = (index: number, role: "editor" | "viewer") => {
    const updatedUsersList = usersList.map((user, i) => {
      if (i === index) {
        return { ...user, role };
      }
      return user;
    });
    setUsersList(updatedUsersList);
  }; 

  const handleMenu = (e: React.MouseEvent) => {
    setMenuVisible(!menuVisible);
    setCoords({ x: e.clientX, y: e.clientY });
    console.log(e.clientX, e.clientY);
  }

  return (
    <>
      <section className="fixed flex flex-col -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-gray-50 p-4 rounded-lg shadow-xl z-50 w-full max-w-md">
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
                  <X size={18} />
                </button>
              </div>
            )}
            <div className="flex flex-col relative">
              <label htmlFor="email" className="mb-1">Email</label>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2 relative">
                  <Mail
                    size={24}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <ArrowRight
                    onClick={addUserToList}
                    size={24}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 hover:bg-blue-600 rounded-lg cursor-pointer transition-all duration-200 z-10"
                  />
                  <input
                    type="text"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-12 pr-14 py-2 border border-gray-300 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 ${
                      error ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {error && <span className="text-red-600 text-sm">{error}</span>}
              </div>
            </div>
            <div className="w-full mx-auto flex flex-col">
              <label htmlFor="role" className="mb-1">Role</label>
              <div className="relative">
                <FileUser
                  size={24}
                  className="absolute left-3 top-1/3 -translate-y-1/2 text-gray-400"
                />
                <select
                  id="role"
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as "editor" | "viewer")
                  }
                  className="w-full pl-12 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 bg-transparent cursor-pointer appearance-none mb-4"
                >
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>
            <section className="flex flex-col">
              {usersList.length > 0 && <span>To be added</span>}
              <div className="flex">
                {usersList
                  .filter((user) => user.email.trim() !== "")
                  .map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 hover:bg-white rounded-md transition-colors duration-200"
                    >
                      <div className="mr-2">
                        <ProfilePictureCanvas name={user.full_name} size={40} />
                      </div>
                      <div className="flex flex-col mr-1">
                        <span className="font-medium text-gray-900">
                          {user.full_name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {user.email}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          user.role === "editor"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>
                      <EllipsisVerticalIcon
                        size={24}
                        className="text-gray-400 cursor-pointer hover:scale-[1.2] transition-all duration-200"
                        onClick={handleMenu}
                      />
                    </div>
                  ))}
              </div>
            </section>
            <button
              disabled={!email || loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg my-2 hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 w-full flex align-center gap-4 justify-center"
            >
              {usersList.length > 0 ? `Send Invites (${usersList.length})` : 'Send Invite'}
              <Send />
            </button>
          </form>
        </main>
        <span className="text-gray-600 font-medium mt-4 mb-2 flex items-center gap-2">
          Current Collaborators ({users.length}/4)
        </span>
        <footer className="flex flex-col gap-4 bg-gray-50 rounded-lg p-4">
          {users.map((user, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 hover:bg-white rounded-md transition-colors duration-200"
            >
              <div className="mr-2">
                <ProfilePictureCanvas name={user.full_name} size={40} />
              </div>
              <div className="flex flex-col mr-1">
                <span className="font-medium text-gray-900">
                  {user.full_name}
                </span>
                <span className="text-sm text-gray-500">{user.email}</span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  user.role === "editor"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {user.role}
              </span>
              <EllipsisVerticalIcon
                size={24}
                className="text-gray-400 cursor-pointer hover:scale-[1.2] transition-all duration-200"
                onClick={handleMenu}
              />
            </div>
          ))}
        </footer>
      <Menu cords={coords} isVisible={menuVisible} onClose={() => setMenuVisible(false)} onRemove={() => removeUser} onRoleChange={() => handleRoleChange}  />
      </section>
    </>
  );
};

export default InviteModal;
