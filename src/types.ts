// The slice of Home Assistant's frontend `hass` object HyggeHub relies on.
// Kept local rather than pulling in custom-card-helpers, which lags the real frontend.

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
}

export interface HassUser {
  id: string;
  name: string;
  is_admin: boolean;
}

export type Unsubscribe = () => Promise<void> | void;

export interface HassConnection {
  subscribeMessage<T>(callback: (msg: T) => void, message: Record<string, unknown>): Promise<Unsubscribe>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  user?: HassUser;
  themes?: { darkMode?: boolean; theme?: string };
  language?: string;
  locale?: { language: string; time_format?: string };
  connection: HassConnection;
  callService(domain: string, service: string, data?: Record<string, unknown>, target?: Record<string, unknown>): Promise<unknown>;
  callWS<T>(message: Record<string, unknown>): Promise<T>;
  hassUrl(path?: string): string;
  config?: { location_name?: string; time_zone?: string; unit_system?: Record<string, string> };
  formatEntityState?(stateObj: HassEntity, state?: string): string;
}

export interface CardConfig {
  type: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    customCards?: Array<{ type: string; name: string; description: string; preview?: boolean; documentationURL?: string }>;
  }
}
