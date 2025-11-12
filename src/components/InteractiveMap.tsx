import { useState, useCallback } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin, Navigation2, Locate } from 'lucide-react';

interface DonationPoint {
  id: number;
  name: string;
  address: string;
  coords: [number, number];
  type: 'fix' | 'mobile';
  openNow: boolean;
}

interface InteractiveMapProps {
  onPointClick?: (pointId: number) => void;
}

export function InteractiveMap({ onPointClick }: InteractiveMapProps) {
  const [viewState, setViewState] = useState({
    longitude: 2.1734,
    latitude: 41.3851,
    zoom: 13.5
  });

  const [userLocation, setUserLocation] = useState<[number, number]>([2.1734, 41.3851]);
  const [showUserLocation, setShowUserLocation] = useState(true);

  const handleLocateUser = () => {
    // Try to get actual geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setUserLocation([longitude, latitude]);
          setViewState({
            longitude,
            latitude,
            zoom: 14
          });
          setShowUserLocation(true);
        },
        () => {
          // Fallback to default Barcelona location
          setUserLocation([2.1734, 41.3851]);
          setShowUserLocation(true);
        }
      );
    } else {
      // Fallback if geolocation not supported
      setUserLocation([2.1734, 41.3851]);
      setShowUserLocation(true);
    }
  };

  const donationPoints: DonationPoint[] = [
    {
      id: 1,
      name: 'Hospital Clínic',
      address: 'Carrer Villarroel, 170',
      coords: [2.1550, 41.3886],
      type: 'fix',
      openNow: true
    },
    {
      id: 2,
      name: 'Universitat UB',
      address: 'Gran Via, 585',
      coords: [2.1658, 41.3860],
      type: 'fix',
      openNow: true
    },
    {
      id: 3,
      name: 'Plaça Catalunya',
      address: 'Unitat Mòbil',
      coords: [2.1704, 41.3874],
      type: 'mobile',
      openNow: true
    },
    {
      id: 4,
      name: 'Gràcia',
      address: 'Carrer Gran de Gràcia, 128',
      coords: [2.1586, 41.3995],
      type: 'fix',
      openNow: false
    }
  ];

  return (
    <div className="relative w-full h-full">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Navigation Controls */}
        <NavigationControl position="top-right" />
        
        {/* User location marker */}
        {showUserLocation && (
          <Marker
            longitude={userLocation[0]}
            latitude={userLocation[1]}
            anchor="center"
          >
            <div className="relative">
              <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg"></div>
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
            </div>
          </Marker>
        )}

        {/* Donation Point Markers */}
        {donationPoints.map((point) => (
          <Marker
            key={point.id}
            longitude={point.coords[0]}
            latitude={point.coords[1]}
            anchor="bottom"
            onClick={() => onPointClick?.(point.id)}
          >
            <div 
              className="cursor-pointer transform hover:scale-110 transition-transform"
              style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}
            >
              {point.type === 'mobile' ? (
                // Mobile unit marker
                <div className="relative">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center border-3 border-white shadow-lg">
                    <span className="text-2xl">🚐</span>
                  </div>
                  {point.openNow && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
              ) : (
                // Fixed location marker
                <div className="relative">
                  <div 
                    className={`w-14 h-14 ${point.openNow ? 'bg-[#E30613]' : 'bg-gray-400'} rounded-full flex items-center justify-center border-3 border-white shadow-lg ${point.openNow ? 'animate-pulse' : ''}`}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2C9.243 2 7 4.243 7 7c0 2.5 5 11 5 11s5-8.5 5-11c0-2.757-2.243-5-5-5zm0 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                    </svg>
                  </div>
                  {point.openNow && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  )}
                </div>
              )}
              
              {/* Tooltip on hover */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block whitespace-nowrap">
                <div className="bg-white rounded-lg shadow-xl px-3 py-2 border border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{point.name}</p>
                  <p className="text-xs text-gray-600">{point.address}</p>
                  <span className={`text-xs ${point.openNow ? 'text-green-600' : 'text-gray-500'}`}>
                    {point.openNow ? '● Obert' : '● Tancat'}
                  </span>
                </div>
              </div>
            </div>
          </Marker>
        ))}
      </Map>

      {/* Location Badge */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-xl text-sm z-10 border border-gray-200/50 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="font-medium text-gray-900">Barcelona, Eixample</span>
        </div>
      </div>

      {/* Custom Geolocate Button */}
      <button
        onClick={handleLocateUser}
        className="absolute top-[120px] right-4 w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200 z-10"
        title="Troba la meva ubicació"
      >
        <Locate className="w-5 h-5 text-gray-700" />
      </button>

      {/* Info Card */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-gray-200/50 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E30613]/10 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#E30613]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {donationPoints.filter(p => p.openNow).length} punts oberts
              </p>
              <p className="text-xs text-gray-600">Toca per veure detalls</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Navigation2 className="w-4 h-4" />
            <span>Geolocalització activa</span>
          </div>
        </div>
      </div>
    </div>
  );
}