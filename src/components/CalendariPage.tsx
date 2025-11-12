import { useState } from 'react';
import { MapPin, Filter, Clock, Navigation, ChevronRight, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function CalendariPage() {
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const donationPoints = [
    {
      id: 1,
      name: 'Banc de Sang - Hospital Clínic',
      address: 'Carrer Villarroel, 170, Barcelona',
      distance: '0.8 km',
      openNow: true,
      availableToday: true,
      types: ['Sang Total', 'Plaquetes', 'Plasma']
    },
    {
      id: 2,
      name: 'Banc de Sang - Universitat UB',
      address: 'Gran Via de les Corts Catalanes, 585',
      distance: '1.2 km',
      openNow: true,
      availableToday: true,
      types: ['Sang Total']
    },
    {
      id: 3,
      name: 'Banc de Sang - Gràcia',
      address: 'Carrer Gran de Gràcia, 128',
      distance: '2.5 km',
      openNow: false,
      availableToday: false,
      types: ['Sang Total', 'Plasma']
    }
  ];

  const availableDates = [
    { date: '2025-11-13', label: 'Demà', available: true },
    { date: '2025-11-14', label: 'Dijous', available: true },
    { date: '2025-11-15', label: 'Divendres', available: true },
    { date: '2025-11-16', label: 'Dissabte', available: false },
    { date: '2025-11-17', label: 'Diumenge', available: false },
    { date: '2025-11-18', label: 'Dilluns', available: true }
  ];

  const timeSlots = [
    { time: '09:00', available: true },
    { time: '09:30', available: true },
    { time: '10:00', available: false },
    { time: '10:30', available: true },
    { time: '11:00', available: true },
    { time: '11:30', available: true }
  ];

  const handleConfirmBooking = () => {
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingConfirmed(false);
      setSelectedPoint(null);
      setShowDatePicker(false);
      setSelectedDate(null);
      setSelectedTime(null);
    }, 3000);
  };

  if (bookingConfirmed) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="mb-2">Reserva Confirmada!</h2>
          <p className="text-gray-600 mb-4">
            {selectedDate && `${availableDates.find(d => d.date === selectedDate)?.label} a les ${selectedTime}`}
          </p>
          <div className="bg-[#E30613]/10 rounded-2xl p-4 mb-4">
            <p className="text-sm text-[#E30613]">
              Guanyaràs <strong>15 tokens</strong> amb aquesta donació! 🎉
            </p>
          </div>
          <p className="text-sm text-gray-500">
            T'hem enviat un recordatori al calendari
          </p>
        </div>
      </div>
    );
  }

  if (showDatePicker && selectedPoint) {
    const point = donationPoints.find(p => p.id === selectedPoint);
    
    return (
      <div className="h-full overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-10">
          <button onClick={() => setShowDatePicker(false)} className="text-gray-600">
            ← Tornar
          </button>
          <div>
            <h3 className="text-sm">{point?.name}</h3>
            <p className="text-xs text-gray-500">{point?.address}</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Date Selection */}
          <section>
            <h3 className="mb-4">Selecciona el dia</h3>
            <div className="grid grid-cols-3 gap-3">
              {availableDates.map((dateOption) => (
                <button
                  key={dateOption.date}
                  onClick={() => dateOption.available && setSelectedDate(dateOption.date)}
                  disabled={!dateOption.available}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedDate === dateOption.date
                      ? 'border-[#E30613] bg-[#E30613]/5'
                      : dateOption.available
                      ? 'border-gray-200 hover:border-gray-300'
                      : 'border-gray-100 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <p className="text-sm mb-1">{dateOption.label}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(dateOption.date).getDate()}/{new Date(dateOption.date).getMonth() + 1}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Time Selection */}
          {selectedDate && (
            <section>
              <h3 className="mb-4">Selecciona l'hora</h3>
              <div className="grid grid-cols-3 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => slot.available && setSelectedTime(slot.time)}
                    disabled={!slot.available}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedTime === slot.time
                        ? 'border-[#E30613] bg-[#E30613]/5'
                        : slot.available
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-100 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <Clock className="w-4 h-4 mx-auto mb-1" />
                    <p className="text-sm">{slot.time}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <h4 className="text-sm mb-2 text-blue-900">Informació important</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Vine en dejú o amb esmorzar lleuger</li>
              <li>• Porta el DNI o document identificatiu</li>
              <li>• Durada aproximada: 30-45 minuts</li>
              <li>• Guanyaràs 15 tokens amb aquesta donació</li>
            </ul>
          </div>

          {/* Confirm Button */}
          {selectedDate && selectedTime && (
            <Button 
              onClick={handleConfirmBooking}
              className="w-full bg-[#E30613] hover:bg-[#C00510] text-white h-14 sticky bottom-0"
            >
              Confirmar Reserva
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h2 className="mb-4">Troba el teu punt</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
          <Button variant="outline" className="px-4">
            <Navigation className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Map Preview */}
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin className="w-12 h-12 text-[#E30613] animate-pulse" />
        </div>
        <div className="absolute top-4 left-4 bg-white rounded-xl px-3 py-2 shadow-md text-xs">
          📍 Barcelona, Eixample
        </div>
      </div>

      {/* Donation Points List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <p className="text-sm text-gray-600 mb-2">{donationPoints.length} punts propers a tu</p>
        
        {donationPoints.map((point) => (
          <div
            key={point.id}
            onClick={() => {
              setSelectedPoint(point.id);
              setShowDatePicker(true);
            }}
            className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-[#E30613]"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="text-sm mb-1">{point.name}</h4>
                <p className="text-xs text-gray-600 flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3" />
                  {point.address}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs">
                📍 {point.distance}
              </Badge>
              {point.openNow && (
                <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                  Obert ara
                </Badge>
              )}
              {point.availableToday && (
                <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
                  Disponible avui
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-1">
              {point.types.map((type) => (
                <span key={type} className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {type}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
