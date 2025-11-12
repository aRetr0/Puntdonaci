import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Droplet, Mail, Lock, User, Phone, Calendar, Heart, Check, ChevronRight } from 'lucide-react';

type ViewType = 'welcome' | 'login' | 'signup' | 'signupStep2';

interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  birthDate: string;
  bloodType: string;
  gender: string;
  hasDonatedBefore: string;
}

interface LoginPageProps {
  onLogin: (email: string, userData?: any) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [view, setView] = useState<ViewType>('welcome');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState<SignupData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    birthDate: '',
    bloodType: '',
    gender: '',
    hasDonatedBefore: 'no'
  });
  const [errors, setErrors] = useState<string[]>([]);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'No ho sé'];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    if (!loginData.email || !loginData.password) {
      setErrors(['Si us plau, omple tots els camps']);
      return;
    }

    if (!loginData.email.includes('@')) {
      setErrors(['El correu electrònic no és vàlid']);
      return;
    }

    onLogin(loginData.email);
  };

  const handleSignupStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    const newErrors: string[] = [];

    if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      newErrors.push('Si us plau, omple tots els camps');
    }

    if (signupData.email && !signupData.email.includes('@')) {
      newErrors.push('El correu electrònic no és vàlid');
    }

    if (signupData.password && signupData.password.length < 6) {
      newErrors.push('La contrasenya ha de tenir almenys 6 caràcters');
    }

    if (signupData.password !== signupData.confirmPassword) {
      newErrors.push('Les contrasenyes no coincideixen');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setView('signupStep2');
  };

  const handleSignupStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    const newErrors: string[] = [];

    if (!signupData.phone || !signupData.birthDate || !signupData.bloodType || !signupData.gender) {
      newErrors.push('Si us plau, omple tots els camps');
    }

    if (signupData.birthDate) {
      const age = new Date().getFullYear() - new Date(signupData.birthDate).getFullYear();
      if (age < 18) {
        newErrors.push('Has de tenir almenys 18 anys');
      }
      if (age > 65) {
        newErrors.push('Has de tenir menys de 65 anys');
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    onLogin(signupData.email, {
      name: signupData.name,
      bloodType: signupData.bloodType,
      age: new Date().getFullYear() - new Date(signupData.birthDate).getFullYear(),
      phone: signupData.phone,
      gender: signupData.gender,
      hasDonatedBefore: signupData.hasDonatedBefore === 'yes'
    });
  };

  // Welcome Screen
  if (view === 'welcome') {
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-white to-gray-50 md:bg-transparent md:flex md:items-center md:justify-center w-full">
        {/* Mobile version */}
        <div className="md:hidden flex-1 flex flex-col items-center justify-center px-8 pb-20 max-w-md mx-auto w-full">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-[#E30613]/20 blur-3xl rounded-full" />
            <div className="relative w-32 h-32 bg-gradient-to-br from-[#E30613] to-[#FF4444] rounded-[2.5rem] flex items-center justify-center shadow-2xl">
              <Droplet className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-center mb-3">PuntDonació</h1>
          <p className="text-center text-gray-600 mb-12 max-w-xs">
            Dona sang, salva vides i guanya recompenses
          </p>

          <div className="w-full space-y-3">
            <Button
              onClick={() => setView('signup')}
              className="w-full h-14 bg-[#E30613] hover:bg-[#C00510] text-white rounded-2xl shadow-lg shadow-[#E30613]/25 transition-all"
            >
              Crear compte
            </Button>
            <Button
              onClick={() => setView('login')}
              variant="outline"
              className="w-full h-14 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-all"
            >
              Ja tinc compte
            </Button>
          </div>
        </div>

        {/* Desktop version */}
        <div className="hidden md:block w-full max-w-3xl mx-auto p-8">
          <div className="relative">
            {/* Red glow effect */}
            <div className="absolute inset-0 bg-[#E30613]/20 blur-[100px] rounded-full scale-110" />
            
            <div className="relative bg-white rounded-3xl shadow-2xl p-12">
              <div className="flex flex-col items-center">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-[#E30613]/20 blur-3xl rounded-full" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-[#E30613] to-[#FF4444] rounded-3xl flex items-center justify-center shadow-xl">
                    <Droplet className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                <h1 className="text-center mb-3">PuntDonació</h1>
                <p className="text-center text-gray-600 mb-10 max-w-xs">
                  Dona sang, salva vides i guanya recompenses
                </p>

                <div className="w-full space-y-3">
                  <Button
                    onClick={() => setView('signup')}
                    className="w-full h-14 bg-[#E30613] hover:bg-[#C00510] text-white rounded-2xl shadow-lg shadow-[#E30613]/25 transition-all"
                  >
                    Crear compte
                  </Button>
                  <Button
                    onClick={() => setView('login')}
                    variant="outline"
                    className="w-full h-14 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-all"
                  >
                    Ja tinc compte
                  </Button>
                </div>

                <p className="text-xs text-center text-gray-500 mt-8">
                  Banc de Sang i Teixits de Catalunya
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login Screen
  if (view === 'login') {
    return (
      <div className="h-full flex flex-col bg-white md:bg-transparent md:items-center md:justify-center w-full">
        {/* Mobile version */}
        <div className="md:hidden p-6">
          <button
            onClick={() => setView('welcome')}
            className="text-[#E30613] text-sm flex items-center gap-1"
          >
            ← Enrere
          </button>
        </div>

        <div className="md:hidden flex-1 px-8 pt-4">
          <div className="mb-10">
            <h2 className="mb-2">Benvingut/da</h2>
            <p className="text-gray-600">Inicia sessió per continuar</p>
          </div>

          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-red-600">• {error}</p>
              ))}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label htmlFor="login-email" className="text-sm text-gray-700 mb-2 block">
                Correu electrònic
              </Label>
              <Input
                id="login-email"
                type="email"
                placeholder="nom@correu.com"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="h-14 rounded-xl border-gray-200 focus:border-[#E30613] focus:ring-[#E30613]"
              />
            </div>

            <div>
              <Label htmlFor="login-password" className="text-sm text-gray-700 mb-2 block">
                Contrasenya
              </Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="h-14 rounded-xl border-gray-200 focus:border-[#E30613] focus:ring-[#E30613]"
              />
            </div>

            <button type="button" className="text-sm text-[#E30613]">
              Has oblidat la contrasenya?
            </button>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-14 bg-[#E30613] hover:bg-[#C00510] text-white rounded-2xl shadow-lg shadow-[#E30613]/20"
              >
                Iniciar sessió
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600 pt-4">
              No tens compte?{' '}
              <button
                type="button"
                onClick={() => setView('signup')}
                className="text-[#E30613]"
              >
                Registra't
              </button>
            </p>
          </form>
        </div>

        {/* Desktop version */}
        <div className="hidden md:block w-full max-w-3xl mx-auto p-8">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <button
              onClick={() => setView('welcome')}
              className="text-[#E30613] text-sm flex items-center gap-1 mb-8"
            >
              ← Enrere
            </button>

            <div className="mb-10">
              <h2 className="mb-2">Benvingut/da</h2>
              <p className="text-gray-600">Inicia sessió per continuar</p>
            </div>

            {errors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
                {errors.map((error, index) => (
                  <p key={index} className="text-sm text-red-600">• {error}</p>
                ))}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <Label htmlFor="login-email-desktop" className="text-sm text-gray-700 mb-2 block">
                  Correu electrònic
                </Label>
                <Input
                  id="login-email-desktop"
                  type="email"
                  placeholder="nom@correu.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="h-14 rounded-xl border-gray-200 focus:border-[#E30613] focus:ring-[#E30613]"
                />
              </div>

              <div>
                <Label htmlFor="login-password-desktop" className="text-sm text-gray-700 mb-2 block">
                  Contrasenya
                </Label>
                <Input
                  id="login-password-desktop"
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="h-14 rounded-xl border-gray-200 focus:border-[#E30613] focus:ring-[#E30613]"
                />
              </div>

              <button type="button" className="text-sm text-[#E30613]">
                Has oblidat la contrasenya?
              </button>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-14 bg-[#E30613] hover:bg-[#C00510] text-white rounded-2xl shadow-lg shadow-[#E30613]/20"
                >
                  Iniciar sessió
                </Button>
              </div>

              <p className="text-center text-sm text-gray-600 pt-4">
                No tens compte?{' '}
                <button
                  type="button"
                  onClick={() => setView('signup')}
                  className="text-[#E30613]"
                >
                  Registra't
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Signup Step 1
  if (view === 'signup') {
    return (
      <div className="h-full flex flex-col bg-white overflow-y-auto md:bg-transparent md:items-center md:justify-center md:overflow-hidden w-full">
        {/* Mobile version */}
        <div className="md:hidden sticky top-0 bg-white/95 backdrop-blur-lg border-b border-gray-100 p-6 z-10">
          <button
            onClick={() => setView('welcome')}
            className="text-[#E30613] text-sm flex items-center gap-1"
          >
            ← Enrere
          </button>
        </div>

        <div className="md:hidden flex-1 px-8 pt-6 pb-8">
          <div className="mb-8">
            <h2 className="mb-2">Crea el teu compte</h2>
            <p className="text-gray-600">Pas 1 de 2: Dades bàsiques</p>
          </div>

          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-red-600">• {error}</p>
              ))}
            </div>
          )}

          <form onSubmit={handleSignupStep1} className="space-y-5">
            <div>
              <Label htmlFor="signup-name" className="text-sm text-gray-700 mb-2 block">
                Nom complet
              </Label>
              <Input
                id="signup-name"
                type="text"
                placeholder="Joan Garcia Martí"
                value={signupData.name}
                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                className="h-14 rounded-xl border-gray-200 focus:border-[#E30613] focus:ring-[#E30613]"
              />
            </div>

            <div>
              <Label htmlFor="signup-email" className="text-sm text-gray-700 mb-2 block">
                Correu electrònic
              </Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="nom@correu.com"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                className="h-14 rounded-xl border-gray-200 focus:border-[#E30613] focus:ring-[#E30613]"
              />
            </div>

            <div>
              <Label htmlFor="signup-password" className="text-sm text-gray-700 mb-2 block">
                Contrasenya
              </Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="Mínim 6 caràcters"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                className="h-14 rounded-xl border-gray-200 focus:border-[#E30613] focus:ring-[#E30613]"
              />
            </div>

            <div>
              <Label htmlFor="signup-confirm" className="text-sm text-gray-700 mb-2 block">
                Confirma la contrasenya
              </Label>
              <Input
                id="signup-confirm"
                type="password"
                placeholder="Repeteix la contrasenya"
                value={signupData.confirmPassword}
                onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                className="h-14 rounded-xl border-gray-200 focus:border-[#E30613] focus:ring-[#E30613]"
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-14 bg-[#E30613] hover:bg-[#C00510] text-white rounded-2xl shadow-lg shadow-[#E30613]/20 flex items-center justify-center gap-2"
              >
                Continuar
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600 pt-4">
              Ja tens compte?{' '}
              <button
                type="button"
                onClick={() => setView('login')}
                className="text-[#E30613]"
              >
                Inicia sessió
              </button>
            </p>
          </form>
        </div>

        {/* Desktop version */}
        <div className="hidden md:block w-full max-w-3xl mx-auto p-8 md:max-h-screen md:overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <button
              onClick={() => setView('welcome')}
              className="text-[#E30613] text-sm flex items-center gap-1 mb-8"
            >
              ← Enrere
            </button>

            <div className="mb-8">
              <h2 className="mb-2">Crea el teu compte</h2>
              <p className="text-gray-600">Pas 1 de 2: Dades bàsiques</p>
            </div>

            {errors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
                {errors.map((error, index) => (
                  <p key={index} className="text-sm text-red-600">• {error}</p>
                ))}
              </div>
            )}

            <form onSubmit={handleSignupStep1} className="space-y-5">
              <div>
                <Label htmlFor="signup-name-desktop" className="text-sm text-gray-700 mb-2 block">
                  Nom complet
                </Label>
                <Input
                  id="signup-name-desktop"
                  type="text"
                  placeholder="Joan Garcia Martí"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  className="h-14 rounded-xl border-gray-200 focus:border-[#E30613] focus:ring-[#E30613]"
                />
              </div>

              <div>
                <Label htmlFor="signup-email-desktop" className="text-sm text-gray-700 mb-2 block">
                  Correu electrònic
                </Label>
                <Input
                  id="signup-email-desktop"
                  type="email"
                  placeholder="nom@correu.com"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  className="h-14 rounded-xl border-gray-200 focus:border-[#E30613] focus:ring-[#E30613]"
                />
              </div>

              <div>
                <Label htmlFor="signup-password-desktop" className="text-sm text-gray-700 mb-2 block">
                  Contrasenya
                </Label>
                <Input
                  id="signup-password-desktop"
                  type="password"
                  placeholder="Mínim 6 caràcters"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  className="h-14 rounded-xl border-gray-200 focus:border-[#E30613] focus:ring-[#E30613]"
                />
              </div>

              <div>
                <Label htmlFor="signup-confirm-desktop" className="text-sm text-gray-700 mb-2 block">
                  Confirma la contrasenya
                </Label>
                <Input
                  id="signup-confirm-desktop"
                  type="password"
                  placeholder="Repeteix la contrasenya"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  className="h-14 rounded-xl border-gray-200 focus:border-[#E30613] focus:ring-[#E30613]"
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-14 bg-[#E30613] hover:bg-[#C00510] text-white rounded-2xl shadow-lg shadow-[#E30613]/20 flex items-center justify-center gap-2"
                >
                  Continuar
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              <p className="text-center text-sm text-gray-600 pt-4">
                Ja tens compte?{' '}
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="text-[#E30613]"
                >
                  Inicia sessió
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Signup Step 2
  if (view === 'signupStep2') {
    return (
      <div className="h-full flex flex-col bg-white overflow-y-auto md:bg-transparent md:items-center md:justify-center md:overflow-hidden w-full">
        {/* Mobile version */}
        <div className="md:hidden sticky top-0 bg-white/95 backdrop-blur-lg border-b border-gray-100 p-6 z-10">
          <button
            onClick={() => setView('signup')}
            className="text-[#E30613] text-sm flex items-center gap-1"
          >
            ← Enrere
          </button>
        </div>

        <div className="md:hidden flex-1 px-8 pt-6 pb-8">
          <div className="mb-8">
            <h2 className="mb-2">Informació mèdica</h2>
            <p className="text-gray-600">Pas 2 de 2: Gairebé fet!</p>
          </div>

          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-red-600">• {error}</p>
              ))}
            </div>
          )}

          <form onSubmit={handleSignupStep2} className="space-y-5">
            <div>
              <Label htmlFor="signup-phone" className="text-sm text-gray-700 mb-2 block">
                Telèfon
              </Label>
              <Input
                id="signup-phone"
                type="tel"
                placeholder="600 123 456"
                value={signupData.phone}
                onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                className="h-14 rounded-xl border-gray-200 focus:border-[#E30613] focus:ring-[#E30613]"
              />
            </div>

            <div>
              <Label htmlFor="signup-birthdate" className="text-sm text-gray-700 mb-2 block">
                Data de naixement
              </Label>
              <Input
                id="signup-birthdate"
                type="date"
                value={signupData.birthDate}
                onChange={(e) => setSignupData({ ...signupData, birthDate: e.target.value })}
                className="h-14 rounded-xl border-gray-200 focus:border-[#E30613] focus:ring-[#E30613]"
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
              />
              <p className="text-xs text-gray-500 mt-2">Has de tenir entre 18 i 65 anys</p>
            </div>

            <div>
              <Label className="text-sm text-gray-700 mb-3 block">
                Gènere
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {['Home', 'Dona', 'Altre', 'Prefereixo no dir-ho'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSignupData({ ...signupData, gender: option.toLowerCase() })}
                    className={`px-4 py-4 rounded-xl border-2 transition-all text-sm ${
                      signupData.gender === option.toLowerCase()
                        ? 'border-[#E30613] bg-[#E30613]/5 text-[#E30613]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm text-gray-700 mb-3 block">
                Grup sanguini
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {bloodTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSignupData({ ...signupData, bloodType: type })}
                    className={`px-3 py-3 rounded-xl border-2 transition-all ${
                      signupData.bloodType === type
                        ? 'border-[#E30613] bg-[#E30613]/5 text-[#E30613]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm text-gray-700 mb-3 block">
                Has donat sang abans?
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSignupData({ ...signupData, hasDonatedBefore: 'yes' })}
                  className={`px-4 py-4 rounded-xl border-2 transition-all ${
                    signupData.hasDonatedBefore === 'yes'
                      ? 'border-[#E30613] bg-[#E30613]/5 text-[#E30613]'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  Sí
                </button>
                <button
                  type="button"
                  onClick={() => setSignupData({ ...signupData, hasDonatedBefore: 'no' })}
                  className={`px-4 py-4 rounded-xl border-2 transition-all ${
                    signupData.hasDonatedBefore === 'no'
                      ? 'border-[#E30613] bg-[#E30613]/5 text-[#E30613]'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <p className="text-xs text-blue-800">
                Al crear un compte, acceptes els{' '}
                <button type="button" className="underline">termes i condicions</button>
                {' '}i la{' '}
                <button type="button" className="underline">política de privacitat</button>.
              </p>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-14 bg-[#E30613] hover:bg-[#C00510] text-white rounded-2xl shadow-lg shadow-[#E30613]/20 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Crear compte
              </Button>
            </div>
          </form>
        </div>

        {/* Desktop version */}
        <div className="hidden md:block w-full max-w-3xl mx-auto p-8 md:max-h-screen md:overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <button
              onClick={() => setView('welcome')}
              className="text-[#E30613] text-sm flex items-center gap-1 mb-8"
            >
              ← Enrere
            </button>

            <div className="mb-8">
              <h2 className="mb-2">Informació mèdica</h2>
              <p className="text-gray-600">Pas 2 de 2: Gairebé fet!</p>
            </div>

            {errors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
                {errors.map((error, index) => (
                  <p key={index} className="text-sm text-red-600">• {error}</p>
                ))}
              </div>
            )}

            <form onSubmit={handleSignupStep2} className="space-y-5">
              <div>
                <Label htmlFor="signup-phone-desktop" className="text-sm text-gray-700 mb-2 block">
                  Telèfon
                </Label>
                <Input
                  id="signup-phone-desktop"
                  type="tel"
                  placeholder="600 123 456"
                  value={signupData.phone}
                  onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                  className="h-14 rounded-xl border-gray-200 focus:border-[#E30613] focus:ring-[#E30613]"
                />
              </div>

              <div>
                <Label htmlFor="signup-birthdate-desktop" className="text-sm text-gray-700 mb-2 block">
                  Data de naixement
                </Label>
                <Input
                  id="signup-birthdate-desktop"
                  type="date"
                  value={signupData.birthDate}
                  onChange={(e) => setSignupData({ ...signupData, birthDate: e.target.value })}
                  className="h-14 rounded-xl border-gray-200 focus:border-[#E30613] focus:ring-[#E30613]"
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                />
                <p className="text-xs text-gray-500 mt-2">Has de tenir entre 18 i 65 anys</p>
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-3 block">
                  Gènere
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {['Home', 'Dona', 'Altre', 'Prefereixo no dir-ho'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSignupData({ ...signupData, gender: option.toLowerCase() })}
                      className={`px-4 py-4 rounded-xl border-2 transition-all text-sm ${
                        signupData.gender === option.toLowerCase()
                          ? 'border-[#E30613] bg-[#E30613]/5 text-[#E30613]'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-3 block">
                  Grup sanguini
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {bloodTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSignupData({ ...signupData, bloodType: type })}
                      className={`px-3 py-3 rounded-xl border-2 transition-all ${
                        signupData.bloodType === type
                          ? 'border-[#E30613] bg-[#E30613]/5 text-[#E30613]'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-700 mb-3 block">
                  Has donat sang abans?
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSignupData({ ...signupData, hasDonatedBefore: 'yes' })}
                    className={`px-4 py-4 rounded-xl border-2 transition-all ${
                      signupData.hasDonatedBefore === 'yes'
                        ? 'border-[#E30613] bg-[#E30613]/5 text-[#E30613]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    Sí
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupData({ ...signupData, hasDonatedBefore: 'no' })}
                    className={`px-4 py-4 rounded-xl border-2 transition-all ${
                      signupData.hasDonatedBefore === 'no'
                        ? 'border-[#E30613] bg-[#E30613]/5 text-[#E30613]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                <p className="text-xs text-blue-800">
                  Al crear un compte, acceptes els{' '}
                  <button type="button" className="underline">termes i condicions</button>
                  {' '}i la{' '}
                  <button type="button" className="underline">política de privacitat</button>.
                </p>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-14 bg-[#E30613] hover:bg-[#C00510] text-white rounded-2xl shadow-lg shadow-[#E30613]/20 flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Crear compte
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return null;
}