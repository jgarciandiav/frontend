export default function Spinner({ fullScreen = true }: { fullScreen?: boolean }) {
  const cls = fullScreen
    ? "position-fixed top-50 start-50 translate-middle"
    : "d-flex justify-content-center p-3";
  return (
    <div className={cls} style={{ zIndex: 9999 }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  );
}