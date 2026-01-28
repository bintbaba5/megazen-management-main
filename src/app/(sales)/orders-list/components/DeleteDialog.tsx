// components/DeleteDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const DeleteDialog = ({
  open,
  salesOrder,
  loading,
  onClose,
  onConfirm
}: {
  open: boolean;
  salesOrder: any;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!salesOrder) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete the sale order {salesOrder.saleId}?</p>
        <DialogFooter>
          <div className="flex gap-4 w-full">
            <Button
              onClick={onClose}
              disabled={loading}
              variant="outline"
              className="text-blue-600 border-blue-600 hover:bg-blue-500"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={loading}
              variant="destructive"
            >
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};