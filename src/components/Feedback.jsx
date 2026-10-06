export const Loading = ({ text = "Carregando..." }) => (
  <p className="note" role="status">{text}</p>
);

export const Empty = ({ children }) => <p className="note">{children}</p>;

export const ErrorMessage = ({ message, onRetry }) => (
  <div className="alert" role="alert">
    <span><strong>Algo deu errado.</strong> {message}</span>
    {onRetry && <button type="button" className="btn ghost sm" onClick={onRetry}>Tentar de novo</button>}
  </div>
);
