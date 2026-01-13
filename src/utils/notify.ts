import toast from "react-hot-toast"

export const notify = {
  success: (msg: string) => toast.success(msg),
  error: (msg: string) => toast.error(msg),
  loading: (msg: string) => toast.loading(msg),
  promise: <T>(
    p: Promise<T>,
    { loading, success, error }: { loading: string; success: string; error: string }
  ) => toast.promise(p, { loading, success, error }),
}