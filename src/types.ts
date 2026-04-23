export interface LocationData {
  address: string;
  lat: number | null;
  lng: number | null;
}

export interface FormData {
  phone: string;
  countryCode: string;
  home: LocationData;
  work: LocationData;
}

export type Step = 'phone' | 'home' | 'work' | 'confirm' | 'success';
