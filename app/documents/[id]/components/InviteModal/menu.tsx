'use client';

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { FileUser } from "lucide-react";
import { EllipsisVertical } from "lucide-react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuProps {
  onRemove: (id: string) => void;
  onRoleChange: (id: string, role: "editor" | "viewer") => void;
  user: {
    full_name: string;
    email: string;
    role: "editor" | "viewer";
    id: string;
  };
}

const Menu = ({ onRemove, onRoleChange, user }: MenuProps) => {
  const [newRole, setNewRole] = useState<"editor" | "viewer">(user.role);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{user.full_name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
              Change Role
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Change Role</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Please select a new role for {user.full_name}.
            </AlertDialogDescription>
            <div className="relative">
              <FileUser
                  size={24}
                  className="absolute left-3 top-1/3 -translate-y-1/2 text-gray-400"
                />
            <select
              name="role"
              id="role"
              value={newRole}
              onChange={(e) =>
                setNewRole(e.target.value as "editor" | "viewer")
              }
              className="w-full pl-12 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800 bg-transparent cursor-pointer appearance-none mb-4"
            >
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
            </div>
            
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                className="bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                onClick={() => onRoleChange(user.id, newRole)}
                >
                Submit
                </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
            <AlertDialogTitle>Remove User</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to remove {user.full_name} from this document?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={cn(
              "bg-red-500 text-white hover:bg-red-600",
              "focus:ring-2 focus:ring-red-500 focus:ring-opacity-50",
              "rounded-md transition-colors cursor-pointer px-4 py-2"
              )}
              onClick={() => onRemove(user.id)}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
        
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Menu;
