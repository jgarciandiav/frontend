import { useEffect } from "react";
import { useCrudQuery } from "../src/hooks/useCrudQuery";
import { useFacturaForm } from "../src/hooks/useFacturaForm";
import { FaPlus, FaTrash } from "react-icons/fa";
import { api } from "../src/api";

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

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="card shadow-sm p-4">
        <h2 className="card-title mb-4">Nueva Factura</h2>

        <div className="row g-3 mb-3">
          <div className="col-md-2">
            <label className="form-label">Número</label>
            <input {...register("nofactura")} className="form-control" />
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
            <select {...register("cobrado")} className="form-select">
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

        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-bold">Total: ${watchItems.reduce((sum, it) => sum + (Number(it.importe) || 0), 0).toFixed(2)}</span>
          <button type="submit" className="btn btn-success">Guardar Factura</button>
        </div>
      </div>
    </form>
  );
}