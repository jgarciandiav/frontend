import { api } from "./api"

export async function checkIfUsersExist(): Promise<boolean> {
  try { await api.get("/users/exists"); return true } catch { return false }
}

export async function logout() {
  await api.post("/users/logout")
  window.location.href = "/login"
}