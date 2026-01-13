
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
  const { data, error, isLoading, refetch } = useCrudQuery<PrintConfig>("/config/print", "printConfig");
  return { config: data?.[0] || defaultConfig, error, isLoading, refetch };
}