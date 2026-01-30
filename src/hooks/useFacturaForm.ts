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
    // Intentar traducir los items si la API de Chrome está disponible
    let itemsTraducidos = [...data.items];

    try {
      // @ts-ignore - La API puede estar en 'Translator' (global) o bajo 'window.ai.translator'
      const translatorAPI = (window as any).Translator || (window as any).ai?.translator;

      if (translatorAPI) {
        const sourceLanguage = 'es';
        const targetLanguage = 'en';

        const availability = await translatorAPI.availability({ sourceLanguage, targetLanguage });

        if (availability !== 'unavailable') {
          const translator = await translatorAPI.create({ sourceLanguage, targetLanguage });

          // Usamos Promise.all para traducir todos los items en paralelo y crear nuevos objetos
          itemsTraducidos = await Promise.all(
            data.items.map(async (item) => {
              const translated = item.service ? await translator.translate(item.service) : "";
              return { ...item, servicetranslate: translated };
            })
          );
        }
      }
    } catch (error) {
      console.error("Error translation:", error);
    }

    const [y, m, d] = data.fecha.split("-");
    const fechaFormateada = `${d}/${m}/${y}`;
    const total = itemsTraducidos.reduce((sum, it) => sum + (Number(it.importe) || 0), 0);

    const payload = {
      ...data,
      items: itemsTraducidos,
      fecha: fechaFormateada,
      total
    };

    await notify.promise(
      api.post("/facturas/", payload),
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