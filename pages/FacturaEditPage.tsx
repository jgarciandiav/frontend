// src/pages/FacturaEditPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { facturaSchema } from "../src/schemas/factura";
import { useCrudQuery } from "../src/hooks/useCrudQuery";
import { usePrintConfig } from "../src/hooks/usePrintConfig";
import { api } from "../src/api";
import { FaPlus, FaTrash } from "react-icons/fa";
import { ImprimirFactura } from "../src/components/ImprimirFactura";
import { notify } from "../src/utils/sweetAlert";
import { z } from "zod";

type FacturaInput = z.infer<typeof facturaSchema>;

export default function FacturaEditPage() {
  const { nofactura } = useParams() as { nofactura: string };
  const navigate = useNavigate();
  const { config } = usePrintConfig();

  /* Maestros */
  const { data: clientes } = useCrudQuery("/clientes", "clientes");
  const { data: servicios } = useCrudQuery("/servicios", "servicios");

  /* Items originales (solo para imprimir) */
  const [, setItems] = useState<any[]>([]);

  /* Formulario */
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FacturaInput>({
    resolver: zodResolver(facturaSchema),
    defaultValues: { items: [], cobrado: false },
  });

  const watchCustomer = watch("customer");
  const watchItems = watch("items") ?? [];

  /* Carga inicial de la factura */
  useEffect(() => {
    api.get(`/facturas/${nofactura}`)
      .then((r) => {
        setValue("nofactura", r.data.nofactura);
        const fecha = r.data.fecha;
        if (fecha.includes("/")) {
          const [d, m, y] = fecha.split("/");
          setValue("fecha", `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
        } else {
          setValue("fecha", fecha);
        }
        setValue("customer", r.data.customer);
        setValue("address", r.data.address);
        setValue("cobrado", r.data.cobrado);
        return api.get(`/facturaitems?nofactura=${nofactura}`);
      })
      .then((r) => {
        setValue("items", r.data);
        setItems(r.data);
      });
  }, [nofactura, setValue]);

  /* Auto-dirección */
  useEffect(() => {
    if (!watchCustomer) return;
    api
      .get(`/clientes/buscar?nombre=${encodeURIComponent(watchCustomer.trim())}`)
      .then((r) => setValue("address", r.data.address))
      .catch(() => setValue("address", ""));
  }, [watchCustomer, setValue]);

  /* Gestión de items */
  const addItem = () => setValue("items", [...watchItems, { service: "", importe: 0 }]);
  const removeItem = (idx: number) =>
    setValue("items", watchItems.filter((_, i) => i !== idx));

  /* Submit (síncrono) */
  const onSubmit = handleSubmit(async (data) => {
    if (!data.nofactura || !data.customer || data.items.length === 0) {
      notify.error("Complete todos los campos y al menos un item");
      return;
    }
    const total = data.items.reduce((sum: number, it: any) => sum + (Number(it.importe) || 0), 0);
    const [y, m, d] = data.fecha.split("-");
    const fechaFormateada = `${d}/${m}/${y}`;
    const payload = { ...data, fecha: fechaFormateada, total };
    await notify.promise(
      api.put(`/facturas/${nofactura}`, payload),
      { loading: "Actualizando...", success: "Factura actualizada", error: "Error al actualizar" }
    );
    navigate("/dashboard");
  });

  return (
    <form onSubmit={onSubmit} className="mt-4">
      <div className="card shadow-sm p-4">
        <h2 className="card-title mb-4">Editar Factura {nofactura}</h2>

        {/* Cabecera */}
        <div className="row g-3 mb-3">
          <div className="col-md-2">
            <label className="form-label">Número</label>
            <input {...register("nofactura")} disabled className="form-control bg-light" />
            {errors.nofactura && <div className="invalid-feedback d-block">{errors.nofactura.message}</div>}
          </div>

          <div className="col-md-3">
            <label className="form-label">Fecha</label>
            <input type="date" {...register("fecha")} className="form-control" />
            {errors.fecha && <div className="invalid-feedback d-block">{errors.fecha.message}</div>}
          </div>

          <div className="col-md-5">
            <label className="form-label">Cliente</label>
            <input list="clientes-list" {...register("customer")} className="form-control" />
            <datalist id="clientes-list">
              {clientes?.map((c: any) => <option key={c.id} value={c.name} />)}
            </datalist>
            {errors.customer && <div className="invalid-feedback d-block">{errors.customer.message}</div>}
          </div>

          <div className="col-md-2">
            <label className="form-label">Cobrado</label>
            <select {...register("cobrado", { setValueAs: (v) => v === "true" })} className="form-select">
              <option value="false">No</option>
              <option value="true">Sí</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input {...register("address")} className="form-control" />
          {errors.address && <div className="invalid-feedback d-block">{errors.address.message}</div>}
        </div>

        {/* Items */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">Items</h5>
            <button type="button" onClick={addItem} className="btn btn-sm btn-success">
              <FaPlus className="me-1" /> Agregar
            </button>
          </div>

          {watchItems.map((_, idx) => (
            <div key={idx} className="row g-2 align-items-center mb-2">
              <div className="col-5">
                <input list="servicios-list" {...register(`items.${idx}.service`)} className="form-control" />
                <datalist id="servicios-list">
                  {servicios?.map((s: any) => <option key={s.id} value={s.service} />)}
                </datalist>
                {errors.items?.[idx]?.service && <div className="invalid-feedback d-block">{errors.items[idx].service.message}</div>}
              </div>

              <div className="col-4">
                <input
                  type="number"
                  step="0.01"
                  {...register(`items.${idx}.importe`, { valueAsNumber: true })}
                  className="form-control"
                />
                {errors.items?.[idx]?.importe && <div className="invalid-feedback d-block">{errors.items[idx].importe.message}</div>}
              </div>

              <div className="col-3 d-flex align-items-center">
                <button type="button" onClick={() => removeItem(idx)} className="btn btn-sm btn-outline-danger">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}

          {errors.items && <div className="invalid-feedback d-block">{errors.items.message}</div>}
        </div>

        {/* Total */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="fw-bold">
            Total: ${watchItems.reduce((sum, it) => sum + (Number(it.importe) || 0), 0).toFixed(2)}
          </span>
        </div>

        {/* Botones */}
        <div className="d-flex justify-content-between align-items-center">
          <button type="button" onClick={() => navigate(-1)} className="btn btn-primary">
            Volver
          </button>
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-success">
              Actualizar Factura
            </button>
            {config && (
              <button
                type="button"
                onClick={() => {
                  api.get(`/facturaitems?nofactura=${nofactura}`)
                    .then((r) => {
                      ImprimirFactura({ factura: watch(), items: r.data, config });
                    });
                }}
                className="btn btn-primary"
              >
                Imprimir
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

