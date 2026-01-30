// src/pages/FacturaEditPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { facturaSchema } from "../src/schemas/factura";
import { useCrudQuery } from "../src/hooks/useCrudQuery";
import { usePrintConfig } from "../src/hooks/usePrintConfig";
import { api } from "../src/api";
import { FaPlus, FaTrash, FaCheck, FaArrowLeft, FaPrint } from "react-icons/fa";
import { ImprimirFactura } from "../src/components/ImprimirFactura";
import { notify } from "../src/utils/sweetAlert";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

type FacturaInput = z.infer<typeof facturaSchema>;

export default function FacturaEditPage() {
  const { nofactura } = useParams() as { nofactura: string };
  const navigate = useNavigate();
  const qc = useQueryClient();
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

    const total = itemsTraducidos.reduce((sum: number, it: any) => sum + (Number(it.importe) || 0), 0);
    const [y, m, d] = data.fecha.split("-");
    const fechaFormateada = `${d}/${m}/${y}`;

    const payload = { ...data, items: itemsTraducidos, fecha: fechaFormateada, total };

    await notify.promise(
      api.put(`/facturas/${nofactura}/`, payload),
      { loading: "Actualizando...", success: "Factura actualizada", error: "Error al actualizar" }
    );
    qc.invalidateQueries({ queryKey: ["facturas"] });
    navigate("/dashboard");
  });

  return (
    <div className="dashboard-main">
      <div className="mb-5 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="fw-bold mb-1">Editar Factura</h2>
          <p className="text-muted">Modifica los detalles de la factura {nofactura}</p>
        </div>
        <button type="button" onClick={() => navigate(-1)} className="btn-ghost">
          <FaArrowLeft /> Volver
        </button>
      </div>

      <div className="stat-card p-4 mx-auto" style={{ maxWidth: "1000px" }}>
        <form onSubmit={onSubmit}>
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <label className="form-label fw-semibold">Número de Factura</label>
              <input {...register("nofactura")} readOnly className="form-control" style={{ backgroundColor: "var(--table-header-bg)" }} />
              {errors.nofactura && <div className="invalid-feedback d-block">{errors.nofactura.message}</div>}
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Fecha</label>
              <input type="date" {...register("fecha")} className="form-control" />
              {errors.fecha && <div className="invalid-feedback d-block">{errors.fecha.message}</div>}
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Cliente</label>
              <input list="clientes-list" {...register("customer")} className="form-control" />
              <datalist id="clientes-list">
                {clientes?.map((c: any) => <option key={c.id} value={c.name} />)}
              </datalist>
              {errors.customer && <div className="invalid-feedback d-block">{errors.customer.message}</div>}
            </div>

            <div className="col-md-2">
              <label className="form-label fw-semibold">Estado de Pago</label>
              <select {...register("cobrado", { setValueAs: (v) => v === "true" })} className="form-select">
                <option value="false">Pendiente</option>
                <option value="true">Cobrado</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Dirección de Facturación</label>
            <input {...register("address")} className="form-control" />
            {errors.address && <div className="invalid-feedback d-block">{errors.address.message}</div>}
          </div>

          <div className="mb-4 border-top pt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Conceptos de Factura</h5>
              <button type="button" onClick={addItem} className="btn-modern btn-modern-primary btn-sm">
                <FaPlus /> Agregar Item
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-borderless align-middle">
                <thead>
                  <tr className="text-muted small uppercase fw-bold">
                    <th style={{ width: "60%" }}>Servicio / Descripción</th>
                    <th style={{ width: "30%" }}>Importe</th>
                    <th style={{ width: "10%" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {watchItems.map((_, idx) => (
                    <tr key={idx}>
                      <td>
                        <input list="servicios-list" {...register(`items.${idx}.service`)} className="form-control" />
                        <datalist id="servicios-list">
                          {servicios?.map((s: any) => <option key={s.id} value={s.service} />)}
                        </datalist>
                        {errors.items?.[idx]?.service && <div className="invalid-feedback d-block">{errors.items[idx].service.message}</div>}
                      </td>
                      <td>
                        <div className="input-group">
                          <span className="input-group-text border-end-0" style={{ backgroundColor: "var(--table-header-bg)", color: "var(--text-muted)" }}>$</span>
                          <input
                            type="number"
                            step="0.01"
                            {...register(`items.${idx}.importe`, { valueAsNumber: true })}
                            className="form-control border-start-0"
                          />
                        </div>
                        {errors.items?.[idx]?.importe && <div className="invalid-feedback d-block">{errors.items[idx].importe.message}</div>}
                      </td>
                      <td className="text-end">
                        <button type="button" onClick={() => removeItem(idx)} className="btn-ghost text-danger">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {errors.items && <div className="invalid-feedback d-block">{errors.items.message}</div>}
          </div>

          <div className="d-flex justify-content-between align-items-center border-top pt-4 mt-2">
            <div>
              <span className="text-muted">Total de Factura</span>
              <h3 className="fw-bold mb-0 text-dark">
                ${watchItems.reduce((sum, it) => sum + (Number(it.importe) || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="d-flex gap-2">
              {config && (
                <button
                  type="button"
                  onClick={() => {
                    api.get(`/facturaitems?nofactura=${nofactura}`)
                      .then((r) => {
                        ImprimirFactura({ factura: watch(), items: r.data, config });
                      });
                  }}
                  className="btn-modern btn-modern-primary outline"
                  style={{ background: 'transparent', color: 'var(--primary-blue)', border: '2px solid var(--primary-blue)' }}
                >
                  <FaPrint /> Imprimir
                </button>
              )}
              <button type="submit" className="btn-modern btn-modern-success px-5">
                <FaCheck /> Actualizar Factura
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

