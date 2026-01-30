import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePrintConfig } from "../src/hooks/usePrintConfig";
import { api } from "../src/api";
import { notify } from "../src/utils/sweetAlert";
import { FiSave, FiSettings } from "react-icons/fi";

const empresaSchema = z.object({
  nombre_empresa: z.string().min(1, "Requerido"),
  address1: z.string().min(1, "Requerido"),
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
      setValue("address1", config.empresa.direccion);
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
    <div className="dashboard-main">
      <div className="mb-5">
        <h2 className="fw-bold mb-1">Configuración</h2>
        <p className="text-muted">Ajusta los detalles de tu empresa para la impresión de facturas</p>
      </div>

      <div className="stat-card mx-auto" style={{ maxWidth: "800px" }}>
        <form onSubmit={onSubmit} className="row g-4">
          <div className="col-12 border-bottom pb-4 mb-2">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <FiSettings className="text-primary" /> Perfil de Empresa
            </h5>
            <label className="form-label fw-semibold">Logo (archivo en src/assets/)</label>
            <div className="mb-3 d-flex align-items-center gap-4">
              {logoSrc && (
                <div className="p-2 border rounded-3" style={{ backgroundColor: "var(--table-header-bg)" }}>
                  <img src={logoSrc} alt="logo" className="img-fluid" style={{ maxHeight: 60 }} />
                </div>
              )}
              <div className="flex-grow-1">
                <input {...register("logo")} className="form-control" placeholder="Ej: logo.svg" />
                <small className="text-muted">Coloca el archivo de imagen en `src/assets/`</small>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Nombre de la empresa</label>
            <input {...register("nombre_empresa")} className="form-control" />
            {errors.nombre_empresa && <Err msg={errors.nombre_empresa.message} />}
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Dirección de la empresa</label>
            <input {...register("address1")} className="form-control" />
            {errors.address1 && <Err msg={errors.address1.message} />}
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">CIF / Identificación</label>
            <input {...register("cif")} className="form-control" />
            {errors.cif && <Err msg={errors.cif.message} />}
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">Código Postal</label>
            <input {...register("cp")} className="form-control" />
            {errors.cp && <Err msg={errors.cp.message} />}
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">Teléfono</label>
            <input {...register("telefono")} className="form-control" />
            {errors.telefono && <Err msg={errors.telefono.message} />}
          </div>

          <div className="col-md-4">
            <label className="form-label fw-semibold">Email de Contacto</label>
            <input type="email" {...register("email")} className="form-control" />
            {errors.email && <Err msg={errors.email.message} />}
          </div>

          <div className="col-12 text-end pt-4 border-top">
            <button type="submit" className="btn-modern btn-modern-success">
              <FiSave /> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const Err = ({ msg }: { msg?: string }) => (
  <div className="invalid-feedback d-block">{msg}</div>
);