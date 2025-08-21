let sessionHandler = null;

export function registerSessionHandler(fn) {
  sessionHandler = fn;
}

export function getSession() {
    if (typeof sessionHandler === "function") {
        return sessionHandler();
    }
}
