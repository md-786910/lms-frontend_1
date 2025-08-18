import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

function ConfirmFn({
  text_no = "No",
  text_yes = "Yes",
  title = "Confirm to delete",
  message = "Are you sure you want to delete this item?",
  onDelete,
}) {
  confirmAlert({
    title,
    message,
    buttons: [
      {
        label: text_no,
        onClick: () => {
          console.log("Item not deleted!");
        },
      },
      {
        label: text_yes,
        onClick: () => onDelete(),
      },
    ],
  });
}

export default ConfirmFn;
