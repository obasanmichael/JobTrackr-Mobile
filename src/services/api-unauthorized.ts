let onUnauthorized = (): void => {
  /* default no-op until auth store registers handler */
};

export function registerUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler;
}

export function invokeUnauthorized(): void {
  onUnauthorized();
}
