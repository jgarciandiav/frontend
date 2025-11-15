import axios from "axios"

const API = "http://localhost:8000"

export async function checkIfUsersExist(): Promise<boolean> {
  try {
    const res = await axios.get(`${API}/users/exists`)
    return res.data.exists
  } catch {
    return false
  }
}

export function saveToken(token: string) {
  localStorage.setItem("token", token)
}

export function getToken(): string | null {
  return localStorage.getItem("token")
}

export function logout() {
  localStorage.removeItem("token")
  window.location.href = "/login"
}