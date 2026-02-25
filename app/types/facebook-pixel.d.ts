interface Window {
  fbq: (
    command: 'track' | 'trackCustom' | 'init',
    eventName: string,
    parameters?: Record<string, any>
  ) => void;
  _fbq?: any;
}