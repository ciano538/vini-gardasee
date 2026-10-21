/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    // Permette di incorporare l'app in un iframe sul tuo sito WordPress.
    // Imposta ALLOWED_EMBED_ORIGIN (es. https://tuosito.it) nelle variabili d'ambiente di Vercel.
    const allowed = process.env.ALLOWED_EMBED_ORIGIN || "*";
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${allowed === "*" ? "*" : "'self' " + allowed}`,
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
