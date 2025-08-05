import { RideProvider, FareComparison } from '../types';

const RIDE_PROVIDERS: RideProvider[] = [
  {
    id: 'uber',
    name: 'Uber',
    logo: '🚗',
    vehicleType: 'cab',
    estimatedFare: 0,
    eta: 0,
    bookingUrl: 'https://m.uber.com/',
    color: '#000000'
  },
  {
    id: 'ola',
    name: 'Ola',
    logo: '🚙',
    vehicleType: 'cab',
    estimatedFare: 0,
    eta: 0,
    bookingUrl: 'https://book.olacabs.com/',
    color: '#00c851'
  },
  {
    id: 'rapido',
    name: 'Rapido',
    logo: '🏍️',
    vehicleType: 'bike',
    estimatedFare: 0,
    eta: 0,
    bookingUrl: 'https://rapido.bike/',
    color: '#ffd700'
  },
  {
    id: 'namma-yatri',
    name: 'Namma Yatri',
    logo: '🚗',
    vehicleType: 'cab',
    estimatedFare: 0,
    eta: 0,
    bookingUrl: 'https://nammayatri.in/',
    color: '#ff6b35'
  },
  {
    id: 'auto',
    name: 'Auto Rickshaw',
    logo: '🛺',
    vehicleType: 'auto',
    estimatedFare: 0,
    eta: 0,
    bookingUrl: '#',
    color: '#28a745'
  }
];

export const calculateFares = (distance: number, duration: number): FareComparison[] => {
  const distanceKm = distance / 1000;
  const durationMin = duration / 60;
  
  return RIDE_PROVIDERS.map(provider => {
    let baseFare = 0;
    let perKmRate = 0;
    let perMinRate = 0;
    
    switch (provider.vehicleType) {
      case 'bike':
        baseFare = 25;
        perKmRate = 4;
        perMinRate = 0.5;
        break;
      case 'auto':
        baseFare = 35;
        perKmRate = 12;
        perMinRate = 1;
        break;
      case 'cab':
        baseFare = provider.id === 'uber' ? 50 : provider.id === 'ola' ? 45 : 40;
        perKmRate = provider.id === 'uber' ? 18 : provider.id === 'ola' ? 16 : 14;
        perMinRate = 2;
        break;
    }
    
    const fare = Math.round(baseFare + (distanceKm * perKmRate) + (durationMin * perMinRate));
    const eta = Math.round(durationMin + (provider.vehicleType === 'bike' ? 3 : provider.vehicleType === 'auto' ? 5 : 7));
    
    // Add some randomness for realistic variation
    const fareVariation = 1 + (Math.random() - 0.5) * 0.2;
    const etaVariation = 1 + (Math.random() - 0.5) * 0.3;
    
    return {
      provider: {
        ...provider,
        estimatedFare: Math.round(fare * fareVariation),
        eta: Math.round(eta * etaVariation)
      },
      fare: Math.round(fare * fareVariation),
      eta: Math.round(eta * etaVariation),
      surge: Math.random() > 0.7 ? 1.2 + Math.random() * 0.5 : undefined
    };
  }).sort((a, b) => a.fare - b.fare);
};