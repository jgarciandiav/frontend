import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePrintConfig } from "../src/hooks/usePrintConfig";
import { api } from "../src/api";
import { notify } from "../src/utils/sweetAlert";

const empresaSchema = z.object({
  nombre: z.string().min(1, "Requerido"),
  cif: z.string().min(1, "Requerido"),
  direccion: z.string().min(1, "Requerido"),
  cp: z.string().min(1, "Requerido"),
  telefono: z.string().min(1, "Requerido"),
  email: z.string().email("Email inválido"),
});

type EmpresaInput = z.infer<typeof empresaSchema>;

export default function SettingsPage() {
  const { config, refetch } = usePrintConfig();

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
      Object.entries(config.empresa).forEach(([k, v]) =>
        setValue(k as keyof EmpresaInput, v)
      );
    }
  }, [config, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    await notify.promise(
      api.put("/config/print", { ...config, empresa: data }),
      { loading: "Guardando...", success: "Configuración actualizada", error: "Error al guardar" }
    );
    refetch();
  });

  const uploadLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      api.put("/config/print", { ...config, logo: base64 }).then(() => {
        notify.success("Logo actualizado");
        refetch();
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mt-4 card shadow-sm p-4 mx-auto" style={{ maxWidth: "42rem" }}>
      <h2 className="mb-4">Configuración de impresión</h2>

      <div className="mb-4">
        <label className="form-label">Logo</label>
        {config?.logo && <img src={config.logo} alt="logo" className="img-fluid mb-2" style={{ maxHeight: 120 }} />}
        <input type="file" accept="image/*" onChange={uploadLogo} className="form-control" />
      </div>

      <form onSubmit={onSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Nombre de la empresa</label>
          <input {...register("nombre")} className="form-control" />
          {errors.nombre && <Err msg={errors.nombre.message} />}
        </div>

        <div className="col-md-6">
          <label className="form-label">CIF</label>
          <input {...register("cif")} className="form-control" />
          {errors.cif && <Err msg={errors.cif.message} />}
        </div>

        <div className="col-12">
          <label className="form-label">Dirección</label>
          <input {...register("direccion")} className="form-control" />
          {errors.direccion && <Err msg={errors.direccion.message} />}
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