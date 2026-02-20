# Dieta + Allenamenti

Una web app personale per tracciare dieta e allenamenti con attrito minimo, pensata per il deploy su Vercel. L’obiettivo è permettere di registrare facilmente foto dei pasti, loggare le sessioni di allenamento e generare report e promemoria automatici tramite cron job.

## Architettura

- **Frontend**: Next.js App Router con TypeScript e Tailwind CSS.
- **Backend**: API routes in Next.js. Il database è gestito tramite Prisma con PostgreSQL (consigliato su Vercel) o SQLite per lo sviluppo locale.
- **Storage**: Le foto vengono caricate su Vercel Blob tramite l’endpoint `/api/upload`.
- **Auth**: NextAuth con provider email (magic link). Gli account e le sessioni sono memorizzati nel database tramite l’adapter Prisma.
- **Cron**: due endpoint cron su `/api/cron/daily-check` e `/api/cron/weekly-report` schedulati tramite `vercel.json`.

## Avvio in locale

1. Clona questo repository e installa le dipendenze con npm o pnpm (richiede accesso alla registry npm):

   ```sh
   npm install
   ```

2. Copia `.env.example` in `.env` e imposta le variabili:

   - `DATABASE_PROVIDER` (`postgresql` o `sqlite` per lo sviluppo)
   - `DATABASE_URL` stringa di connessione al database
   - `NEXTAUTH_URL` (es. `http://localhost:3000` durante lo sviluppo)
   - `NEXTAUTH_SECRET` chiave segreta per NextAuth
   - `RESEND_API_KEY` e `RESEND_FROM` per inviare email (opzionale in locale)
   - `BLOB_READ_WRITE_TOKEN` token Vercel Blob (opzionale in locale)

3. Genera il client Prisma e applica le migrazioni:

   ```sh
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. Avvia il server di sviluppo:

   ```sh
   npm run dev
   ```

5. Visita `http://localhost:3000` per utilizzare l’app.

> **Nota**: questo progetto include solo il codice. Per eseguire realmente l’app è necessario installare le dipendenze via npm/pnpm, configurare correttamente il database e fornire le chiavi di servizio (Resend, Vercel Blob). L’ambiente di questa challenge non consente accesso a npm, quindi il codice non è stato eseguito qui.

## Deploy su Vercel

1. Crea un nuovo progetto su Vercel collegando questo repository.
2. Provisiona un database Postgres tramite l’integrazione Vercel Postgres oppure Neon. Verranno generati automaticamente le variabili `POSTGRES_PRISMA_URL` e `POSTGRES_URL_NON_POOLING` che puoi usare per `DATABASE_URL`.
3. Provisiona Vercel Blob e imposta la variabile `BLOB_READ_WRITE_TOKEN`.
4. Configura le variabili d’ambiente su Vercel secondo il file `.env.example`.
5. Vercel rileverà automaticamente la directory `app` e creerà funzioni serverless per le API routes. I cron job sono definiti in `vercel.json`.

## Funzioni principali

- **Pasti**: carica foto, seleziona tipo pasto, stima facoltativa delle kcal e note. I pasti vengono mostrati in un feed giornaliero.
- **Allenamenti**: avvia una sessione, aggiungi set (esercizio, reps, peso, RPE facoltativo), termina la sessione e salva. Lo storico delle sessioni mostra le sessioni recenti.
- **Dashboard**: mostra conteggio dei pasti e degli allenamenti odierni.
- **Cron job**: un controllo giornaliero invia promemoria se non hai registrato pasti/allenamenti; un report settimanale genera un riepilogo salvato nel DB. Gli handler sono stub e vanno completati secondo le tue esigenze (invio email, notifiche push ecc.).

## Struttura del progetto

- `app/`: cartella principale con il router App di Next.js.
  - `layout.tsx`: layout globale con provider Auth.
  - `page.tsx`: dashboard.
  - `meals/`: feed e pagina di inserimento pasto.
  - `workouts/`: storico e inserimento sessioni.
  - `api/`: API routes per auth, upload, cron, pasti e allenamenti.
- `components/`: componenti riutilizzabili (Providers).
- `lib/`: moduli ausiliari (Prisma client).
- `prisma/`: schema Prisma.
- `vercel.json`: definizione dei cron job.

## Da completare

Questo repository contiene la base per l’MVP. Per completare l’app potresti:

- Aggiungere supporto offline/sync con IndexedDB (ad esempio utilizzando Dexie) e una coda per sincronizzare quando la rete è disponibile.
- Integrare AI per la stima calorica dalle foto tramite API esterne o un agente personale.
- Migliorare la UI/UX con componenti da `shadcn/ui` o simili.
- Gestire ruoli utenti, backup/import JSON e altre funzionalità avanzate descritte nel piano di sviluppo.