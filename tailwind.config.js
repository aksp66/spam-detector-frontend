/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // Ceci indique à Tailwind de scanner tous les fichiers
    // dans src/ pour trouver les classes utilisées
  ],
  theme: {
    extend: {
      // Vous pouvez ajouter des couleurs personnalisées ici
    },
  },
  plugins: [],
}