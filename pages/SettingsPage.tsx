import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePrintConfig } from "../src/hooks/usePrintConfig";
import { api } from "../src/api";
import { notify } from "../src/utils/sweetAlert";

const empresaSchema = z.object({
  nombre_empresa: z.string().min(1, "Requerido"),
  cif: z.string().min(1, "Requerido"),
  cp: z.string().min(1, "Requerido"),
  telefono: z.string().min(1, "Requerido"),
  email: z.string().email("Email inválido"),
  logo: z.string().optional(),
});

type EmpresaInput = z.infer<typeof empresaSchema>;

export default function SettingsPage() {
  const { config, refetch } = usePrintConfig();
  const [logoSrc, setLogoSrc] = useState<string | null>(null);

  useEffect(() => {
    if (config?.logo) {
      import(`../src/assets/${config.logo}`)
        .then((module) => setLogoSrc(module.default))
        .catch(() => setLogoSrc(null));
    }
  }, [config?.logo]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EmpresaInput>({
    resolver: zodResolver(empresaSchema),
    defaultValues: config?.empresa ?? {},
  });

  useEffect(() => {
    if (config?.empresa) {
      setValue("nombre_empresa", config.empresa.nombre);
      setValue("cif", config.empresa.cif);
      setValue("cp", config.empresa.cp);
      setValue("telefono", config.empresa.telefono);
      setValue("email", config.empresa.email);
      setValue("logo", config.logo || "");
    }
  }, [config, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    const { logo, ...dataToSend } = data;
    await notify.promise(
      api.post("/configempresa/", dataToSend),
      { loading: "Guardando...", success: "Configuración actualizada", error: "Error al guardar" }
    );
    refetch();
  });

  return (
    <div className="mt-4 card shadow-sm p-4 mx-auto" style={{ maxWidth: "42rem" }}>
      <h2 className="mb-4">Configuración de impresión</h2>

      <form onSubmit={onSubmit} className="row g-3">
        <div className="col-12">
          <label className="form-label">Logo (archivo en src/assets/)</label>
          <div className="mb-2">
            {logoSrc && <img src={logoSrc} alt="logo" className="img-fluid" style={{ maxHeight: 80 }} />}
          </div>
          <input {...register("logo")} className="form-control" placeholder="Ej: logo.svg" />
          <small className="text-muted">Coloca el archivo de imagen en la carpeta src/assets/</small>
        </div>
        <div className="col-md-6">
          <label className="form-label">Nombre de la empresa</label>
          <input {...register("nombre_empresa")} className="form-control" />
          {errors.nombre_empresa && <Err msg={errors.nombre_empresa.message} />}
        </div>

        <div className="col-md-6">
          <label className="form-label">CIF</label>
          <input {...register("cif")} className="form-control" />
          {errors.cif && <Err msg={errors.cif.message} />}
        </div>

        <div className="col-md-4">
          <label className="form-label">Código postal</label>
          <input {...register("cp")} className="form-control" />
          {errors.cp && <Err msg={errors.cp.message} />}
        </div>

        <div className="col-md-4">
          <label className="form-label">Teléfono</label>
          <input {...register("telefono")} className="form-control" />
          {errors.telefono && <Err msg={errors.telefono.message} />}
        </div>

        <div className="col-md-4">
          <label className="form-label">Email</label>
          <input type="email" {...register("email")} className="form-control" />
          {errors.email && <Err msg={errors.email.message} />}
        </div>

        <div className="col-12 text-end">
          <button type="submit" className="btn btn-success">
            Guardar configuración
          </button>
        </div>
      </form>
    </div>
  );
}

const Err = ({ msg }: { msg?: string }) => (
  <div className="invalid-feedback d-block">{msg}</div>
);