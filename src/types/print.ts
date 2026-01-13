export interface PrintConfig {
  logo?: string // base64
  empresa: {
    nombre: string
    cif: string
    direccion: string
    cp: string
    telefono: string
    email: string
  }
}