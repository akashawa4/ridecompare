import React from 'react';
import { Clock, TrendingUp } from 'lucide-react';
import { FareComparison } from '../types';

interface FareCardProps {
  comparison: FareComparison;
  onBook: (provider: string) => void;
}

export const FareCard: React.FC<FareCardProps> = ({ comparison, onBook }) => {
  const { provider, fare, eta, surge } = comparison;

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case 'bike':
        return '🏍️';
      case 'auto':
        return '🛺';
      case 'cab':
        return '🚗';
      default:
        return '🚗';
    }
  };

  const getVehicleLabel = (vehicleType: string) => {
    switch (vehicleType) {
      case 'bike':
        return 'Bike';
      case 'auto':
        return 'Auto';
      case 'cab':
        return 'Cab';
      default:
        return 'Cab';
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200 animate-slide-up">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getVehicleIcon(provider.vehicleType)}</div>
          <div>
            <h3 className="font-semibold text-gray-900">{provider.name}</h3>
            <p className="text-sm text-gray-500">{getVehicleLabel(provider.vehicleType)}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1">
            <span className="text-2xl font-bold text-gray-900">₹{fare}</span>
            {surge && (
              <div className="flex items-center text-orange-500">
                <TrendingUp size={14} />
                <span className="text-xs font-medium">{surge.toFixed(1)}x</span>
              </div>
            )}
          </div>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <Clock size={14} className="mr-1" />
            <span>{eta} min</span>
          </div>
        </div>
      </div>

      {surge && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 mb-3">
          <p className="text-xs text-orange-700">
            <span className="font-medium">Surge pricing active</span> - Higher demand in your area
          </p>
        </div>
      )}

      <button
        onClick={() => onBook(provider.id)}
        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 active:transform active:scale-95"
        style={{ backgroundColor: provider.color }}
      >
        Book {provider.name}
      </button>
    </div>
  );
};