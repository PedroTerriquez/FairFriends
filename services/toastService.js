let toastHandler = null;

export function registerToast(fn) {
  toastHandler = fn;
}

export function toast(message, type) {
  if (typeof toastHandler === "function") {
    toastHandler(message, type);
  }
}
