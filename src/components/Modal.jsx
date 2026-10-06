import { useEffect, useState } from "react";
import { ErrorMessage } from "./Feedback";

// Modal com formulário: cuida de erro, "salvando" e de fechar após o sucesso.
export default function Modal({ title, submitLabel = "Salvar", onClose, onSubmit, children }) {
  const [erro, setErro] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const enviar = async (e) => {
    e.preventDefault();
    setErro("");
    setBusy(true);
    try {
      await onSubmit();
      onClose();
    } catch (err) {
      setErro(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={enviar} role="dialog" aria-modal="true" aria-label={title}>
        <h2>{title}</h2>
        {children}
        {erro && <ErrorMessage message={erro} />}
        <div className="actions">
          <button type="button" className="btn ghost" onClick={onClose}>Cancelar</button>
          <button className="btn" disabled={busy}>{busy ? "Salvando..." : submitLabel}</button>
        </div>
      </form>
    </div>
  );
}
