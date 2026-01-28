import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

type Props = {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  handleDeleteCategory: () => void;
  loading: boolean;
};

const DeleteConfirmation = ({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  handleDeleteCategory,
  loading,
}: Props) => {
  return (
    <Dialog
      open={isDeleteDialogOpen}
      onOpenChange={(open) => setIsDeleteDialogOpen(open)}
    >
      <DialogContent className="w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Confirm Deletion
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete this category? This action cannot be
          undone.
        </p>
        <DialogFooter className="flex flex-col sm:flex-row justify-end sm:space-x-4 space-y-2 sm:space-y-0">
          <Button
            variant="outline"
            className="border-gray-400 text-gray-600 hover:border-gray-600 dark:border-gray-500 dark:text-gray-300 dark:hover:border-gray-300 w-full sm:w-auto"
            onClick={() => setIsDeleteDialogOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white dark:border-red-400 dark:text-red-400 dark:hover:bg-red-400 dark:hover:text-white w-full sm:w-auto"
            onClick={handleDeleteCategory}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmation;
