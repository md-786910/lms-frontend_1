import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Users, Settings as SettingsIcon } from "lucide-react";
function CustomeModel({
  open,
  title = "update document",
  OnClose,
  icon = <Users className="h-5 w-5" />,
  children,
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) OnClose(null);
      }}
    >
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {icon} &nbsp;
            {title}
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default CustomeModel;
