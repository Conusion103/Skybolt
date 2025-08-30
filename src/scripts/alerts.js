import Swal from "sweetalert2";

// ✅ Alerta de éxito (toast en la esquina superior derecha)
export const showSuccess = (message, title = "Éxito") => {
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

// ❌ Alerta de error (toast en la esquina superior derecha)
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

// ⚠️ Confirmación (modal en el centro, NO toast)
export const showConfirm = async (
  message,
  title = "¿Estás seguro?",
  confirmText = "Sí",
  cancelText = "Cancelar"
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
    allowOutsideClick: false, // evita que se cierre al hacer click fuera
    allowEscapeKey: false, // evita que se cierre con ESC
  });
  return result.isConfirmed;
};


