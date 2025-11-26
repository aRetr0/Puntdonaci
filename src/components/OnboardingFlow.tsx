import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet, Trophy, Calendar, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { useAuthStore } from '@/stores/authStore';

export function OnboardingFlow() {
  const navigate = useNavigate();
  const { completeOnboarding } = useAuthStore();
  const [step, setStep] = useState(0);

  const handleComplete = () => {
    completeOnboarding();
    navigate('/app/home');
  };

  const screens = [
    {
      icon: Droplet,
      title: 'Benvingut a PuntDonació',
      description: 'La nova forma de donar sang i salvar vides. Cada donació pot salvar fins a 3 persones.',
      color: '#E30613'
    },
    {
      icon: Trophy,
      title: 'Guanya Recompenses',
      description: 'Acumula tokens amb cada donació i bescanvia\'ls per entrades a festivals, descomptes i experiències exclusives.',
      color: '#E30613'
    },
    {
      icon: Calendar,
      title: 'Reserva Fàcilment',
      description: 'Troba el punt de donació més proper i reserva la teva cita en menys de 30 segons.',
      color: '#E30613'
    }
  ];

  const currentScreen = screens[step] ?? screens[0]!;
  const Icon = currentScreen.icon;

  return (
    <div className="h-screen flex flex-col bg-white md:bg-white md:items-center md:justify-center">
      {/* Status Bar - Only on mobile */}
      <div className="h-11 bg-white flex items-center justify-between px-6 pt-2 md:hidden">
        <span className="text-xs">9:41</span>
        <div className="flex gap-1 items-center">
          <div className="w-4 h-3 border border-black rounded-sm" />
        </div>
      </div>

      {/* Mobile version */}
      <div className="md:hidden flex-1 flex flex-col items-center justify-center p-8 pb-24 bg-white w-full">
        {/* Icon */}
        <div 
          className="w-32 h-32 rounded-full flex items-center justify-center mb-8"
          style={{ backgroundColor: `${currentScreen.color}15` }}
        >
          <Icon className="w-16 h-16" style={{ color: currentScreen.color }} />
        </div>

        {/* Title */}
        <h1 className="text-center mb-4" style={{ color: currentScreen.color }}>
          {currentScreen.title}
        </h1>

        {/* Description */}
        <p className="text-center text-gray-600 mb-12 max-w-sm">
          {currentScreen.description}
        </p>

        {/* Progress Dots */}
        <div className="flex gap-2 mb-12">
          {screens.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                backgroundColor: index === step ? currentScreen.color : '#E5E7EB',
                width: index === step ? '24px' : '8px'
              }}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="w-full space-y-3">
          {step < screens.length - 1 ? (
            <>
              <Button
                onClick={() => setStep(step + 1)}
                className="w-full bg-[#E30613] hover:bg-[#C00510] text-white h-14"
              >
                Continuar
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={handleComplete}
                variant="ghost"
                className="w-full text-gray-600"
              >
                Saltar
              </Button>
            </>
          ) : (
            <Button
              onClick={handleComplete}
              className="w-full bg-[#E30613] hover:bg-[#C00510] text-white h-14"
            >
              Començar
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Desktop version */}
      <div className="hidden md:flex md:flex-col md:items-center md:justify-center md:p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-lg">
          <div className="flex flex-col items-center">
            {/* Icon */}
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center mb-8"
              style={{ backgroundColor: `${currentScreen.color}15` }}
            >
              <Icon className="w-16 h-16" style={{ color: currentScreen.color }} />
            </div>

            {/* Title */}
            <h1 className="text-center mb-4" style={{ color: currentScreen.color }}>
              {currentScreen.title}
            </h1>

            {/* Description */}
            <p className="text-center text-gray-600 mb-12 max-w-md">
              {currentScreen.description}
            </p>

            {/* Progress Dots */}
            <div className="flex gap-2 mb-12">
              {screens.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{
                    backgroundColor: index === step ? currentScreen.color : '#E5E7EB',
                    width: index === step ? '24px' : '8px'
                  }}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="w-full space-y-3">
              {step < screens.length - 1 ? (
                <>
                  <Button
                    onClick={() => setStep(step + 1)}
                    className="w-full bg-[#E30613] hover:bg-[#C00510] text-white h-14"
                  >
                    Continuar
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    onClick={handleComplete}
                    variant="ghost"
                    className="w-full text-gray-600"
                  >
                    Saltar
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleComplete}
                  className="w-full bg-[#E30613] hover:bg-[#C00510] text-white h-14"
                >
                  Començar
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}