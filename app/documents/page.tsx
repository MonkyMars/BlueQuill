"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchUserDocuments } from "@/utils/user/document/fetch";
import { DocumentType } from "@/utils/types";
import { createUserDocument } from "@/utils/user/document/create";
import { deleteUserDocument } from "@/utils/user/document/delete";
import { useAuth } from "@/utils/AuthProvider";

export default function Documents() {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "date">("date");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const data = await fetchUserDocuments(user.id);
        if (data && data.success && Array.isArray(data.data)) {
          setDocuments(data.data as DocumentType[]);
        }
        console.log("Documents fetched:", data.data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocuments();
  }, [user]);

  const createDocument = async () => {
    if (!user) return;
    const newDocument: DocumentType = {
      owner: user.id,
      id: "new",
      title: "New Document",
      content: "",
      type: "blog",
      status: "draft",
    };
    const data = await createUserDocument(newDocument, user.id);
    if (data && data.success) {
      setDocuments([...documents, data.data]);
      window.location.href = `/documents/${data.data.id}`;
      console.log("Document created:", data.data);
    }
  };

  const deleteDocument = async (document_id: string) => {
    if (!user) return;
    try {
      const data = await deleteUserDocument(document_id, user.id);
      if (data && data.success) {
        setDocuments(documents.filter((doc) => doc.id !== document_id));
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const filteredDocuments = documents
    .filter(
      (doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedType === "all" || doc.type === selectedType) &&
        (selectedStatus === "all" || doc.status === selectedStatus)
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.title.localeCompare(b.title);
      }
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    });

  const documentTypes = [
    { value: "all", label: "All Types" },
    { value: "blog", label: "Blog Posts" },
    { value: "article", label: "Articles" },
    { value: "academic", label: "Academic" },
    { value: "script", label: "Scripts" },
  ];

  const statusTypes = [
    { value: "all", label: "All Status" },
    { value: "draft", label: "Drafts" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">My Documents</h1>
          <Link
            onClick={createDocument}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            href={""}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Document
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-1 md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 bg-transparent cursor-pointer"
            >
              {documentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 bg-transparent cursor-pointer"
            >
              {statusTypes.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center px-6 py-3 border-b border-gray-200">
            <button
              onClick={() => setSortBy("name")}
              className={`flex items-center ${
                sortBy === "name" ? "text-blue-600" : "text-gray-600"
              } hover:text-blue-600 transition-colors flex-1`}
            >
              Name
              {sortBy === "name" && (
                <svg
                  className="w-4 h-4 ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={() => setSortBy("date")}
              className={`flex items-center ${
                sortBy === "date" ? "text-blue-600" : "text-gray-600"
              } hover:text-blue-600 transition-colors w-48`}
            >
              Last Modified
              {sortBy === "date" && (
                <svg
                  className="w-4 h-4 ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <div className="w-24 text-gray-600">Status</div>
            <div className="w-24 text-gray-600">Type</div>
            <div className="w-8"></div>
          </div>

          {filteredDocuments.length === 0 || isLoading ? (
            <div className="text-center py-12 text-gray-500">
              No documents found
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center px-6 py-4 hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
              >
                <Link
                  href={`/documents/${doc.id}`}
                  className="flex-1 flex items-center"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-gray-800 hover:text-blue-600 transition-colors">
                    {doc.title}
                  </span>
                </Link>
                <div className="w-48 text-gray-600">
                  {doc.updatedAt
                    ? `${new Date(
                        doc.updatedAt
                      ).toLocaleDateString()} - ${new Date(
                        doc.updatedAt
                      ).getHours()}:${new Date(doc.updatedAt).getMinutes()}`
                    : "No date"}
                </div>
                <div className="w-24">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      doc.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {(doc.status ?? "draft").charAt(0).toUpperCase() +
                      (doc.status ?? "draft").slice(1)}
                  </span>
                </div>
                <div className="w-24 text-gray-600 capitalize">{doc.type}</div>
                <button
                  className="w-8 text-gray-400 hover:text-gray-600"
                  onClick={() => deleteDocument(doc.id)}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 6H5H21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 6V4C8 3.44772 8.44771 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44771 21 5 20.5523 5 20V6H19Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 11V17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 11V17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
