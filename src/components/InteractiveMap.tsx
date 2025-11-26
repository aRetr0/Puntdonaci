import { useState } from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin, Navigation2, Locate, Truck, Building2 } from 'lucide-react';
import { useDonationCenters } from '@/hooks/useDonationCenters';
import { DonationCenter } from '@/types';

interface InteractiveMapProps {
  onPointClick?: (pointId: string) => void;
}

export function InteractiveMap({ onPointClick }: InteractiveMapProps) {
  const [viewState, setViewState] = useState({
    longitude: 2.1734,
    latitude: 41.3851,
    zoom: 13.5
  });

  const [userLocation, setUserLocation] = useState<[number, number]>([2.1734, 41.3851]);
  const [showUserLocation, setShowUserLocation] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState<DonationCenter | null>(null);

  const { data: donationCenters = [] } = useDonationCenters();

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
        {donationCenters.map((point) => (
          <div key={point.id}>
            <Marker
              longitude={point.coordinates.lng}
              latitude={point.coordinates.lat}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedPoint(point);
                onPointClick?.(point.id);
              }}
            >
              <div
                className="cursor-pointer transform hover:scale-110 transition-transform group"
                style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}
              >
                {point.type === 'mobile' ? (
                  // Mobile unit marker
                  <div className="relative">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                      <Truck className="w-5 h-5 text-white" />
                    </div>
                    {point.openNow && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                ) : (
                  // Fixed location marker
                  <div className="relative">
                    <div
                      className={`w-12 h-12 ${point.openNow ? 'bg-[#E30613]' : 'bg-gray-500'} rounded-full flex items-center justify-center border-2 border-white shadow-lg`}
                    >
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    {point.openNow && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                    )}
                  </div>
                )}
              </div>
            </Marker>

            {selectedPoint?.id === point.id && (
              <Popup
                longitude={point.coordinates.lng}
                latitude={point.coordinates.lat}
                anchor="top"
                onClose={() => setSelectedPoint(null)}
                closeOnClick={false}
                className="z-50"
              >
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-gray-900 mb-1">{point.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{point.address}</p>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${point.openNow ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {point.openNow ? 'Obert ara' : 'Tancat'}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{point.type === 'fix' ? 'Centre Fix' : 'Unitat Mòbil'}</span>
                  </div>
                </div>
              </Popup>
            )}
          </div>
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
                {donationCenters.filter(p => p.openNow).length} punts oberts
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