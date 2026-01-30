import { z } from "zod"

export const itemSchema = z.object({
  service: z.string().min(1, "Escriba un servicio"),
  importe: z.number().positive("Importe > 0"),
  servicetranslate: z.string().optional().nullable(),
})

export const facturaSchema = z.object({
  nofactura: z.string().min(1, "Número requerido"),
  fecha: z.string().date("Fecha inválida"),
  customer: z.string().min(1, "Seleccione cliente"),
  address: z.string().min(1, "Dirección requerida"),
  cobrado: z.boolean(),
  items: z.array(itemSchema).min(1, "Al menos un item"),
})