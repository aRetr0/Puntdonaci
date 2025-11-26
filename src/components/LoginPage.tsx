import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Droplet, Mail, Lock, User, Phone, Calendar, Heart, Check, ChevronRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

type ViewType = 'welcome' | 'login' | 'signup' | 'signupStep2';

interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  birthdate: string;
  bloodType: string;
  gender: string;
  hasDonatedBefore: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuthStore();
  const [view, setView] = useState<ViewType>('welcome');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState<SignupData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    birthdate: '',
    bloodType: '',
    gender: '',
    hasDonatedBefore: 'no'
  });
  const [errors, setErrors] = useState<string[]>([]);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'No ho sé'];

  const handleLogin = async (e: React.FormEvent) => {
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

    try {
      await login(loginData.email, loginData.password);
      toast.success('Benvingut de nou!');
      navigate('/onboarding');
    } catch (error: any) {
      const message = error?.error || 'Error al iniciar sessió';
      setErrors([message]);
      toast.error(message);
    }
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

  const handleSignupStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    const newErrors: string[] = [];

    if (!signupData.phone || !signupData.birthdate || !signupData.bloodType || !signupData.gender) {
      newErrors.push('Si us plau, omple tots els camps');
    }

    if (signupData.birthdate) {
      const age = new Date().getFullYear() - new Date(signupData.birthdate).getFullYear();
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

    try {
      await register({
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        phone: signupData.phone,
        birthdate: signupData.birthdate,
        gender: signupData.gender as 'home' | 'dona' | 'altre' | 'no-especificar',
        bloodType: signupData.bloodType as any,
        hasDonatedBefore: signupData.hasDonatedBefore === 'yes'
      });
      toast.success('Compte creat correctament!');
      navigate('/onboarding');
    } catch (error: any) {
      const message = error?.error || 'Error al crear el compte';
      setErrors([message]);
      toast.error(message);
    }
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
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="h-full flex flex-col bg-white md:bg-transparent md:flex md:items-center md:justify-center w-full"
        >
          {/* Mobile version */}
          <div className="md:hidden flex-1 flex flex-col px-8 py-12 max-w-md mx-auto w-full">
            <button
              onClick={() => setView('welcome')}
              className="self-start mb-8 text-gray-600 hover:text-gray-900"
            >
              ← Enrere
            </button>

            <h2 className="mb-2">Benvingut de nou</h2>
            <p className="text-gray-600 mb-8">Inicia sessió per continuar</p>

            <form onSubmit={handleLogin} className="flex-1 flex flex-col">
              <div className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="email">Correu electrònic</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nom@exemple.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      className="pl-12 h-14 rounded-2xl border-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Contrasenya</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      className="pl-12 h-14 rounded-2xl border-2"
                    />
                  </div>
                </div>
              </div>

              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  {errors.map((error, i) => (
                    <p key={i} className="text-sm text-red-600">{error}</p>
                  ))}
                </div>
              )}

              <div className="mt-auto">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-[#E30613] hover:bg-[#C00510] text-white rounded-2xl shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Iniciant sessió...
                    </>
                  ) : (
                    'Iniciar sessió'
                  )}
                </Button>

                <p className="text-center text-sm text-gray-600 mt-4">
                  No tens compte?{' '}
                  <button
                    type="button"
                    onClick={() => setView('signup')}
                    className="text-[#E30613] font-medium"
                  >
                    Registra't
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* Desktop version */}
          <div className="hidden md:block w-full max-w-md mx-auto p-8">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <button
                onClick={() => setView('welcome')}
                className="mb-6 text-gray-600 hover:text-gray-900"
              >
                ← Enrere
              </button>

              <h2 className="mb-2">Benvingut de nou</h2>
              <p className="text-gray-600 mb-8">Inicia sessió per continuar</p>

              <form onSubmit={handleLogin}>
                <div className="space-y-4 mb-6">
                  <div>
                    <Label htmlFor="email-desktop">Correu electrònic</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email-desktop"
                        type="email"
                        placeholder="nom@exemple.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        className="pl-12 h-14 rounded-2xl border-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password-desktop">Contrasenya</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="password-desktop"
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        className="pl-12 h-14 rounded-2xl border-2"
                      />
                    </div>
                  </div>
                </div>

                {errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                    {errors.map((error, i) => (
                      <p key={i} className="text-sm text-red-600">{error}</p>
                    ))}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-[#E30613] hover:bg-[#C00510] text-white rounded-2xl shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Iniciant sessió...
                    </>
                  ) : (
                    'Iniciar sessió'
                  )}
                </Button>

                <p className="text-center text-sm text-gray-600 mt-4">
                  No tens compte?{' '}
                  <button
                    type="button"
                    onClick={() => setView('signup')}
                    className="text-[#E30613] font-medium"
                  >
                    Registra't
                  </button>
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Signup Screen - Step 1
  if (view === 'signup') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="h-full flex flex-col bg-white md:bg-transparent md:flex md:items-center md:justify-center w-full"
        >
          {/* Mobile version */}
          <div className="md:hidden flex-1 flex flex-col px-8 py-12 max-w-md mx-auto w-full">
            <button
              onClick={() => setView('welcome')}
              className="self-start mb-8 text-gray-600 hover:text-gray-900"
            >
              ← Enrere
            </button>

            <h2 className="mb-2">Crea el teu compte</h2>
            <p className="text-gray-600 mb-8">Pas 1 de 2</p>

            <form onSubmit={handleSignupStep1} className="flex-1 flex flex-col">
              <div className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="name">Nom complet</Label>
                  <div className="relative mt-2">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Joan Garcia"
                      value={signupData.name}
                      onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                      className="pl-12 h-14 rounded-2xl border-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-email">Correu electrònic</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="nom@exemple.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                      className="pl-12 h-14 rounded-2xl border-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signup-password">Contrasenya</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Almenys 6 caràcters"
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      className="pl-12 h-14 rounded-2xl border-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirm-password">Confirma la contrasenya</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Repeteix la contrasenya"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                      className="pl-12 h-14 rounded-2xl border-2"
                    />
                  </div>
                </div>
              </div>

              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  {errors.map((error, i) => (
                    <p key={i} className="text-sm text-red-600">{error}</p>
                  ))}
                </div>
              )}

              <div className="mt-auto">
                <Button
                  type="submit"
                  className="w-full h-14 bg-[#E30613] hover:bg-[#C00510] text-white rounded-2xl shadow-lg"
                >
                  Continuar
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>

                <p className="text-center text-sm text-gray-600 mt-4">
                  Ja tens compte?{' '}
                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className="text-[#E30613] font-medium"
                  >
                    Inicia sessió
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* Desktop version */}
          <div className="hidden md:block w-full max-w-md mx-auto p-8">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <button
                onClick={() => setView('welcome')}
                className="mb-6 text-gray-600 hover:text-gray-900"
              >
                ← Enrere
              </button>

              <h2 className="mb-2">Crea el teu compte</h2>
              <p className="text-gray-600 mb-8">Pas 1 de 2</p>

              <form onSubmit={handleSignupStep1}>
                <div className="space-y-4 mb-6">
                  <div>
                    <Label htmlFor="name-desktop">Nom complet</Label>
                    <div className="relative mt-2">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="name-desktop"
                        type="text"
                        placeholder="Joan Garcia"
                        value={signupData.name}
                        onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                        className="pl-12 h-14 rounded-2xl border-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-email-desktop">Correu electrònic</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="signup-email-desktop"
                        type="email"
                        placeholder="nom@exemple.com"
                        value={signupData.email}
                        onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                        className="pl-12 h-14 rounded-2xl border-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-password-desktop">Contrasenya</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="signup-password-desktop"
                        type="password"
                        placeholder="Almenys 6 caràcters"
                        value={signupData.password}
                        onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                        className="pl-12 h-14 rounded-2xl border-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirm-password-desktop">Confirma la contrasenya</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="confirm-password-desktop"
                        type="password"
                        placeholder="Repeteix la contrasenya"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                        className="pl-12 h-14 rounded-2xl border-2"
                      />
                    </div>
                  </div>
                </div>

                {errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                    {errors.map((error, i) => (
                      <p key={i} className="text-sm text-red-600">{error}</p>
                    ))}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-14 bg-[#E30613] hover:bg-[#C00510] text-white rounded-2xl shadow-lg"
                >
                  Continuar
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>

                <p className="text-center text-sm text-gray-600 mt-4">
                  Ja tens compte?{' '}
                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className="text-[#E30613] font-medium"
                  >
                    Inicia sessió
                  </button>
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Signup Screen - Step 2
  if (view === 'signupStep2') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="h-full flex flex-col bg-white md:bg-transparent md:flex md:items-center md:justify-center w-full"
        >
          {/* Mobile version */}
          <div className="md:hidden flex-1 flex flex-col px-8 py-12 max-w-md mx-auto w-full">
            <button
              onClick={() => setView('signup')}
              className="self-start mb-8 text-gray-600 hover:text-gray-900"
            >
              ← Enrere
            </button>

            <h2 className="mb-2">Informació adicional</h2>
            <p className="text-gray-600 mb-8">Pas 2 de 2</p>

            <form onSubmit={handleSignupStep2} className="flex-1 flex flex-col">
              <div className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="phone">Telèfon</Label>
                  <div className="relative mt-2">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="612345678"
                      value={signupData.phone}
                      onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                      className="pl-12 h-14 rounded-2xl border-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="birthdate">Data de naixement</Label>
                  <div className="relative mt-2">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="birthdate"
                      type="date"
                      value={signupData.birthdate}
                      onChange={(e) => setSignupData({...signupData, birthdate: e.target.value})}
                      className="pl-12 h-14 rounded-2xl border-2"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="gender">Gènere</Label>
                  <select
                    id="gender"
                    value={signupData.gender}
                    onChange={(e) => setSignupData({...signupData, gender: e.target.value})}
                    className="w-full h-14 rounded-2xl border-2 px-4 bg-white"
                  >
                    <option value="">Selecciona una opció</option>
                    <option value="home">Home</option>
                    <option value="dona">Dona</option>
                    <option value="altre">Altre</option>
                    <option value="no-especificar">Prefereixo no especificar</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="bloodType">Grup sanguini</Label>
                  <select
                    id="bloodType"
                    value={signupData.bloodType}
                    onChange={(e) => setSignupData({...signupData, bloodType: e.target.value})}
                    className="w-full h-14 rounded-2xl border-2 px-4 bg-white"
                  >
                    <option value="">Selecciona el teu grup</option>
                    {bloodTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Has donat sang abans?</Label>
                  <div className="flex gap-4 mt-2">
                    <button
                      type="button"
                      onClick={() => setSignupData({...signupData, hasDonatedBefore: 'yes'})}
                      className={`flex-1 h-14 rounded-2xl border-2 transition-all ${
                        signupData.hasDonatedBefore === 'yes'
                          ? 'bg-[#E30613] border-[#E30613] text-white'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Sí
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignupData({...signupData, hasDonatedBefore: 'no'})}
                      className={`flex-1 h-14 rounded-2xl border-2 transition-all ${
                        signupData.hasDonatedBefore === 'no'
                          ? 'bg-[#E30613] border-[#E30613] text-white'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  {errors.map((error, i) => (
                    <p key={i} className="text-sm text-red-600">{error}</p>
                  ))}
                </div>
              )}

              <div className="mt-auto">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-[#E30613] hover:bg-[#C00510] text-white rounded-2xl shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creant compte...
                    </>
                  ) : (
                    <>
                      Crear compte
                      <Check className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-gray-600 mt-4">
                  Ja tens compte?{' '}
                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className="text-[#E30613] font-medium"
                  >
                    Inicia sessió
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* Desktop version */}
          <div className="hidden md:block w-full max-w-md mx-auto p-8">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <button
                onClick={() => setView('signup')}
                className="mb-6 text-gray-600 hover:text-gray-900"
              >
                ← Enrere
              </button>

              <h2 className="mb-2">Informació adicional</h2>
              <p className="text-gray-600 mb-8">Pas 2 de 2</p>

              <form onSubmit={handleSignupStep2}>
                <div className="space-y-4 mb-6">
                  <div>
                    <Label htmlFor="phone-desktop">Telèfon</Label>
                    <div className="relative mt-2">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="phone-desktop"
                        type="tel"
                        placeholder="612345678"
                        value={signupData.phone}
                        onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                        className="pl-12 h-14 rounded-2xl border-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="birthdate-desktop">Data de naixement</Label>
                    <div className="relative mt-2">
                      <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="birthdate-desktop"
                        type="date"
                        value={signupData.birthdate}
                        onChange={(e) => setSignupData({...signupData, birthdate: e.target.value})}
                        className="pl-12 h-14 rounded-2xl border-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="gender-desktop">Gènere</Label>
                    <select
                      id="gender-desktop"
                      value={signupData.gender}
                      onChange={(e) => setSignupData({...signupData, gender: e.target.value})}
                      className="w-full h-14 rounded-2xl border-2 px-4 bg-white"
                    >
                      <option value="">Selecciona una opció</option>
                      <option value="home">Home</option>
                      <option value="dona">Dona</option>
                      <option value="altre">Altre</option>
                      <option value="no-especificar">Prefereixo no especificar</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="bloodType-desktop">Grup sanguini</Label>
                    <select
                      id="bloodType-desktop"
                      value={signupData.bloodType}
                      onChange={(e) => setSignupData({...signupData, bloodType: e.target.value})}
                      className="w-full h-14 rounded-2xl border-2 px-4 bg-white"
                    >
                      <option value="">Selecciona el teu grup</option>
                      {bloodTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label>Has donat sang abans?</Label>
                    <div className="flex gap-4 mt-2">
                      <button
                        type="button"
                        onClick={() => setSignupData({...signupData, hasDonatedBefore: 'yes'})}
                        className={`flex-1 h-14 rounded-2xl border-2 transition-all ${
                          signupData.hasDonatedBefore === 'yes'
                            ? 'bg-[#E30613] border-[#E30613] text-white'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        Sí
                      </button>
                      <button
                        type="button"
                        onClick={() => setSignupData({...signupData, hasDonatedBefore: 'no'})}
                        className={`flex-1 h-14 rounded-2xl border-2 transition-all ${
                          signupData.hasDonatedBefore === 'no'
                            ? 'bg-[#E30613] border-[#E30613] text-white'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>

                {errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                    {errors.map((error, i) => (
                      <p key={i} className="text-sm text-red-600">{error}</p>
                    ))}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-[#E30613] hover:bg-[#C00510] text-white rounded-2xl shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creant compte...
                    </>
                  ) : (
                    <>
                      Crear compte
                      <Check className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-gray-600 mt-4">
                  Ja tens compte?{' '}
                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className="text-[#E30613] font-medium"
                  >
                    Inicia sessió
                  </button>
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}
