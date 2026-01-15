import Swal from "sweetalert2"
import "sweetalert2/dist/sweetalert2.css"

export const notify = {
  success: (message: string) => {
    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: message,
      timer: 1500,
      showConfirmButton: false,
    })
  },
  error: (message: string) => {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
    })
  },
  promise: async (promise: Promise<any>, options: { loading: string; success: string; error: string }) => {
    Swal.fire({
      title: options.loading,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })
    try {
      await promise
      Swal.fire({
        icon: "success",
        title: options.success,
        timer: 1500,
        showConfirmButton: false,
      })
      return promise
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: options.error,
      })
      throw error
    }
  },
  confirm: async (title: string, text: string, confirmText: string = "Sí, borrar") => {
    const result = await Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--primary-blue, #0d6efd)",
      cancelButtonColor: "#6c757d",
      confirmButtonText: confirmText,
      cancelButtonText: "Cancelar",
      customClass: {
        popup: 'rounded-4 border-0 shadow-lg',
        confirmButton: 'btn-modern btn-modern-primary px-4',
        cancelButton: 'btn btn-light px-4 ms-2'
      },
      buttonsStyling: false
    });
    return result.isConfirmed;
  },
}
