# Tech Stack

| Layer | Technology |
|-------|--------------|
| Web Frontend | React 19.2.4, Vite 8.0.4, Tailwind CSS |
| Mobile Frontend | React Native + Expo, React Navigation, Redux Toolkit |
| Backend | Node.js, Express 5.2.1, WebSocket (ws 8.20.0) |
| Database | PostgreSQL target via Supabase; Prisma remains the app ORM |
| Realtime | WebSocket for live match updates |
| Engine | Custom cricket simulation with 5 integrated systems |
| Tools | Cursor IDE, ESLint, PostCSS + Autoprefixer |

## Key Dependencies

### Web Frontend (client/package.json)
- React 19.2.4
- Vite 8.0.4
- Tailwind CSS

### Mobile Frontend (mobile_cricket_rivals/package.json)
- Expo + React Native
- React Navigation
- Redux Toolkit + Redux Persist
- Axios and AsyncStorage

### Backend (server/package.json)
- Express 5.2.1
- Prisma 7.7.0
- PostgreSQL driver for production database access
- ws 8.20.0 for WebSocket server
- dotenv for environment variables

## Database

- **Production target:** Supabase Postgres
- **Local development:** Prisma-supported local database setup
- **ORM:** Prisma 7.7.0
- **Schema:** `/server/prisma/schema.prisma`
- **Migrations:** Managed by Prisma

## Simulation Engine

5 integrated systems:
1. Fatigue system (bowler/batsman exhaustion)
2. Partnership mechanics (batting compatibility)
3. Momentum/psychology (confidence streaks)
4. Pitch deterioration (wear effects)
5. Smart bowling AI (intelligent selection)

## Development Tools

- **IDE:** Cursor
- **Linting:** ESLint
- **CSS Processing:** PostCSS + Autoprefixer
- **Version Control:** Git
- **Hosting target:** Fly.io backend, Supabase Postgres, Vercel/Netlify web, Expo/app stores for mobile
