 # PuntDonació
 
 PuntDonació és un prototip web per gestionar donacions de sang: iniciar sessió, completar onboarding, reservar cites, fer seguiment de campanyes i bescanviar tokens per recompenses. Inclou un frontend Vite/React i una API Express/Mongo opcionalment orquestrats amb Docker.
 
 ## Funcionalitats clau
 - Autenticació i onboarding: flux de login i passos inicials abans d’accedir a l’app.
 - Home: campanyes actives, tipus de donació, saldo de tokens i accés ràpid a reserva.
 - Calendari: sol·licitud de cita (tipus, centre, data/hora), mapa interactiu de punts, confirmació i cancel·lació de cites existents.
 - Recompenses: catàleg per gastar tokens guanyats per donacions.
 - Perfil: dades bàsiques del donant i preferències.
 
 ## Arquitectura i estructura
 - Frontend (`src/`): Vite + React + TypeScript; router (`router/`), maquetacions (`layouts/`), pàgines a `components/`, estat amb Zustand (`stores/`), dades amb React Query (`hooks/` i clients a `api/`), estils a `styles/` i `index.css`. Àlies `@/*` configurat a `tsconfig.json`.
 - Backend (`server/src/`): Express + Mongoose amb carpetes `controllers/`, `routes/`, `models/`, `middleware/`, `utils/` i configuració d’entorn/Mongo a `config/`.
 - Configuració: ESLint + Prettier estrictes, Dockerfile i `docker-compose.yml` (MongoDB, API a :5000, frontend servit per Nginx a :3000).
 
 ## Requisits i configuració d’entorn
 - Node.js 20+ i npm. Docker opcional per arrencar tot l’stack.
 - Frontend: copia `.env.example` a `.env` i defineix `VITE_API_URL`, `VITE_API_TIMEOUT`, `VITE_MAPLIBRE_STYLE_URL` i flags de funcionalitat.
 - Backend: crea `server/.env` amb `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGIN`, `RATE_LIMIT_WINDOW_MS` i `RATE_LIMIT_MAX_REQUESTS` (consulta `server/src/config/env.ts` per valors per defecte).
 
 ## Instal·lació i execució locals
 1) Instal·la dependències frontend: `npm install`  
 2) Arrenca el frontend: `npm run dev` (http://localhost:5173 per defecte)  
 3) Instal·la dependències backend: `cd server && npm install`  
 4) Arrenca l’API: `npm run dev` (porta 5000)  
 5) Accedeix al frontend i prova el flux complet de login → onboarding → app.
 
 Opcional Docker: `docker-compose up --build` per alçar Mongo, API i frontend servit per Nginx (ports 27017, 5000, 3000).
 
 ## Comandes útils
 - Frontend: `npm run dev`, `npm run build`, `npm run lint`, `npm run lint:fix`, `npm run format`, `npm run format:check`, `npm run type-check`.
 - Backend: `npm run dev`, `npm run build`, `npm start`, `npm run type-check`, `npm run seed` (carrega dades de prova si s’implementa).
 
 ## Flux intern
 - Les crides d’API es fan via React Query; el token/usuari viu a `stores/authStore` i es valida amb `ProtectedRoute` per evitar accés sense login o sense onboarding.
 - L’agenda consumeix punts de donació i cites via els hooks d’API, mostra slots disponibles i permet confirmar o cancel·lar; el mapa utilitza MapLibre per ubicar centres.
 - El catàleg de recompenses i el perfil llegeixen l’usuari actiu i els tokens guardats, actualitzant l’UI en temps real.
  
