# PuntDonació

PuntDonació és un prototip web per gestionar donacions de sang: iniciar sessió, completar onboarding, reservar cites, fer seguiment de campanyes i bescanviar tokens per recompenses. Inclou un frontend Vite/React i una API Express/Mongo opcionalment orquestrats amb Docker.

## Funcionalitats clau
- **Autenticació i onboarding**: flux de login i passos inicials abans d’accedir a l’app.
- **Home**: campanyes actives, tipus de donació, saldo de tokens i accés ràpid a reserva.
- **Calendari**: sol·licitud de cita (tipus, centre, data/hora), mapa interactiu de punts, confirmació i cancel·lació de cites existents.
- **Recompenses**: catàleg per gastar tokens guanyats per donacions.
- **Perfil**: dades bàsiques del donant i preferències.

## Stack Tecnològic

### Frontend
- **Core**: React, TypeScript, Vite
- **Estat**: Zustand (gestió d'estat global), React Query (gestió de dades i catxé)
- **UI/Estils**: Tailwind CSS, Shadcn UI (components base), Lucide React (icones)
- **Mapes**: MapLibre GL, React Map GL
- **Formularis**: React Hook Form, Zod (validació)
- **Utilitats**: Axios, Date-fns (via DayPicker)

### Backend
- **Core**: Node.js, Express
- **Base de Dades**: MongoDB, Mongoose
- **Autenticació**: JWT (JSON Web Tokens), Bcryptjs
- **Validació**: Zod

## Arquitectura i estructura
- **Frontend (`src/`)**: Router (`router/`), maquetacions (`layouts/`), pàgines a `components/`, estat amb Zustand (`stores/`), dades amb React Query (`hooks/` i clients a `api/`), estils a `styles/` i `index.css`. Àlies `@/*` configurat a `tsconfig.json`.
- **Backend (`server/src/`)**: Express + Mongoose amb carpetes `controllers/`, `routes/`, `models/`, `middleware/`, `utils/` i configuració d’entorn/Mongo a `config/`.
- **Configuració**: ESLint + Prettier estrictes, Dockerfile i `docker-compose.yml` (MongoDB, API a :5000, frontend servit per Nginx a :3000).

## Requisits i configuració d’entorn
- Node.js 20+ i npm. Docker opcional per arrencar tot l’stack.
- **Frontend**: copia `.env.example` a `.env` i defineix `VITE_API_URL`, `VITE_API_TIMEOUT`, `VITE_MAPLIBRE_STYLE_URL` i flags de funcionalitat.
- **Backend**: crea `server/.env` amb `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGIN`, `RATE_LIMIT_WINDOW_MS` i `RATE_LIMIT_MAX_REQUESTS` (consulta `server/src/config/env.ts` per valors per defecte).

## Instal·lació i execució locals
1. Instal·la dependències frontend: `npm install`
2. Arrenca el frontend: `npm run dev` (http://localhost:5173 per defecte)
3. Instal·la dependències backend: `cd server && npm install`
4. Arrenca l’API: `npm run dev` (porta 5000)
5. Accedeix al frontend i prova el flux complet de login → onboarding → app.

**Opcional Docker**: `docker-compose up --build` per alçar Mongo, API i frontend servit per Nginx (ports 27017, 5000, 3000).

## Comandes útils

### Frontend
- `npm run dev`: Inicia el servidor de desenvolupament.
- `npm run build`: Compila l'aplicació per a producció.
- `npm run lint`: Executa el linter.
- `npm run lint:fix`: Executa el linter i arregla errors automàticament.
- `npm run format`: Formata el codi amb Prettier.
- `npm run type-check`: Comprova tipus de TypeScript.

### Backend
- `npm run dev`: Inicia el servidor en mode desenvolupament (amb recàrrega automàtica).
- `npm start`: Inicia el servidor en mode producció.
- `npm run seed`: Carrega dades de prova bàsiques.
- `npm run seed:real`: Carrega un conjunt de dades més realista.
- `npm run investigate`: Script per investigar dades existents.

## Solució de problemes (Troubleshooting)

### Docker: `init-db.sh` i finals de línia (CRLF vs LF)
Si alçat amb Docker obtens errors com `exec /docker-entrypoint-initdb.d/init-db.sh: no such file or directory` o errors de sintaxi estranys al contenidor de Mongo, és probable que el fitxer `server/init-db.sh` tingui finals de línia de Windows (CRLF).

**Solució**:
Assegura't que `server/init-db.sh` tingui finals de línia LF (Unix). Pots canviar-ho al teu editor o executant:
```bash
dos2unix server/init-db.sh
```
O configurant git per a aquest fitxer.

### Errors de connexió a MongoDB
Assegura't que la URI de connexió sigui correcta.
- **Local**: `mongodb://localhost:27017/puntdonacio`
- **Docker**: `mongodb://mongodb:27017/puntdonacio` (on `mongodb` és el nom del servei al `docker-compose.yml`).
