import { useState, useEffect } from 'react';
import { LocationInput } from './components/LocationInput';
import { MapView } from './components/MapView';
import { FareCard } from './components/FareCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Location, Route, FareComparison } from './types';
import { getRoute } from './services/routing';
import { calculateFares } from './services/fareCalculation';
import { ArrowUpDown, MapPin } from 'lucide-react';

function App() {
  const [fromLocation, setFromLocation] = useState<Location | null>(null);
  const [toLocation, setToLocation] = useState<Location | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [fareComparisons, setFareComparisons] = useState<FareComparison[]>([]);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      if (fromLocation && toLocation) {
        setIsLoadingRoute(true);
        setRouteError(null);
        
        try {
          const routeData = await getRoute(
            [fromLocation.lat, fromLocation.lon],
            [toLocation.lat, toLocation.lon]
          );
          
          if (routeData) {
            setRoute(routeData);
            const fares = calculateFares(routeData.distance, routeData.duration);
            setFareComparisons(fares);
          } else {
            setRouteError('Unable to find a route between these locations');
            setRoute(null);
            setFareComparisons([]);
          }
        } catch (error) {
          setRouteError('Error calculating route. Please try again.');
          setRoute(null);
          setFareComparisons([]);
        } finally {
          setIsLoadingRoute(false);
        }
      } else {
        setRoute(null);
        setFareComparisons([]);
      }
    };

    fetchRoute();
  }, [fromLocation, toLocation]);

  const handleSwapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const handleBookRide = (providerId: string) => {
    const comparison = fareComparisons.find(c => c.provider.id === providerId);
    if (comparison && comparison.provider.bookingUrl !== '#') {
      window.open(comparison.provider.bookingUrl, '_blank');
    }
  };

  const formatDistance = (distance: number) => {
    return distance >= 1000 ? `${(distance / 1000).toFixed(1)} km` : `${Math.round(distance)} m`;
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.round(duration / 60);
    return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes} min`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            🚗 Ride Fare Comparison
          </h1>
          <p className="text-gray-600 text-lg">
            Compare fares from top ride providers in India
          </p>
        </div>

        {/* Location Inputs */}
        <div className="max-w-2xl mx-auto mb-8 relative z-20 overflow-visible">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 overflow-visible">
            <div className="space-y-6">
              <LocationInput
                label="From"
                placeholder="Enter pickup location"
                value={fromLocation}
                onChange={setFromLocation}
                showCurrentLocation={true}
              />
              
              <div className="flex justify-center">
                <button
                  onClick={handleSwapLocations}
                  className="p-2 rounded-full bg-primary-100 hover:bg-primary-200 text-primary-600 transition-colors duration-200"
                  disabled={!fromLocation || !toLocation}
                >
                  <ArrowUpDown size={20} />
                </button>
              </div>
              
              <LocationInput
                label="To"
                placeholder="Enter destination"
                value={toLocation}
                onChange={setToLocation}
              />
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="mb-8 relative z-1">
          <MapView 
            fromLocation={fromLocation} 
            toLocation={toLocation} 
            route={route} 
          />
        </div>

        {/* Route Info */}
        {route && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPin size={16} />
                  <span>Distance: <span className="font-medium">{formatDistance(route.distance)}</span></span>
                </div>
                <span>Duration: <span className="font-medium">{formatDuration(route.duration)}</span></span>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoadingRoute && (
          <div className="max-w-2xl mx-auto">
            <LoadingSpinner text="Finding best routes and calculating fares..." />
          </div>
        )}

        {/* Error State */}
        {routeError && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-red-600">{routeError}</p>
            </div>
          </div>
        )}

        {/* Fare Comparison Cards */}
        {fareComparisons.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Available Rides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fareComparisons.map((comparison) => (
                <FareCard
                  key={comparison.provider.id}
                  comparison={comparison}
                  onBook={handleBookRide}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!fromLocation && !toLocation && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Plan Your Journey
            </h3>
            <p className="text-gray-500">
              Enter your pickup and destination to compare ride fares from multiple providers
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;