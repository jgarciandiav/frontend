
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
  const { data, error, isLoading, refetch } = useCrudQuery<any>("/configempresa/", "printConfig");
  const lastConfig = (data && data.length > 0 ? data[data.length - 1] : null) as any;

  const config: PrintConfig = lastConfig
    ? {
      logo: lastConfig.logo || "",
      empresa: {
        nombre: lastConfig.nombre_empresa || "",
        cif: lastConfig.cif || "",
        direccion: lastConfig.address1 || "",
        cp: lastConfig.cp || "",
        telefono: lastConfig.telefono || "",
        email: lastConfig.email || "",
      },
    }
    : defaultConfig;
  return { config, error, isLoading, refetch };
}