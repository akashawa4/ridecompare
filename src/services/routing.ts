import { Route } from '../types';

const OSRM_BASE_URL = 'https://router.project-osrm.org';

export const getRoute = async (start: [number, number], end: [number, number]): Promise<Route | null> => {
  try {
    const response = await fetch(
      `${OSRM_BASE_URL}/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
    );
    
    if (!response.ok) throw new Error('Failed to fetch route');
    
    const data = await response.json();
    
    if (!data.routes || data.routes.length === 0) return null;
    
    const route = data.routes[0];
    const coordinates = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
    
    return {
      coordinates,
      distance: route.distance,
      duration: route.duration
    };
  } catch (error) {
    console.error('Error fetching route:', error);
    return null;
  }
};