import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { facturaSchema } from "../schemas/factura";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import { notify } from "../utils/notify";
import { z } from "zod";

type FacturaInput = z.infer<typeof facturaSchema>;

export function useFacturaForm(defaultValues?: Partial<FacturaInput>) {
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    formState,          // ← lo extraemos completo
    control,
    setValue,
    watch,
  } = useForm<FacturaInput>({
    resolver: zodResolver(facturaSchema),
    defaultValues: {
      fecha: new Date().toISOString().slice(0, 10),
      cobrado: false,
      items: [{ service: "", importe: 0 }],
      ...defaultValues,
    },
  });

  const onSubmit = async (data: FacturaInput) => {
    const [y, m, d] = data.fecha.split("-");
    const fechaFormateada = `${d}/${m}/${y}`;
    await notify.promise(
      api.post("/facturas", { ...data, fecha: fechaFormateada }),
      { loading: "Guardando...", success: "Factura creada", error: "Error al guardar" }
    );
    nav("/dashboard");
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    formState,          // ← lo devolvemos
    control,
    setValue,
    watch,
  };
}