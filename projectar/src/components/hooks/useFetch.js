import { useState, useEffect, useRef } from "react";

export const useFetch = (url) => {
  const isCurrent = useRef(true);
  const [state, setState] = useState({ data: null, loading: true });
  const baseUrl = "https://projectar.devcodes.co";
  useEffect(
    () => {
      setState({ data: state.data, loading: true });
      fetch(baseUrl + url)
        .then((res) => res.json())
        .then((val) => {
          if (isCurrent.current) {
            setState({ data: val, loading: false });
          }
        });
    },
    [url, setState]
  );
  return state;
};
