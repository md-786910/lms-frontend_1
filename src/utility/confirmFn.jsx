import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Keep this for basic animations/portal logic if needed, or override
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

function ConfirmFn({
  text_no = "Cancel",
  text_yes = "Confirm",
  title = "Are you sure?",
  message = "This action cannot be undone.",
  onDelete,
  onCancel,
  warning = false, // Add a warning mode
}) {
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <>
          {/* Overlay - mimicking standard dialog overlay */}
          <div className="fixed inset-0 z-[9999] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          
          {/* Content - mimicking AlertDialogContent */}
          <div className="fixed left-[50%] top-[50%] z-[10000] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg border-slate-200">
            <div className="flex flex-col space-y-2 text-center sm:text-left">
              <h2 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
                 {/* Optional Icon based on context could go here */}
                 {title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {message}
              </p>
            </div>
            
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <Button
                variant="outline"
                className="mt-2 sm:mt-0"
                onClick={() => {
                  if (onCancel) onCancel();
                  onClose();
                }}
              >
                {text_no}
              </Button>
              <Button
                variant={warning ? "destructive" : "default"} // Use destructive variant if warning is true
                className={!warning ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" : ""}
                onClick={() => {
                  onDelete();
                  onClose();
                }}
              >
                {text_yes}
              </Button>
            </div>
          </div>
        </>
      );
    },
    // Click outside to close
    onClickOutside: () => {
        if(onCancel) onCancel();
    },
    onKeypressEscape: () => {
         if(onCancel) onCancel();
    },
    overlayClassName: "custom-confirm-overlay-override" // We might need to override default styles in global css if they interfere, but customUI usually handles it.
  });
}

export default ConfirmFn;