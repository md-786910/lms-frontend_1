import { toast } from "react-toastify";
import { Calendar, CheckCircle, XCircle, Info, AlertTriangle, Bell } from "lucide-react";

// Custom toast content component
const CustomToastContent = ({ type, title, message }) => {
  const getIcon = () => {
    switch (type) {
      case "leave":
        return <Calendar />;
      case "success":
        return <CheckCircle />;
      case "error":
        return <XCircle />;
      case "warning":
        return <AlertTriangle />;
      case "info":
      default:
        return <Bell />;
    }
  };

  const getIconClass = () => {
    switch (type) {
      case "leave":
        return "leave";
      case "success":
        return "success";
      case "error":
        return "error";
      case "warning":
        return "warning";
      case "info":
      default:
        return "info";
    }
  };

  return (
    <div className="custom-toast">
      <div className={`custom-toast-icon ${getIconClass()}`}>
        {getIcon()}
      </div>
      <div className="custom-toast-content">
        <div className="custom-toast-title">{title}</div>
        <div className="custom-toast-message">{message}</div>
        <div className="custom-toast-time">Just now</div>
      </div>
    </div>
  );
};

// Parse notification message and determine type
const parseNotificationMessage = (rawMessage) => {
  // Handle different notification formats
  if (typeof rawMessage === "object") {
    return {
      type: rawMessage.type || "info",
      title: rawMessage.title || "Notification",
      message: rawMessage.message || rawMessage.toString(),
    };
  }

  const message = String(rawMessage);

  // Leave request notifications
  if (message.toLowerCase().includes("leave_request") || message.toLowerCase().includes("leave request")) {
    const cleanMessage = message.replace(/leave_request:\s*/i, "").trim();
    return {
      type: "leave",
      title: "Leave Request",
      message: cleanMessage || "New leave request submitted",
    };
  }

  // Leave approved notifications
  if (message.toLowerCase().includes("approved")) {
    return {
      type: "success",
      title: "Request Approved",
      message: message,
    };
  }

  // Leave rejected notifications
  if (message.toLowerCase().includes("rejected")) {
    return {
      type: "error",
      title: "Request Rejected",
      message: message,
    };
  }

  // Salary related notifications
  if (message.toLowerCase().includes("salary")) {
    return {
      type: "info",
      title: "Salary Update",
      message: message,
    };
  }

  // Default notification
  return {
    type: "info",
    title: "Notification",
    message: message,
  };
};

// Custom toast functions
export const showNotification = (rawMessage) => {
  const { type, title, message } = parseNotificationMessage(rawMessage);

  toast(<CustomToastContent type={type} title={title} message={message} />, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showSuccessToast = (title, message) => {
  toast(<CustomToastContent type="success" title={title} message={message} />, {
    position: "top-right",
    autoClose: 5000,
  });
};

export const showErrorToast = (title, message) => {
  toast(<CustomToastContent type="error" title={title} message={message} />, {
    position: "top-right",
    autoClose: 5000,
  });
};

export const showInfoToast = (title, message) => {
  toast(<CustomToastContent type="info" title={title} message={message} />, {
    position: "top-right",
    autoClose: 5000,
  });
};

export const showWarningToast = (title, message) => {
  toast(<CustomToastContent type="warning" title={title} message={message} />, {
    position: "top-right",
    autoClose: 5000,
  });
};

export const showLeaveToast = (title, message) => {
  toast(<CustomToastContent type="leave" title={title} message={message} />, {
    position: "top-right",
    autoClose: 5000,
  });
};

export default {
  showNotification,
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
  showLeaveToast,
};
