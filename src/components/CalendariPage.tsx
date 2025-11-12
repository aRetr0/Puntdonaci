import { useState, useRef, useEffect } from 'react';
import { MapPin, Filter, Clock, Navigation, ChevronRight, Check, X, ChevronDown, Droplet } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { InteractiveMap } from './InteractiveMap';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

type ViewType = 'request' | 'myAppointments';
type RequestStep = 'type' | 'location' | 'date' | 'time' | 'confirm';

export function CalendariPage() {
  const [activeView, setActiveView] = useState<ViewType>('request');
  const [requestStep, setRequestStep] = useState<RequestStep>('type');
  
  const [selectedDonationType, setSelectedDonationType] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const donationTypes = [
    { id: 'sang-total', name: 'Sang Total', icon: '🩸', duration: '30-45 min', tokens: 15 },
    { id: 'plaquetes', name: 'Plaquetes', icon: '💉', duration: '90 min', tokens: 20 },
    { id: 'plasma', name: 'Plasma', icon: '💧', duration: '60 min', tokens: 18 },
  ];

  const donationPoints = [
    {
      id: 1,
      name: 'Banc de Sang - Hospital Clínic',
      address: 'Carrer Villarroel, 170, Barcelona',
      distance: '0.8 km',
      type: 'fix',
      openNow: true,
      availableToday: true,
      types: ['sang-total', 'plaquetes', 'plasma']
    },
    {
      id: 2,
      name: 'Banc de Sang - Universitat UB',
      address: 'Gran Via de les Corts Catalanes, 585',
      distance: '1.2 km',
      type: 'fix',
      openNow: true,
      availableToday: true,
      types: ['sang-total']
    },
    {
      id: 3,
      name: 'Unitat Mòbil - Plaça Catalunya',
      address: 'Plaça Catalunya, Barcelona',
      distance: '1.5 km',
      type: 'mobile',
      openNow: true,
      availableToday: true,
      types: ['sang-total', 'plasma']
    },
    {
      id: 4,
      name: 'Banc de Sang - Gràcia',
      address: 'Carrer Gran de Gràcia, 128',
      distance: '2.5 km',
      type: 'fix',
      openNow: false,
      availableToday: false,
      types: ['sang-total', 'plasma']
    }
  ];

  const availableDates = [
    { date: '2025-11-13', label: 'Demà', dayName: 'Dijous', available: true },
    { date: '2025-11-14', label: 'Dijous', dayName: 'Dijous', available: true },
    { date: '2025-11-15', label: 'Divendres', dayName: 'Divendres', available: true },
    { date: '2025-11-16', label: 'Dissabte', dayName: 'Dissabte', available: false },
    { date: '2025-11-17', label: 'Diumenge', dayName: 'Diumenge', available: false },
    { date: '2025-11-18', label: 'Dilluns', dayName: 'Dilluns', available: true },
    { date: '2025-11-19', label: 'Dimarts', dayName: 'Dimarts', available: true },
    { date: '2025-11-20', label: 'Dimecres', dayName: 'Dimecres', available: true }
  ];

  const timeSlots = [
    { time: '09:00', available: true },
    { time: '09:30', available: true },
    { time: '10:00', available: false },
    { time: '10:30', available: true },
    { time: '11:00', available: true },
    { time: '11:30', available: true },
    { time: '12:00', available: true },
    { time: '12:30', available: false }
  ];

  const myAppointments = [
    {
      id: 1,
      date: '2025-11-15',
      time: '10:00',
      type: 'Sang Total',
      location: 'Hospital Clínic',
      address: 'Carrer Villarroel, 170',
      status: 'propera',
      tokens: 15
    },
    {
      id: 2,
      date: '2025-11-20',
      time: '11:30',
      type: 'Plasma',
      location: 'Universitat UB',
      address: 'Gran Via, 585',
      status: 'confirmada',
      tokens: 18
    },
    {
      id: 3,
      date: '2025-10-15',
      time: '09:30',
      type: 'Sang Total',
      location: 'Hospital Clínic',
      address: 'Carrer Villarroel, 170',
      status: 'completada',
      tokens: 15
    }
  ];

  const handleConfirmBooking = () => {
    setBookingConfirmed(true);
    // No resetegem automàticament, deixem que l'usuari decideixi quan sortir
  };

  const selectedPointData = donationPoints.find(p => p.id === selectedPoint);
  const selectedTypeData = donationTypes.find(t => t.id === selectedDonationType);
  const selectedDateData = availableDates.find(d => d.date === selectedDate);

  // Confirmation success screen
  if (bookingConfirmed) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <h2 className="mb-4">Calendari</h2>
        </div>

        {/* Success Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Check className="w-12 h-12 text-white" />
            </div>
            <h2 className="mb-3 text-green-600">Cita confirmada!</h2>
            <p className="text-gray-600 mb-2">
              {selectedDateData?.dayName}, {selectedDate && new Date(selectedDate).getDate()}/{selectedDate && new Date(selectedDate).getMonth() + 1}
            </p>
            <p className="text-gray-600 mb-6">a les {selectedTime}</p>
            <div className="bg-[#E30613]/10 rounded-2xl p-5 mb-6">
              <p className="text-sm text-[#E30613] mb-1">
                Guanyaràs <strong>{selectedTypeData?.tokens} tokens</strong> amb aquesta donació! 🎉
              </p>
            </div>
            <p className="text-sm text-gray-500 mb-8">
              T'hem enviat un recordatori al calendari
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={() => {
                  setBookingConfirmed(false);
                  setActiveView('myAppointments');
                  setRequestStep('type');
                  setSelectedDonationType(null);
                  setSelectedPoint(null);
                  setSelectedDate(null);
                  setSelectedTime(null);
                }}
                className="w-full bg-[#E30613] hover:bg-[#C00510] text-white h-12"
              >
                Veure les meves cites
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setBookingConfirmed(false);
                  setRequestStep('type');
                  setSelectedDonationType(null);
                  setSelectedPoint(null);
                  setSelectedDate(null);
                  setSelectedTime(null);
                }}
                className="w-full h-12"
              >
                Reservar una altra cita
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header with buttons */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h2 className="mb-4">Calendari</h2>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              setActiveView('request');
              setRequestStep('type');
            }}
            className={`flex-1 h-12 ${
              activeView === 'request'
                ? 'bg-[#E30613] text-white hover:bg-[#C00510]'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Demanar cita
          </Button>
          <Button
            onClick={() => setActiveView('myAppointments')}
            className={`flex-1 h-12 ${
              activeView === 'myAppointments'
                ? 'bg-[#E30613] text-white hover:bg-[#C00510]'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Les meves cites
          </Button>
        </div>
      </div>

      {/* My Appointments View */}
      {activeView === 'myAppointments' && !selectedAppointment && (
        <div className="flex-1 overflow-y-auto p-4">
          {/* Desktop: Side-by-side layout | Mobile: Stacked */}
          <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-4 h-full">
            {/* Left: Calendar */}
            <div className="bg-white rounded-2xl p-5 shadow-md h-fit">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm">
                  {new Date().toLocaleDateString('ca-ES', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-sm">
                    ←
                  </button>
                  <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-sm">
                    →
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg'].map((day) => (
                  <div key={day} className="text-center text-xs text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {(() => {
                  const today = new Date();
                  const currentMonth = today.getMonth();
                  const currentYear = today.getFullYear();
                  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
                  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                  
                  // Get appointment dates for this month with their full date strings
                  const appointmentsByDate = new Map();
                  myAppointments.forEach(a => {
                    const apptDate = new Date(a.date);
                    if (apptDate.getMonth() === currentMonth && apptDate.getFullYear() === currentYear) {
                      const day = apptDate.getDate();
                      if (!appointmentsByDate.has(day)) {
                        appointmentsByDate.set(day, []);
                      }
                      appointmentsByDate.get(day).push(a);
                    }
                  });
                  
                  const days = [];
                  
                  // Empty cells before first day (adjust for Monday start)
                  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
                  for (let i = 0; i < adjustedFirstDay; i++) {
                    days.push(<div key={`empty-${i}`} className="aspect-square" />);
                  }
                  
                  // Days of the month
                  for (let day = 1; day <= daysInMonth; day++) {
                    const isToday = day === today.getDate();
                    const hasAppointment = appointmentsByDate.has(day);
                    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isSelected = selectedCalendarDate === dateString;
                    
                    days.push(
                      <button
                        key={day}
                        onClick={() => {
                          if (hasAppointment) {
                            setSelectedCalendarDate(isSelected ? null : dateString);
                          }
                        }}
                        className={`aspect-square flex items-center justify-center rounded-lg text-sm relative transition-all ${
                          isSelected
                            ? 'bg-[#E30613] text-white font-medium ring-2 ring-[#E30613] ring-offset-2'
                            : isToday
                            ? 'bg-[#E30613]/80 text-white font-medium'
                            : hasAppointment
                            ? 'bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 cursor-pointer'
                            : 'text-gray-700 hover:bg-gray-100'
                        } ${hasAppointment && !isToday && !isSelected ? 'cursor-pointer' : ''}`}
                      >
                        {day}
                        {hasAppointment && !isToday && !isSelected && (
                          <div className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-500" />
                        )}
                      </button>
                    );
                  }
                  
                  return days;
                })()}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-[#E30613]" />
                  <span className="text-gray-600">Avui</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-lg bg-blue-100 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-blue-500" />
                  </div>
                  <span className="text-gray-600">Cita programada</span>
                </div>
              </div>
            </div>

            {/* Right: Appointments List */}
            <div className="space-y-4 pr-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm">
                  {selectedCalendarDate 
                    ? `Cites del ${new Date(selectedCalendarDate).toLocaleDateString('ca-ES', { day: 'numeric', month: 'long' })}`
                    : 'Totes les cites'
                  }
                </h3>
                {selectedCalendarDate && (
                  <button 
                    onClick={() => setSelectedCalendarDate(null)}
                    className="text-xs text-gray-500 hover:text-[#E30613]"
                  >
                    Veure totes
                  </button>
                )}
              </div>

              {/* Filtered Appointments */}
              <div className="space-y-3">
                {(() => {
                  const filteredAppointments = selectedCalendarDate
                    ? myAppointments.filter(a => a.date === selectedCalendarDate)
                    : myAppointments.filter(a => a.status !== 'completada');

                  if (filteredAppointments.length === 0) {
                    return (
                      <div className="bg-white rounded-2xl p-8 shadow-md text-center">
                        <p className="text-gray-500 text-sm">No hi ha cites per aquest dia</p>
                      </div>
                    );
                  }

                  return filteredAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      onClick={() => setSelectedAppointment(appointment.id)}
                      className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-[#E30613]"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-sm mb-1">{appointment.type}</h4>
                          <p className="text-xs text-gray-600">{appointment.location}</p>
                          <p className="text-xs text-gray-500">{appointment.address}</p>
                        </div>
                        <Badge className={`${
                          appointment.status === 'propera' 
                            ? 'bg-orange-100 text-orange-700 border-0'
                            : appointment.status === 'completada'
                            ? 'bg-gray-100 text-gray-700 border-0'
                            : 'bg-green-100 text-green-700 border-0'
                        }`}>
                          {appointment.status === 'propera' && '⏰ Propera'}
                          {appointment.status === 'confirmada' && '✓ Confirmada'}
                          {appointment.status === 'completada' && '✓ Completada'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {!selectedCalendarDate && '📅 '}
                          {!selectedCalendarDate && new Date(appointment.date).toLocaleDateString('ca-ES', { 
                            day: 'numeric', 
                            month: 'long' 
                          }) + ' · '}
                          {appointment.time}
                        </span>
                        {appointment.status === 'completada' ? (
                          <span className="text-green-600 text-xs">+{appointment.tokens} tokens</span>
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  ));
                })()}
              </div>

              {/* Historial section - only show when not filtering by date */}
              {!selectedCalendarDate && (
                <div className="mt-6">
                  <h3 className="text-sm mb-3">Historial</h3>
                  <div className="space-y-3">
                    {myAppointments.filter(a => a.status === 'completada').map((appointment) => (
                      <div
                        key={appointment.id}
                        onClick={() => setSelectedAppointment(appointment.id)}
                        className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer opacity-75"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-sm mb-1">{appointment.type}</h4>
                            <p className="text-xs text-gray-600">{appointment.location}</p>
                          </div>
                          <Badge className="bg-gray-100 text-gray-700 border-0">
                            ✓ Completada
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            📅 {new Date(appointment.date).toLocaleDateString('ca-ES', { 
                              day: 'numeric', 
                              month: 'long' 
                            })}
                          </span>
                          <span className="text-green-600 text-xs">+{appointment.tokens} tokens</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Appointment Detail View */}
      {activeView === 'myAppointments' && selectedAppointment && (
        <div className="flex-1 overflow-y-auto">
          {(() => {
            const appointment = myAppointments.find(a => a.id === selectedAppointment);
            if (!appointment) return null;

            return (
              <>
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-10">
                  <button onClick={() => setSelectedAppointment(null)} className="text-gray-600">
                    ← Tornar
                  </button>
                  <h3>Detalls de la cita</h3>
                </div>

                <div className="p-6 space-y-6">
                  <div className="bg-gradient-to-r from-[#E30613] to-[#FF4444] rounded-2xl p-6 text-white text-center">
                    <div className="text-5xl mb-3">🩸</div>
                    <h2 className="text-white mb-2">{appointment.type}</h2>
                    <p className="text-white/90">{appointment.location}</p>
                  </div>

                  <div className="bg-white rounded-2xl p-5 shadow-md space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Data i hora</p>
                      <p className="text-lg">
                        {new Date(appointment.date).toLocaleDateString('ca-ES', { 
                          weekday: 'long',
                          day: 'numeric', 
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-lg text-[#E30613]">{appointment.time}</p>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600 mb-1">Lloc</p>
                      <p className="text-lg">{appointment.location}</p>
                      <p className="text-sm text-gray-600">{appointment.address}</p>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-600 mb-1">Estat</p>
                      <Badge className={`${
                        appointment.status === 'propera' 
                          ? 'bg-orange-100 text-orange-700 border-0'
                          : appointment.status === 'completada'
                          ? 'bg-gray-100 text-gray-700 border-0'
                          : 'bg-green-100 text-green-700 border-0'
                      }`}>
                        {appointment.status === 'propera' && '⏰ Propera'}
                        {appointment.status === 'confirmada' && '✓ Confirmada'}
                        {appointment.status === 'completada' && '✓ Completada'}
                      </Badge>
                    </div>

                    {appointment.status === 'completada' && (
                      <div className="border-t pt-4">
                        <p className="text-sm text-gray-600 mb-1">Tokens guanyats</p>
                        <p className="text-2xl text-green-600">+{appointment.tokens} tokens</p>
                      </div>
                    )}
                  </div>

                  {appointment.status !== 'completada' && (
                    <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                      <h4 className="text-sm text-blue-900 mb-2">💡 Recorda</h4>
                      <ul className="text-xs text-blue-800 space-y-1">
                        <li>• Vine en dejú o amb esmorzar lleuger</li>
                        <li>• Porta el DNI o document identificatiu</li>
                        <li>• Arriba 10 minuts abans de la teva hora</li>
                      </ul>
                    </div>
                  )}

                  {appointment.status !== 'completada' && (
                    <Button 
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => setShowCancelDialog(true)}
                    >
                      Cancel·lar cita
                    </Button>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Request Appointment Flow */}
      {activeView === 'request' && (
        <>
          {/* Step 0: Map View with nearby points */}
          {requestStep === 'type' && (
            <div className="flex-1 flex flex-col">
              {/* Filters */}
              <div className="bg-white border-b border-gray-200 p-4">
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
              <div className="h-64 md:h-80 relative overflow-hidden">
                <InteractiveMap 
                  onPointClick={(pointId) => {
                    setSelectedPoint(pointId);
                    setRequestStep('selectType');
                  }}
                />
              </div>

              {/* Donation Points List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <p className="text-sm text-gray-600 mb-2">{donationPoints.length} punts propers a tu</p>
                
                {donationPoints.map((point) => (
                  <div
                    key={point.id}
                    onClick={() => {
                      setSelectedPoint(point.id);
                      setRequestStep('selectType');
                    }}
                    className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-[#E30613]"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm">{point.name}</h4>
                          {point.type === 'mobile' && (
                            <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">
                              🚐 Mòbil
                            </Badge>
                          )}
                        </div>
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
                      {point.types.map((type) => {
                        const typeData = donationTypes.find(t => t.id === type);
                        return (
                          <span key={type} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {typeData?.icon} {typeData?.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Select Donation Type (after selecting location) */}
          {requestStep === 'selectType' && (
            <div className="flex-1 overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-10">
                <button onClick={() => {
                  setRequestStep('type');
                  setSelectedPoint(null);
                }} className="text-gray-600">
                  ← Tornar
                </button>
                <div>
                  <h3 className="text-sm">Selecciona el tipus de donació</h3>
                  <p className="text-xs text-gray-500">{selectedPointData?.name}</p>
                </div>
              </div>

              <div className="p-6 space-y-3">
                {donationTypes
                  .filter(type => selectedPointData?.types.includes(type.id))
                  .map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setSelectedDonationType(type.id);
                        setRequestStep('date');
                      }}
                      className="w-full bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all text-left border-2 border-transparent hover:border-[#E30613]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{type.icon}</div>
                        <div className="flex-1">
                          <h4 className="mb-1">{type.name}</h4>
                          <p className="text-sm text-gray-600">Durada: {type.duration}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Guanyaràs</p>
                          <p className="text-lg text-[#E30613]">{type.tokens} tokens</p>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Date (previously location) */}
          {requestStep === 'date' && (
            <div className="flex-1 overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-10">
                <button onClick={() => setRequestStep('selectType')} className="text-gray-600">
                  ← Tornar
                </button>
                <div>
                  <h3 className="text-sm">Selecciona el dia</h3>
                  <p className="text-xs text-gray-500">{selectedTypeData?.name} - {selectedPointData?.name}</p>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-3">
                  {availableDates.map((dateOption) => (
                    <button
                      key={dateOption.date}
                      onClick={() => {
                        if (dateOption.available) {
                          setSelectedDate(dateOption.date);
                          setRequestStep('time');
                        }
                      }}
                      disabled={!dateOption.available}
                      className={`p-5 rounded-xl border-2 transition-all ${
                        dateOption.available
                          ? 'border-gray-200 hover:border-[#E30613] bg-white hover:bg-[#E30613]/5'
                          : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <p className={`text-sm mb-2 ${dateOption.available ? 'text-[#E30613]' : 'text-gray-400'}`}>
                        {dateOption.dayName}
                      </p>
                      <p className="text-2xl mb-1">
                        {new Date(dateOption.date).getDate()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(dateOption.date).toLocaleDateString('ca-ES', { month: 'short' })}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Select Time */}
          {requestStep === 'time' && (
            <div className="flex-1 overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-10">
                <button onClick={() => setRequestStep('date')} className="text-gray-600">
                  ← Tornar
                </button>
                <div>
                  <h3 className="text-sm">Selecciona l'hora</h3>
                  <p className="text-xs text-gray-500">
                    {selectedDateData?.dayName}, {selectedDate && new Date(selectedDate).getDate()}/{selectedDate && new Date(selectedDate).getMonth() + 1}
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => {
                        if (slot.available) {
                          setSelectedTime(slot.time);
                          setRequestStep('confirm');
                        }
                      }}
                      disabled={!slot.available}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        slot.available
                          ? 'border-gray-200 hover:border-[#E30613] bg-white hover:bg-[#E30613]/5'
                          : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <Clock className="w-4 h-4 mx-auto mb-2 text-gray-600" />
                      <p className="text-sm">{slot.time}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {requestStep === 'confirm' && (
            <div className="flex-1 overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-10">
                <button onClick={() => setRequestStep('time')} className="text-gray-600">
                  ← Tornar
                </button>
                <h3>Confirma la teva cita</h3>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-gradient-to-r from-[#E30613] to-[#FF4444] rounded-2xl p-6 text-white text-center">
                  <div className="text-5xl mb-3">{selectedTypeData?.icon}</div>
                  <h2 className="text-white mb-2">Resum de la cita</h2>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-md space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tipus de donació</p>
                    <p className="text-lg">{selectedTypeData?.name}</p>
                    <p className="text-sm text-gray-600">Durada: {selectedTypeData?.duration}</p>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-1">Data i hora</p>
                    <p className="text-lg">
                      {selectedDateData?.dayName}, {selectedDate && new Date(selectedDate).getDate()}/{selectedDate && new Date(selectedDate).getMonth() + 1}
                    </p>
                    <p className="text-lg text-[#E30613]">{selectedTime}</p>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-1">Lloc</p>
                    <p className="text-lg">{selectedPointData?.name}</p>
                    <p className="text-sm text-gray-600">{selectedPointData?.address}</p>
                  </div>

                  <div className="border-t pt-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                      <p className="text-sm text-green-800 mb-1">Guanyaràs</p>
                      <p className="text-2xl text-green-600">+{selectedTypeData?.tokens} tokens</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                  <h4 className="text-sm text-blue-900 mb-2">💡 Recorda</h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Vine en dejú o amb esmorzar lleuger</li>
                    <li>• Porta el DNI o document identificatiu</li>
                    <li>• Arriba 10 minuts abans de la teva hora</li>
                    <li>• T'enviarem un recordatori 24h abans</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleConfirmBooking}
                    className="w-full bg-[#E30613] hover:bg-[#C00510] text-white h-14"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Confirmar Cita
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setRequestStep('type');
                      setSelectedDonationType(null);
                      setSelectedPoint(null);
                      setSelectedDate(null);
                      setSelectedTime(null);
                    }}
                  >
                    Cancel·lar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Cancel Appointment Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel·lar cita de donació?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Estàs segur que vols cancel·lar aquesta cita? Aquesta acció no es pot desfer i hauràs de reservar una nova cita si vols donar sang.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="m-0">No, mantenir cita</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white m-0"
              onClick={() => {
                // Here you would handle the cancellation logic
                setShowCancelDialog(false);
                setSelectedAppointment(null);
                // Show success message or update appointment list
              }}
            >
              Sí, cancel·lar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}