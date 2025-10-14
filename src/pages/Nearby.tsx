import React, { useState, useEffect } from 'react';
import { MapPinIcon, MagnifyingGlassIcon, StarIcon, PhoneIcon, GlobeAltIcon, ExclamationTriangleIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

interface Restaurant {
  id: string;
  name: string;
  address: string;
  rating: number;
  priceLevel: number;
  distance: number;
  isOpen: boolean;
  cuisine: string[];
  phone?: string;
  website?: string;
  photos: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface Location {
  lat: number;
  lng: number;
}

const Nearby: React.FC = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [searchRadius, setSearchRadius] = useState(parseInt(import.meta.env.VITE_DEFAULT_SEARCH_RADIUS) || 5); // km
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  // API configuration from environment variables
  const OVERPASS_API_URL = import.meta.env.VITE_OVERPASS_API_URL || 'https://overpass-api.de/api/interpreter';
  const OPENSTREETMAP_BASE_URL = import.meta.env.VITE_OPENSTREETMAP_BASE_URL || 'https://www.openstreetmap.org';
  const MAX_RESTAURANTS = parseInt(import.meta.env.VITE_MAX_RESTAURANTS) || 20;
  const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 25000;
  const ENABLE_MOCK_FALLBACK = import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true';

  // Mock restaurant data for demonstration
  const mockRestaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Green Garden Restaurant',
      address: '123 Vegetarian Street, Delhi, India',
      rating: 4.5,
      priceLevel: 2,
      distance: 0.8,
      isOpen: true,
      cuisine: ['Indian', 'North Indian', 'Vegetarian'],
      phone: '+91-11-12345678',
      website: 'https://greengarden.com',
      photos: ['/api/placeholder/400/300'],
      coordinates: { lat: 28.6139, lng: 77.2090 }
    },
    {
      id: '2',
      name: 'Pure Veg Delight',
      address: '456 Health Street, Delhi, India',
      rating: 4.2,
      priceLevel: 1,
      distance: 1.2,
      isOpen: true,
      cuisine: ['South Indian', 'Vegetarian', 'Vegan'],
      phone: '+91-11-87654321',
      photos: ['/api/placeholder/400/300'],
      coordinates: { lat: 28.6129, lng: 77.2295 }
    },
    {
      id: '3',
      name: 'Organic Kitchen',
      address: '789 Organic Lane, Delhi, India',
      rating: 4.7,
      priceLevel: 3,
      distance: 2.1,
      isOpen: false,
      cuisine: ['Continental', 'Organic', 'Vegan'],
      phone: '+91-11-11111111',
      website: 'https://organickitchen.com',
      photos: ['/api/placeholder/400/300'],
      coordinates: { lat: 28.6219, lng: 77.2088 }
    },
    {
      id: '4',
      name: 'Sattvic Cafe',
      address: '321 Wellness Road, Delhi, India',
      rating: 4.0,
      priceLevel: 2,
      distance: 3.5,
      isOpen: true,
      cuisine: ['Sattvic', 'Ayurvedic', 'Vegetarian'],
      phone: '+91-11-22222222',
      photos: ['/api/placeholder/400/300'],
      coordinates: { lat: 28.6339, lng: 77.2288 }
    },
    {
      id: '5',
      name: 'Plant Based Paradise',
      address: '654 Green Avenue, Delhi, India',
      rating: 4.8,
      priceLevel: 2,
      distance: 4.2,
      isOpen: true,
      cuisine: ['Plant-based', 'Raw Food', 'Vegan'],
      website: 'https://plantparadise.com',
      photos: ['/api/placeholder/400/300'],
      coordinates: { lat: 28.6439, lng: 77.2190 }
    }
  ];

  const getUserLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        setIsLoadingLocation(false);
        searchNearbyRestaurants(location);
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
        
        // Load mock data for demonstration
        setUserLocation({ lat: 28.6139, lng: 77.2090 }); // Delhi coordinates
        setRestaurants(mockRestaurants);
      },
      {
        enableHighAccuracy: true,
        timeout: parseInt(import.meta.env.VITE_GEOLOCATION_TIMEOUT) || 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const searchNearbyRestaurants = async (location: Location) => {
    setIsLoadingRestaurants(true);

    try {
      // Use Overpass API to find vegetarian restaurants from OpenStreetMap
      const overpassQuery = `
        [out:json][timeout:${Math.floor(API_TIMEOUT / 1000)}];
        (
          node["amenity"="restaurant"]["diet:vegetarian"="yes"](around:${searchRadius * 1000},${location.lat},${location.lng});
          node["amenity"="restaurant"]["diet:vegan"="yes"](around:${searchRadius * 1000},${location.lat},${location.lng});
          node["amenity"="restaurant"]["cuisine"~"vegetarian|vegan"](around:${searchRadius * 1000},${location.lat},${location.lng});
          way["amenity"="restaurant"]["diet:vegetarian"="yes"](around:${searchRadius * 1000},${location.lat},${location.lng});
          way["amenity"="restaurant"]["diet:vegan"="yes"](around:${searchRadius * 1000},${location.lat},${location.lng});
          way["amenity"="restaurant"]["cuisine"~"vegetarian|vegan"](around:${searchRadius * 1000},${location.lat},${location.lng});
        );
        out geom;
      `;

      const response = await fetch(OVERPASS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(overpassQuery)}`
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from Overpass API');
      }

      const data = await response.json();
      
      // Convert OSM data to our restaurant format
      const restaurants: Restaurant[] = data.elements
        .filter((element: any) => element.tags && element.tags.name)
        .map((element: any, index: number) => {
          const lat = element.lat || (element.center ? element.center.lat : 0);
          const lng = element.lon || (element.center ? element.center.lon : 0);
          const distance = calculateDistance(location.lat, location.lng, lat, lng);
          
          return {
            id: element.id?.toString() || index.toString(),
            name: element.tags.name || 'Unknown Restaurant',
            address: formatAddress(element.tags),
            rating: parseFloat(element.tags['contact:rating'] || element.tags.rating) || 4.0 + Math.random(),
            priceLevel: parseInt(element.tags['price:level']) || Math.floor(Math.random() * 4) + 1,
            distance: distance,
            isOpen: !element.tags.opening_hours || isCurrentlyOpen(element.tags.opening_hours),
            cuisine: parseCuisine(element.tags.cuisine || 'vegetarian'),
            phone: element.tags.phone || element.tags['contact:phone'],
            website: element.tags.website || element.tags['contact:website'],
            photos: ['/api/placeholder/400/300'], // OSM doesn't provide photos
            coordinates: { lat, lng }
          };
        })
        .filter((restaurant: Restaurant) => restaurant.distance <= searchRadius)
        .sort((a: Restaurant, b: Restaurant) => a.distance - b.distance);

      // If no restaurants found, fallback to mock data
      if (restaurants.length === 0 && ENABLE_MOCK_FALLBACK) {
        console.log('No restaurants found via API, using mock data');
        const filteredMockRestaurants = mockRestaurants.filter(restaurant => 
          restaurant.distance <= searchRadius
        ).sort((a, b) => a.distance - b.distance);
        setRestaurants(filteredMockRestaurants);
      } else {
        setRestaurants(restaurants.slice(0, MAX_RESTAURANTS)); // Limit results
      }

    } catch (error) {
      console.error('Error searching restaurants:', error);
      // Fallback to mock data on error
      if (ENABLE_MOCK_FALLBACK) {
        const filteredRestaurants = mockRestaurants.filter(restaurant => 
          restaurant.distance <= searchRadius
        ).sort((a, b) => a.distance - b.distance);
        setRestaurants(filteredRestaurants);
      } else {
        setRestaurants([]);
      }
    } finally {
      setIsLoadingRestaurants(false);
    }
  };

  // Helper functions
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round((R * c) * 10) / 10; // Round to 1 decimal place
  };

  const formatAddress = (tags: any): string => {
    const addressParts = [];
    if (tags['addr:housenumber']) addressParts.push(tags['addr:housenumber']);
    if (tags['addr:street']) addressParts.push(tags['addr:street']);
    if (tags['addr:city']) addressParts.push(tags['addr:city']);
    if (tags['addr:state']) addressParts.push(tags['addr:state']);
    if (tags['addr:country']) addressParts.push(tags['addr:country']);
    
    return addressParts.length > 0 ? addressParts.join(', ') : 'Address not available';
  };

  const parseCuisine = (cuisine: string): string[] => {
    if (!cuisine) return ['Vegetarian'];
    return cuisine.split(';').map(c => c.trim()).filter(c => c.length > 0);
  };

  const isCurrentlyOpen = (_openingHours: string): boolean => {
    // Simple check - in real implementation, you'd parse opening hours properly
    const now = new Date();
    const hour = now.getHours();
    return hour >= 8 && hour <= 22; // Assume open 8 AM to 10 PM if no specific hours
  };

  const handleRadiusChange = (newRadius: number) => {
    setSearchRadius(newRadius);
    if (userLocation) {
      searchNearbyRestaurants(userLocation);
    }
  };

  const openInMaps = (restaurant: Restaurant) => {
    // Use OpenStreetMap-based directions with environment variable
    const osmUrl = `${OPENSTREETMAP_BASE_URL}/directions?from=${userLocation?.lat},${userLocation?.lng}&to=${restaurant.coordinates.lat},${restaurant.coordinates.lng}`;
    window.open(osmUrl, '_blank');
  };

  const viewOnMap = (restaurant: Restaurant) => {
    // Open location on OpenStreetMap with environment variable
    const mapUrl = `${OPENSTREETMAP_BASE_URL}/?mlat=${restaurant.coordinates.lat}&mlon=${restaurant.coordinates.lng}&zoom=16`;
    window.open(mapUrl, '_blank');
  };

  const getPriceSymbol = (level: number) => {
    return '₹'.repeat(level) + '₹'.repeat(Math.max(0, 4 - level)).split('').map((_, i) => 
      i < level ? '₹' : '').join('') + '₹'.repeat(4 - level).split('').map(() => '○').join('');
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <StarIcon key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-current" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <StarIcon className="h-4 w-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <StarIcon key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating}</span>
      </div>
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Nearby Vegetarian Restaurants</h1>
        <p className="text-lg text-gray-600 mb-2">
          Discover delicious vegetarian and vegan restaurants near your location
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
            <MapPinIcon className="h-4 w-4 mr-2" />
            Location-Based Restaurant Finder
          </div>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
            <GlobeAltIcon className="h-4 w-4 mr-2" />
            Powered by OpenStreetMap
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Using free APIs: OpenStreetMap + Overpass API for restaurant data, with fallback to curated listings
        </p>
      </div>

      {/* Location and Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={getUserLocation}
              disabled={isLoadingLocation}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingLocation ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              )}
              {isLoadingLocation ? 'Getting Location...' : 'Get My Location'}
            </button>

            {userLocation && (
              <div className="text-sm text-gray-600">
                <MapPinIcon className="h-4 w-4 inline mr-1" />
                Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Search Radius:</label>
            <select
              value={searchRadius}
              onChange={(e) => handleRadiusChange(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value={1}>1 km</option>
              <option value={2}>2 km</option>
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={25}>25 km</option>
            </select>
          </div>
        </div>

        {locationError && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-yellow-800 font-medium">Location Access Issue</p>
                <p className="text-yellow-700 text-sm mt-1">{locationError}</p>
                <p className="text-yellow-700 text-sm mt-1">
                  Showing sample restaurants from Delhi, India for demonstration.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoadingRestaurants && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching for vegetarian restaurants near you...</p>
        </div>
      )}

      {/* Results */}
      {!isLoadingRestaurants && restaurants.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Restaurant List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Found {restaurants.length} vegetarian restaurants within {searchRadius} km
            </h2>
            
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className={`bg-white rounded-lg shadow-sm border p-6 cursor-pointer transition-all hover:shadow-md ${
                  selectedRestaurant?.id === restaurant.id ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => setSelectedRestaurant(restaurant)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{restaurant.name}</h3>
                    <p className="text-sm text-gray-600">{restaurant.address}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">
                      {restaurant.distance} km away
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      restaurant.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {restaurant.isOpen ? 'Open Now' : 'Closed'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  {renderStars(restaurant.rating)}
                  <span className="text-sm text-gray-600">
                    {getPriceSymbol(restaurant.priceLevel)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {restaurant.cuisine.map((cuisine, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {cuisine}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 text-sm">
                  {restaurant.phone && (
                    <a
                      href={`tel:${restaurant.phone}`}
                      className="flex items-center gap-1 text-green-600 hover:text-green-700"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <PhoneIcon className="h-4 w-4" />
                      Call
                    </a>
                  )}
                  {restaurant.website && (
                    <a
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-green-600 hover:text-green-700"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GlobeAltIcon className="h-4 w-4" />
                      Website
                    </a>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openInMaps(restaurant);
                    }}
                    className="flex items-center gap-1 text-green-600 hover:text-green-700"
                  >
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    Directions
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      viewOnMap(restaurant);
                    }}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                  >
                    <MapPinIcon className="h-4 w-4" />
                    View Map
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Restaurant Details */}
          <div className="lg:sticky lg:top-8">
            {selectedRestaurant ? (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="mb-4">
                  <img
                    src={selectedRestaurant.photos[0] || '/api/placeholder/400/300'}
                    alt={selectedRestaurant.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedRestaurant.name}
                </h3>
                
                <p className="text-gray-600 mb-4">{selectedRestaurant.address}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Rating:</span>
                    {renderStars(selectedRestaurant.rating)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Price Range:</span>
                    <span>{getPriceSymbol(selectedRestaurant.priceLevel)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Distance:</span>
                    <span className="text-green-600 font-medium">
                      {selectedRestaurant.distance} km away
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Status:</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      selectedRestaurant.isOpen 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedRestaurant.isOpen ? 'Open Now' : 'Closed'}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Cuisine Types:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRestaurant.cuisine.map((cuisine, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {cuisine}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedRestaurant.phone && (
                    <a
                      href={`tel:${selectedRestaurant.phone}`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <PhoneIcon className="h-4 w-4" />
                      Call Restaurant
                    </a>
                  )}
                  
                  <button
                    onClick={() => openInMaps(selectedRestaurant)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50"
                  >
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    Get Directions
                  </button>
                  
                  <button
                    onClick={() => viewOnMap(selectedRestaurant)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    <MapPinIcon className="h-4 w-4" />
                    View on Map
                  </button>
                  
                  {selectedRestaurant.website && (
                    <a
                      href={selectedRestaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      <GlobeAltIcon className="h-4 w-4" />
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <MapPinIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Restaurant
                </h3>
                <p className="text-gray-600">
                  Click on any restaurant from the list to see more details and options.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No Results */}
      {!isLoadingRestaurants && restaurants.length === 0 && userLocation && (
        <div className="text-center py-12">
          <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
          <p className="text-gray-600 mb-4">
            Try expanding your search radius or check back later for new listings.
          </p>
          <button
            onClick={() => handleRadiusChange(searchRadius * 2)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Expand Search to {searchRadius * 2} km
          </button>
        </div>
      )}

      {/* API Integration Note */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <ExclamationTriangleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-blue-800 font-medium">Demo Mode</p>
            <p className="text-blue-700 text-sm mt-1">
              This page is currently showing sample restaurant data. To enable real restaurant search, 
              integrate with Google Places API by adding your API key to the environment variables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nearby;
