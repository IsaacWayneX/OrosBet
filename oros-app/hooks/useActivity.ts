"use client";

import { useEffect, useState } from "react";
import { getActivityState, setActivityState, subscribeToActivity } from "@/stores/activity.store";

export function useActivity() {
  const [state, setState] = useState(getActivityState());

  useEffect(() => {
    return subscribeToActivity(() => {
      setState(getActivityState());
    });
  }, []);

  return {
    ...state,
    startActivity(title: string, initialStep: string) {
      setActivityState({
        open: true,
        title,
        step: initialStep,
        status: "loading",
        errorMsg: undefined,
        txHash: undefined,
      });
    },
    updateStep(step: string) {
      setActivityState({ step });
    },
    success(txHash?: string) {
      setActivityState({
        status: "success",
        txHash,
        step: "Transaction confirmed successfully!",
      });
    },
    error(errorMsg: string) {
      setActivityState({
        status: "error",
        errorMsg,
        step: "Transaction failed",
      });
    },
    close() {
      setActivityState({ open: false });
    },
  };
}
