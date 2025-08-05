import { Location } from '../types';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

export const searchLocations = async (query: string): Promise<Location[]> => {
  if (!query || query.length < 3) return [];

  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=5&addressdetails=1`
    );
    
    if (!response.ok) throw new Error('Failed to fetch locations');
    
    const data = await response.json();
    return data.map((item: any) => ({
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      display_name: item.display_name,
      name: item.name || item.display_name.split(',')[0]
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
};

export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          
          if (!response.ok) throw new Error('Failed to reverse geocode');
          
          const data = await response.json();
          resolve({
            lat: latitude,
            lon: longitude,
            display_name: data.display_name,
            name: 'Current Location'
          });
        } catch (error) {
          resolve({
            lat: latitude,
            lon: longitude,
            display_name: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            name: 'Current Location'
          });
        }
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
};