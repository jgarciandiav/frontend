
import { useCrudQuery } from "./useCrudQuery";
import { PrintConfig } from "../types/print";

const defaultConfig: PrintConfig = {
  empresa: {
    nombre: "Empresa",
    cif: "",
    direccion: "",
    cp: "",
    telefono: "",
    email: "",
  },
};

export function usePrintConfig() {
  const { data, error, isLoading, refetch } = useCrudQuery<PrintConfig>("/configempresa/", "printConfig");
  const config = data?.[0]
    ? {
        logo: (data[0] as any).logo || "",
        empresa: {
          nombre: (data[0] as any).nombre_empresa || "",
          cif: (data[0] as any).cif || "",
          direccion: "",
          cp: (data[0] as any).cp || "",
          telefono: (data[0] as any).telefono || "",
          email: (data[0] as any).email || "",
        },
      }
    : defaultConfig;
  return { config, error, isLoading, refetch };
}