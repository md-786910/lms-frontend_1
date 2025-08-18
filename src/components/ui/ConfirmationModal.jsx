
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

const ConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  message = "Are you sure you want to delete employee",
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to Suspend this employee?</DialogTitle>    
        </DialogHeader>
        <div className="flex justify-center space-x-4 pt-4">
          <Button variant="outline" onClick={() => onClose(false)}>
            No
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onClose(false);
            }}
          >
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
