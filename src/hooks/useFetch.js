import { useCallback, useEffect, useState } from "react";

// Carrega dados do REST com estados de loading/erro e reload().
export default function useFetch(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: "" });

  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: "" }));
    return fn()
      .then((data) => setState({ data, loading: false, error: "" }))
      .catch((e) => setState({ data: null, loading: false, error: e.message }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}
