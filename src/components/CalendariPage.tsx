import { useState } from 'react';
import { MapPin, Clock, Navigation, ChevronRight, Check, Loader2, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { InteractiveMap } from './InteractiveMap';
import { toast } from 'sonner';
import {
  useDonationCenters,
  useAppointments,
  useCreateAppointment,
  useCancelAppointment,
} from '@/hooks';
import { DonationType, DonationCenter, AppointmentWithDetails } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { calculateDistance, formatDistance } from '@/components/ui/utils';

type ViewType = 'request' | 'myAppointments';
type RequestStep = 'location' | 'type' | 'date' | 'time' | 'confirm';

export function CalendariPage() {
  // API hooks
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  
  const { data: allCenters = [], isLoading: loadingCenters } = useDonationCenters();
  const { data: appointmentsResponse, isLoading: loadingAppointments } = useAppointments();
  const createAppointment = useCreateAppointment();
  const cancelAppointment = useCancelAppointment();

  // State
  const [activeView, setActiveView] = useState<ViewType>('request');
  const [requestStep, setRequestStep] = useState<RequestStep>('location');
  const [filterType, setFilterType] = useState<'all' | 'fix' | 'mobile'>('all');

  const [selectedDonationType, setSelectedDonationType] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Process centers: Filter and Sort
  const filteredCenters = allCenters.filter((center: DonationCenter) => {
    if (filterType === 'all') return true;
    return center.type === filterType;
  });

  const sortedCenters = userLocation 
    ? [...filteredCenters].sort((a, b) => {
        const distA = calculateDistance(userLocation[1], userLocation[0], a.coordinates.lat, a.coordinates.lng);
        const distB = calculateDistance(userLocation[1], userLocation[0], b.coordinates.lat, b.coordinates.lng);
        return distA - distB;
      })
    : filteredCenters;

  const donationCenters = sortedCenters;
  const myAppointments = appointmentsResponse || [];

  const donationTypes = [
    { id: 'sang_total', name: 'Sang Total', icon: '🩸', duration: '30-45 min', tokens: 15 },
    { id: 'plaquetes', name: 'Plaquetes', icon: '💉', duration: '90 min', tokens: 20 },
    { id: 'plasma', name: 'Plasma', icon: '💧', duration: '60 min', tokens: 18 },
  ];

  // Generate available dates (next 14 days, excluding weekends)
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const dayNames = ['Diumenge', 'Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte'];
    return {
      date: date.toISOString().split('T')[0],
      label: i === 0 ? 'Demà' : dayNames[dayOfWeek],
      dayName: dayNames[dayOfWeek],
      available: !isWeekend
    };
  });

  // Generate time slots (9:00 - 17:00 every 30 min)
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = (i % 2) * 30;
    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    return { time, available: true };
  });

  const handleConfirmBooking = async () => {
    if (!selectedPoint || !selectedDate || !selectedTime || !selectedDonationType) {
      toast.error('Si us plau, completa tots els camps');
      return;
    }

    try {
      await createAppointment.mutateAsync({
        donationCenterId: selectedPoint,
        date: selectedDate,
        time: selectedTime,
        donationType: selectedDonationType as DonationType,
      });
      setBookingConfirmed(true);
      toast.success('Cita confirmada correctament!');
    } catch (error) {
      const message = (error as { error?: string })?.error || 'Error al confirmar la cita';
      toast.error(message);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await cancelAppointment.mutateAsync(appointmentId);
      setShowCancelDialog(false);
      setSelectedAppointment(null);
      toast.success('Cita cancel·lada correctament');
    } catch (error) {
      const message = (error as { error?: string })?.error || 'Error al cancel·lar la cita';
      toast.error(message);
    }
  };

  const selectedPointData = donationCenters.find((p: DonationCenter) => (p._id || p.id) === selectedPoint);
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
                  setRequestStep('location');
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
                  setRequestStep('location');
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
              setRequestStep('location');
            }}
            className={`flex-1 h-12 ${activeView === 'request'
              ? 'bg-[#E30613] text-white hover:bg-[#C00510]'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            Demanar cita
          </Button>
          <Button
            onClick={() => setActiveView('myAppointments')}
            className={`flex-1 h-12 ${activeView === 'myAppointments'
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
                  myAppointments.forEach((a: AppointmentWithDetails) => {
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
                        className={`aspect-square flex items-center justify-center rounded-lg text-sm relative transition-all ${isSelected
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
                {loadingAppointments ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-[#E30613]" />
                  </div>
                ) : (() => {
                  const filteredAppointments = selectedCalendarDate
                    ? myAppointments.filter((a: AppointmentWithDetails) => a.date === selectedCalendarDate)
                    : myAppointments.filter((a: AppointmentWithDetails) => a.status !== 'completed');

                  if (filteredAppointments.length === 0) {
                    return (
                      <div className="bg-white rounded-2xl p-8 shadow-md text-center">
                        <p className="text-gray-500 text-sm">No hi ha cites per aquest dia</p>
                      </div>
                    );
                  }

                  return filteredAppointments.map((appointment: AppointmentWithDetails) => {
                    const typeData = donationTypes.find(t => t.id === appointment.donationType);
                    const center = donationCenters.find((c: DonationCenter) => (c._id || c.id) === appointment.donationCenterId);

                    return (
                      <div
                        key={appointment.id}
                        onClick={() => setSelectedAppointment(appointment.id)}
                        className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-[#E30613]"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-sm mb-1">{typeData?.name || appointment.donationType}</h4>
                            <p className="text-xs text-gray-600">{center?.name || 'Centre de donació'}</p>
                            <p className="text-xs text-gray-500">{center?.address || ''}</p>
                          </div>
                          <Badge className={`${appointment.status === 'scheduled'
                            ? 'bg-green-100 text-green-700 border-0'
                            : appointment.status === 'completed'
                              ? 'bg-gray-100 text-gray-700 border-0'
                              : 'bg-orange-100 text-orange-700 border-0'
                            }`}>
                            {appointment.status === 'scheduled' && '✓ Confirmada'}
                            {appointment.status === 'completed' && '✓ Completada'}
                            {appointment.status === 'cancelled' && '✗ Cancel·lada'}
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
                          {appointment.status === 'completed' ? (
                            <span className="text-green-600 text-xs">+{typeData?.tokens || 15} tokens</span>
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Historial section - only show when not filtering by date */}
              {!selectedCalendarDate && (
                <div className="mt-6">
                  <h3 className="text-sm mb-3">Historial</h3>
                  <div className="space-y-3">
                    {myAppointments.filter((a: AppointmentWithDetails) => a.status === 'completed').map((appointment: AppointmentWithDetails) => {
                      const typeData = donationTypes.find(t => t.id === appointment.donationType);
                      const center = donationCenters.find((c: DonationCenter) => (c._id || c.id) === appointment.donationCenterId);

                      return (
                        <div
                          key={appointment.id}
                          onClick={() => setSelectedAppointment(appointment.id)}
                          className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer opacity-75"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="text-sm mb-1">{typeData?.name || appointment.donationType}</h4>
                              <p className="text-xs text-gray-600">{center?.name || 'Centre de donació'}</p>
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
                            <span className="text-green-600 text-xs">+{typeData?.tokens || 0} tokens</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Request Appointment Flow */}
      {activeView === 'request' && (
        <>
          {/* Step 0: Map View with nearby points */}
          {requestStep === 'location' && (
            <div className="flex-1 flex flex-col">
              {/* Filters */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="flex-1">
                        <Filter className="w-4 h-4 mr-2" />
                        {filterType === 'all' ? 'Tots els punts' : filterType === 'fix' ? 'Només Hospitals' : 'Unitats Mòbils'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setFilterType('all')}>
                        Tots els punts
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType('fix')}>
                        Només Hospitals
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType('mobile')}>
                        Unitats Mòbils
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Map Preview */}
              <div className="h-64 md:h-80 relative overflow-hidden">
                <InteractiveMap
                  centers={donationCenters}
                  onUserLocationChange={setUserLocation}
                  onPointClick={(pointId) => {
                    setSelectedPoint(String(pointId));
                    setRequestStep('type');
                  }}
                />
              </div>

              {/* Donation Points List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loadingCenters ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-[#E30613]" />
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-2">
                      {donationCenters.length} {userLocation ? 'punts trobats prop de tu' : 'punts disponibles'}
                    </p>

                    {donationCenters.slice(0, 20).map((center: DonationCenter) => {
                      // Calculate distance if user location is available
                      let distanceStr = '';
                      if (userLocation) {
                        const dist = calculateDistance(
                          userLocation[1], 
                          userLocation[0], 
                          center.coordinates.lat, 
                          center.coordinates.lng
                        );
                        distanceStr = formatDistance(dist);
                      }

                      return (
                        <div
                          key={center._id || center.id}
                          onClick={() => {
                            setSelectedPoint(center._id || center.id || '');
                            setRequestStep('type');
                          }}
                          className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-[#E30613]"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-medium">{center.name}</h4>
                                {center.type === 'mobile' && (
                                  <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">
                                    🚐 Mòbil
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 flex items-center gap-1 mb-2">
                                <MapPin className="w-3 h-3" />
                                {center.address}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                              {distanceStr && (
                                <span className="text-xs font-medium text-[#E30613]">{distanceStr}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className="text-xs">
                              📍 {center.city}
                            </Badge>
                            {center.openNow ? (
                              <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                                Obert ara
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                Tancat
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {donationTypes.map((type) => (
                              <span key={type.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {type.icon} {type.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    {donationCenters.length > 20 && (
                      <p className="text-center text-xs text-gray-500 pt-2">
                        Mostrant els 20 resultats més propers
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 1: Select Donation Type (after selecting location) */}
          {requestStep === 'type' && (
            <div className="flex-1 overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-10">
                <button onClick={() => {
                  setRequestStep('location');
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
                  // .filter(type => selectedPointData?.types.includes(type.id)) // Assuming types property exists on DonationCenter, but it's not in the interface. Removing filter for now or need to check interface.
                  // The interface DonationCenter does NOT have 'types'. It has 'facilities'.
                  // I'll remove the filter for now to avoid errors, or assume all types are available.
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
                <button onClick={() => setRequestStep('type')} className="text-gray-600">
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
                        if (dateOption.available && dateOption.date) {
                          setSelectedDate(dateOption.date);
                          setRequestStep('time');
                        }
                      }}
                      disabled={!dateOption.available}
                      className={`p-5 rounded-xl border-2 transition-all ${dateOption.available
                        ? 'border-gray-200 hover:border-[#E30613] bg-white hover:bg-[#E30613]/5'
                        : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                        }`}
                    >
                      <p className={`text-sm mb-2 ${dateOption.available ? 'text-[#E30613]' : 'text-gray-400'}`}>
                        {dateOption.dayName}
                      </p>
                      <p className="text-2xl mb-1">
                        {dateOption.date ? new Date(dateOption.date).getDate() : ''}
                      </p>
                      <p className="text-xs text-gray-500">
                        {dateOption.date ? new Date(dateOption.date).toLocaleDateString('ca-ES', { month: 'short' }) : ''}
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
                      className={`p-4 rounded-xl border-2 transition-all ${slot.available
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

                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <h4 className="text-sm text-blue-900 mb-2">💡 Recorda</h4>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Vine en dejú o amb esmorzar lleuger</li>
                      <li>• Porta el DNI o document identificatiu</li>
                      <li>• Beu molta aigua abans de venir</li>
                    </ul>
                  </div>

                  <Button
                    className="w-full bg-[#E30613] hover:bg-[#C00510] text-white h-12 rounded-xl text-lg"
                    onClick={handleConfirmBooking}
                    disabled={createAppointment.isPending}
                  >
                    {createAppointment.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Confirmant...
                      </>
                    ) : (
                      'Confirmar Cita'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Estàs segur?</AlertDialogTitle>
            <AlertDialogDescription>
              Aquesta acció no es pot desfer. La teva cita quedarà cancel·lada i hauràs de demanar-ne una de nova.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Enrere</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => selectedAppointment && handleCancelAppointment(selectedAppointment)}
            >
              Sí, cancel·lar cita
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}