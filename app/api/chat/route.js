import { NextResponse } from "next/server";

/**
 * PUNTO UNICO DI COLLEGAMENTO AL BACKEND
 *
 * - Se CHAT_BACKEND_URL è impostata (variabile d'ambiente su Vercel), la richiesta
 *   viene inoltrata a quell'endpoint (es. il tuo flusso Anywhere / API Pro).
 * - Se non è impostata, risponde con risposte "di prova" locali.
 *
 * Formato inviato al backend:   { messages: [{ role, content }, ...] }
 * Formato atteso in risposta:   { reply: "testo" }   (adatta parseBackend() se diverso)
 */

const BACKEND_URL = process.env.CHAT_BACKEND_URL;
const BACKEND_KEY = process.env.CHAT_BACKEND_KEY; // opzionale, resta lato server

function parseBackend(data) {
  // Adatta qui se la risposta del tuo backend ha un'altra forma.
  return data.reply ?? data.message ?? data.answer ?? data.output ?? "";
}

function mockReply(text) {
  const t = text.toLowerCase();
  if (/pesce|lago|persico|coregone|lavarello|trota/.test(t))
    return "Con il pesce di lago ti consiglio un Lugana: fresco, sapido e minerale, valorizza persico e coregone senza coprirli. In alternativa un Custoza o un Garda DOC Chardonnay. (Risposta di prova.)";
  if (/bardolino|chiaretto/.test(t))
    return "Il Bardolino è un rosso leggero e fruttato, da servire leggermente fresco. Il Chiaretto è il suo rosato, fatto con le stesse uve (Corvina, Rondinella, Molinara): più sapido e perfetto in estate. (Risposta di prova.)";
  if (/lugana|aperitivo|bollicine|spumante/.test(t))
    return "Per l'aperitivo un Lugana è una scelta elegante, oppure un Lugana spumante metodo Charmat o Classico per qualcosa di più vivace. Servilo a 8-10 °C. (Risposta di prova.)";
  if (/cantin|visit|degustazion|enoteca/.test(t))
    return "Sul Garda ci sono molte cantine con visite e degustazioni, tra Bardolino, Lugana e le colline moreniche. Dimmi in che zona sei e che tipo di vino ti piace e ti propongo un itinerario. (Risposta di prova.)";
  if (/rosso|carne|formaggio|valpolicella|amarone/.test(t))
    return "Per un rosso del territorio puoi scegliere un Bardolino Superiore o un Valpolicella Ripasso: eleganti e versatili con carni e formaggi. (Risposta di prova.)";
  return "Volentieri! Dimmi che piatto hai in mente, l'occasione o la zona del Garda che ti interessa e ti propongo vini e cantine. (Risposta di prova: il backend non è ancora collegato.)";
}

export async function POST(req) {
  const { messages = [] } = await req.json();
  const last = messages[messages.length - 1]?.content || "";

  if (!BACKEND_URL) {
    await new Promise((r) => setTimeout(r, 700));
    return NextResponse.json({ reply: mockReply(last) });
  }

  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(BACKEND_KEY ? { Authorization: `Bearer ${BACKEND_KEY}` } : {}),
      },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) throw new Error(`Backend ${res.status}`);
    const data = await res.json();
    return NextResponse.json({ reply: parseBackend(data) });
  } catch (e) {
    return NextResponse.json(
      { reply: "Il servizio non è raggiungibile al momento. Riprova più tardi." },
      { status: 502 }
    );
  }
}
