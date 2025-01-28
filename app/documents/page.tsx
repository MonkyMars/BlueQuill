"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchUserDocuments } from "@/utils/user/document/fetch";
import { DocumentType } from "@/utils/types";
import { createUserDocument } from "@/utils/user/document/create";
import { deleteUserDocument } from "@/utils/user/document/delete";
import { fetchProfile } from "@/utils/user/auth/profile";
import { useAuth } from "@/utils/AuthProvider";
import { renameUserDocument } from "@/utils/user/document/rename";
import { RenameModal } from "./RenameModal";
import Alert from "../components/ui/alert";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  EllipsisVertical,
  FileText,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { ProfileType } from "@/utils/types";

export default function Documents() {
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "date">("date");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(
    null
  );
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [alert, setAlert] = useState<{
    title: string;
    message: string;
    isVisible: boolean;
    closeText: string;
    confirmText: string;
  }>({
    title: "",
    message: "",
    closeText: "",
    confirmText: "",
    isVisible: false,
  });

  const onCloseAlert = () => {
    setAlert({
      title: "",
      message: "",
      closeText: "",
      confirmText: "",
      isVisible: false,
    });
  };

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
    const handleFetchProfile = async () => {
      if (!user) return;
      const profile = await fetchProfile(user.id);
      if (!profile) {
        console.error("Error fetching profile");
      }
      setProfile(profile);
    };
    handleFetchProfile();
  }, [user]);

  const createDocument = async () => {
    if (!user || !profile) return;
    if (documents.length >= 4 && profile.plan === "free") {
      setAlert({
        title: "Document Limit Reached",
        message:
          "You have reached the maximum number of documents allowed. Please delete a document to create a new one.",
        closeText: "Close",
        confirmText: "Upgrade Plan",
        isVisible: true,
      });
      return;
    }
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
      router.replace(`/documents/${data.data.id}`);
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

  const handleRename = async (newTitle: string) => {
    if (!selectedDocument || !user) return;

    try {
      const data = await renameUserDocument(
        selectedDocument.id,
        newTitle,
        user.id
      );
      if (data.success) {
        setDocuments(
          documents.map((doc) =>
            doc.id === selectedDocument.id ? { ...doc, title: newTitle } : doc
          )
        );
      }
    } catch (error) {
      console.error("Error renaming document:", error);
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
          <h1 className="text-2xl font-bold text-gray-800">
            {profile ? `Welcome back ${profile.full_name}!` : "My Documents"}
          </h1>
          <button
            onClick={createDocument}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            aria-label="Create new document"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Document
          </button>
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
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 bg-transparent cursor-pointer appearance-none"
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
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 bg-transparent cursor-pointer appearance-none"
            >
              {statusTypes.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm pt-4">
          <div className="flex items-center px-6 py-3 border-b border-gray-200">
            <button
              onClick={() => setSortBy("name")}
              className={`flex items-center ${
                sortBy === "name" ? "text-blue-600" : "text-gray-600"
              } hover:text-blue-600 transition-colors flex-1`}
            >
              Name
              {sortBy === "name" && <ArrowDown className="w-4 h-4 ml-2" />}
            </button>
            <button
              onClick={() => setSortBy("date")}
              className={`flex items-center ${
                sortBy === "date" ? "text-blue-600" : "text-gray-600"
              } hover:text-blue-600 transition-colors w-48`}
            >
              Last Modified
              {sortBy === "date" && <ArrowDown className="w-4 h-4 ml-2" />}
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
                  <FileText className="w-5 h-5 text-gray-600 mr-2" />
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
                <div className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisVertical
                        size={20}
                        className="text-slate-400 hover:text-slate-600"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>{doc.title}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setRenameModalOpen(!renameModalOpen)}
                        className="cursor-pointer"
                      >
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">Update Status</DropdownMenuItem> {/* need to add updateStatus function */}
                      <DropdownMenuItem className="cursor-pointer">Update Type</DropdownMenuItem> {/* need to add updateType function */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className={cn(
                              "flex items-center gap-2 text-destructive",
                              "hover:bg-destructive hover:text-destructive-foreground",
                              "focus:bg-destructive focus:text-destructive-foreground",
                              "rounded-md transition-colors cursor-pointer"
                            )}
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{doc.title}</AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogDescription>
                            Are you sure you want to delete this document? This
                            change cannot be undone.
                          </AlertDialogDescription>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className={cn(
                                "bg-red-500 text-white hover:bg-red-600",
                                "focus:ring-2 focus:ring-red-500 focus:ring-opacity-50",
                                "rounded-md transition-colors cursor-pointer px-4 py-2"
                              )}
                              // need to add deleteDocument function
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {menuOpen === doc.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-1">
                      <button
                        onClick={() => {
                          setSelectedDocument(doc);
                          setRenameModalOpen(true);
                          setMenuOpen(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => {
                          deleteDocument(doc.id);
                          setMenuOpen(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <RenameModal
        isOpen={renameModalOpen}
        onClose={() => {
          setRenameModalOpen(false);
          setSelectedDocument(null);
        }}
        onRename={handleRename}
        currentTitle={selectedDocument?.title || ""}
      />
      <Alert
        props={alert}
        onClose={onCloseAlert}
        onConfirm={() => router.replace("/pricing")}
      />
    </main>
  );
}
