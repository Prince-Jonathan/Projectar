import React from "react";
import { usePromiseTracker } from "react-promise-tracker";
import { css } from "@emotion/core";
import BarLoader from "react-spinners/BarLoader";

const LoadingIndicator = (props) => {
  //   const [loading, setLoading] = useState(false);
  const { promiseInProgress } = usePromiseTracker({ delay: 500 });
  return (
    promiseInProgress && (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <BarLoader color="#095D6E" width={100} height={4} loading={true} />
      </div>
    )
  );
};

export default LoadingIndicator;
