import { useEffect } from "react";
import { useCrudQuery } from "../src/hooks/useCrudQuery";
import { useFacturaForm } from "../src/hooks/useFacturaForm";
import { FaPlus, FaTrash, FaCheck, FaArrowLeft } from "react-icons/fa";
import { api } from "../src/api";
import { useNavigate } from "react-router-dom";

export default function FacturaFormPage() {
  const { data: clientes } = useCrudQuery("/clientes", "clientes");
  const { data: servicios } = useCrudQuery("/servicios", "servicios");
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useFacturaForm();

  const watchCustomer = watch("customer");
  const watchItems = watch("items") ?? [];

  useEffect(() => {
    if (!watchCustomer) return;
    api
      .get(`/clientes/buscar?nombre=${encodeURIComponent(watchCustomer.trim())}`)
      .then((r) => setValue("address", r.data.address))
      .catch(() => setValue("address", ""));
  }, [watchCustomer, setValue]);

  const addItem = () => setValue("items", [...watchItems, { service: "", importe: 0 }]);
  const removeItem = (idx: number) =>
    setValue("items", watchItems.filter((_, i) => i !== idx));

  const nav = useNavigate();

  return (
    <div className="dashboard-main">
      <div className="mb-5 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="fw-bold mb-1">Nueva Factura</h2>
          <p className="text-muted">Completa los datos para generar una nueva factura</p>
        </div>
        <button type="button" onClick={() => nav(-1)} className="btn-ghost">
          <FaArrowLeft /> Volver
        </button>
      </div>

      <div className="stat-card p-4 mx-auto" style={{ maxWidth: "1000px" }}>
        <form onSubmit={handleSubmit}>
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <label className="form-label fw-semibold">Número de Factura</label>
              <input {...register("nofactura")} className="form-control" placeholder="FAC-000" />
              {errors.nofactura && <div className="invalid-feedback d-block">{errors.nofactura.message}</div>}
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Fecha</label>
              <input type="date" {...register("fecha")} className="form-control" />
              {errors.fecha && <div className="invalid-feedback d-block">{errors.fecha.message}</div>}
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">Cliente</label>
              <input list="clientes-list" {...register("customer")} className="form-control" placeholder="Buscar cliente..." />
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
            <input {...register("address")} className="form-control" placeholder="Dirección completa..." />
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
                        <input list="servicios-list" {...register(`items.${idx}.service`)} className="form-control" placeholder="Seleccione servicio..." />
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
                            placeholder="0.00"
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
              <span className="text-muted">Total a Facturar</span>
              <h3 className="fw-bold mb-0 text-dark">
                ${watchItems.reduce((sum, it) => sum + (Number(it.importe) || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <button type="submit" className="btn-modern btn-modern-success px-5">
              <FaCheck /> Guardar y Generar Factura
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}