# L'AI dei vini del Gardesano

Web app Next.js (App Router) pronta per Vercel. Interfaccia chat con i colori del logo (bordeaux, magenta, oro chiaro), mobile-friendly.

## Provarla in locale

```bash
npm install
npm run dev
```

Apri http://localhost:3000. Senza backend collegato risponde con messaggi di prova.

## Pubblicarla su Vercel

1. Carica la cartella su un repository GitHub.
2. Su Vercel: **Add New → Project** e importa il repository (nessuna configurazione particolare).
3. Dopo il deploy otterrai un indirizzo tipo `https://wine-concierge.vercel.app`.

## Collegare il backend (quando avrai la versione Pro)

Tutto passa da `app/api/chat/route.js`. In Vercel → **Settings → Environment Variables** imposta:

| Variabile | Significato |
|---|---|
| `CHAT_BACKEND_URL` | URL dell'endpoint che genera le risposte |
| `CHAT_BACKEND_KEY` | (opzionale) chiave, inviata come Bearer token |
| `ALLOWED_EMBED_ORIGIN` | dominio del tuo sito WordPress, per l'iframe |

La app invia `{ messages: [{ role, content }, ...] }` e si aspetta `{ reply: "testo" }`.
Se il tuo backend risponde in un altro formato, modifica solo la funzione `parseBackend()` nel file.

## Incorporarla in WordPress

Aggiungi un blocco **HTML personalizzato** nella pagina:

```html
<iframe
  src="https://IL-TUO-PROGETTO.vercel.app"
  style="width:100%;height:700px;border:0;border-radius:12px;"
  title="Wine Concierge"
  loading="lazy"
></iframe>
```

## Personalizzare

- Logo: sostituisci `public/logo.png`
- Colori: variabili CSS in cima a `app/globals.css`
- Testo di benvenuto e suggerimenti rapidi: in cima a `app/page.js`
