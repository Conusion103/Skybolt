// import librery SweetAlert2 for alerts
import Swal from "sweetalert2";

// Message of success
export const showSuccess = (message, title = "success") => {
  Swal.fire({
    title: title,
    text: message,
    icon: "success",
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
};

// Message of error (toast in the upper right corner)
export const showError = (message, title = "Error") => {
  Swal.fire({
    title: title,
    text: message,
    icon: "error",
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
};

// Message of confirmation with "Yes" and "Cancel" buttons
export const showConfirm = async (
  message,
  title = "¿Are you Sure?",
  confirmText = "Yes",
  cancelText = "Cancel"
) => {
  const result = await Swal.fire({
    title: title,
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    allowOutsideClick: false, 
    allowEscapeKey: false, 
  });
  return result.isConfirmed;
};


