import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, X } from 'lucide-react';
import { searchLocations, getCurrentLocation } from '../services/nominatim';
import { Location } from '../types';

interface LocationInputProps {
  label: string;
  placeholder: string;
  value: Location | null;
  onChange: (location: Location | null) => void;
  showCurrentLocation?: boolean;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  showCurrentLocation = false
}) => {
  const [query, setQuery] = useState(value?.name || '');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setQuery(value.name || value.display_name);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length >= 3) {
        setIsLoading(true);
        const results = await searchLocations(query);
        setSuggestions(results);
        setShowSuggestions(true);
        setIsLoading(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleCurrentLocation = async () => {
    setIsLoadingCurrentLocation(true);
    try {
      const location = await getCurrentLocation();
      onChange(location);
      setQuery(location.name || 'Current Location');
      setShowSuggestions(false);
    } catch (error) {
      console.error('Error getting current location:', error);
    } finally {
      setIsLoadingCurrentLocation(false);
    }
  };

  const handleSuggestionClick = (suggestion: Location) => {
    onChange(suggestion);
    setQuery(suggestion.name || suggestion.display_name);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setQuery('');
    onChange(null);
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <div className="absolute left-3 top-3 text-gray-400">
          <MapPin size={20} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 3 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-11 pr-20 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 bg-white shadow-sm"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <div className="absolute right-3 top-3 flex items-center space-x-2">
          {query && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          )}
          {showCurrentLocation && (
            <button
              onClick={handleCurrentLocation}
              disabled={isLoadingCurrentLocation}
              className="text-primary-500 hover:text-primary-600 transition-colors disabled:opacity-50"
            >
              <Navigation size={18} className={isLoadingCurrentLocation ? 'animate-spin' : ''} />
            </button>
          )}
        </div>
      </div>
      
      <label className="absolute left-3 -top-2 px-2 bg-white text-sm font-medium text-gray-700">
        {label}
      </label>

      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-1 location-input-dropdown">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          ) : (
            suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                onTouchEnd={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 touch-manipulation"
              >
                <div className="flex items-center space-x-3">
                  <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 truncate">
                      {suggestion.name || suggestion.display_name.split(',')[0]}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {suggestion.display_name}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};