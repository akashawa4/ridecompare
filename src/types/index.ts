export interface Location {
  lat: number;
  lon: number;
  display_name: string;
  name?: string;
}

export interface Route {
  coordinates: [number, number][];
  distance: number;
  duration: number;
}

export interface RideProvider {
  id: string;
  name: string;
  logo: string;
  vehicleType: 'bike' | 'auto' | 'cab';
  estimatedFare: number;
  eta: number;
  bookingUrl: string;
  color: string;
}

export interface FareComparison {
  provider: RideProvider;
  fare: number;
  eta: number;
  surge?: number;
}