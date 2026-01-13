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
}
