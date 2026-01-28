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
import { Button } from "@/components/ui/button";

// Define a reusable interface for props
interface AlertDialogComponentProps {
  inventoryId: number; // ID of the inventory item to be deleted
  triggerLabel: string; // Button text for the trigger
  title: string; // Title of the alert dialog
  description: string; // Description of the alert dialog
  cancelLabel: string; // Text for the Cancel button
  actionLabel: string; // Text for the Action button
  onAction: (id: number) => void; // Function to call when the action is triggered
  style?: string; // CSS class for the button
}

export function AlertDialogComponent({
  inventoryId,
  triggerLabel,
  title,
  description,
  cancelLabel,
  actionLabel,
  onAction,
  style,
}: AlertDialogComponentProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className={style}>
          {triggerLabel}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={() => onAction(inventoryId)}>
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
