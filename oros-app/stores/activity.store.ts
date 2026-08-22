export interface ActivityState {
  open: boolean;
  title: string;
  step: string;
  status: "loading" | "success" | "error";
  errorMsg?: string;
  txHash?: string;
}

let state: ActivityState = {
  open: false,
  title: "",
  step: "",
  status: "loading",
};

const listeners = new Set<() => void>();

export function getActivityState() {
  return state;
}

export function setActivityState(next: Partial<ActivityState>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
  return state;
}

export function subscribeToActivity(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
