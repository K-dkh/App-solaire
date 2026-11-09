// Domain types shared by the screens, the local storage and the API client.

export type PanelTypeId = 'monocrystalline' | 'polycrystalline' | 'thin-film';

export type Orientation = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/** A photovoltaic installation as entered by the client (FCT-10, FCT-11, FCT-12). */
export interface Installation {
  id: string;
  name: string;
  address: string;
  /** Rounded to ~1 km for privacy (GDPR), see roundCoordinates(). */
  coordinates: Coordinates | null;
  panelType: PanelTypeId;
  panelCount: number;
  /** Total peak power of the installation, in watt-peak (Wc). */
  peakPowerWc: number;
  /** Total panel surface, in square metres. */
  surfaceM2: number;
  orientation: Orientation;
  /** Tilt angle in degrees, 0 (flat) to 90 (vertical). */
  tiltDeg: number;
  /** Total cost incl. VAT, in euros. */
  costEur: number;
  /** Subsidies received, in euros (optional, 0 if none). */
  subsidiesEur: number;
  /** Price paid for one kWh bought from the grid, in €/kWh. */
  electricityPriceEurPerKwh: number;
  createdAt: string;
  updatedAt: string;
}

/** Raw form values: every field is a string while the user is typing. */
export interface InstallationFormValues {
  name: string;
  address: string;
  coordinates: Coordinates | null;
  panelType: PanelTypeId;
  panelCount: string;
  /** Typed in kWc, as in the mock-up; converted to Wc when saved. */
  peakPowerKwc: string;
  surfaceM2: string;
  orientation: Orientation;
  tiltDeg: string;
  costEur: string;
  subsidiesEur: string;
  electricityPriceEurPerKwh: string;
}

export type FormErrors = Partial<Record<keyof InstallationFormValues, string>>;
