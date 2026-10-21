"use client";

import { useEffect, useRef, useState } from "react";

const WELCOME =
  "Benvenuto! Sono l'AI dei vini e delle cantine del territorio Gardesano. Posso aiutarti a scegliere un vino, abbinarlo a un piatto o consigliarti una cantina da visitare. Cosa stai cercando?";

const SUGGESTIONS = [
  "Che vino abbino a un piatto di pesce di lago?",
  "Differenza tra Bardolino e Chiaretto",
  "Un Lugana per l'aperitivo",
  "Cantine da visitare sul Garda",
];

export default function Home() {
  const [messages, setMessages] = useState([{ role: "assistant", content: WELCOME }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([
        ...next,
        { role: "assistant", content: data.reply || "Non sono riuscito a rispondere, riprova." },
      ]);
    } catch (e) {
      setMessages([
        ...next,
        { role: "assistant", content: "Si è verificato un problema di connessione. Riprova tra un attimo." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const isStart = messages.length === 1;

  return (
    <div className="shell">
      <div className="messages">
        <div className="hero">
          <img src="/logo.png" alt="L'AI dei vini e delle cantine del territorio Gardesano" />
        </div>
        {messages.map((m, i) => (
          <div key={i} className={`row ${m.role === "user" ? "user" : ""}`}>
            <div className={`bubble ${m.role === "user" ? "user" : "bot"}`}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div className="row">
            <div className="bubble bot">
              <div className="typing"><span /><span /><span /></div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {isStart && (
        <div className="suggestions">
          {SUGGESTIONS.map((s) => (
            <button key={s} className="chip" onClick={() => send(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrivi qui la tua richiesta…"
          aria-label="Messaggio"
        />
        <button type="submit" disabled={loading || !input.trim()}>
          Invia
        </button>
      </form>
      <div className="footer-note">Bevi responsabilmente. Vietato ai minori di 18 anni.</div>
    </div>
  );
}
