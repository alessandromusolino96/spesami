# Spesami

PWA mobile per tracciare spese e entrate, con analisi per categoria e spending review.

**Spesami**

## Funzionalità

- Inserimento rapido spese e entrate
- Macro-categorie con etichette libere (es. Netflix, Esselunga)
- Dashboard con grafico categorie e top spese
- Dati locali (IndexedDB), export JSON/CSV
- PWA installabile, funziona offline

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Dexie.js (IndexedDB)
- Recharts
- vite-plugin-pwa

## Sviluppo

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy

Deploy su Vercel/Netlify con HTTPS per installazione PWA.
