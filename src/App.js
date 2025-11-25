// ============================================
// IMPORTS - Les bibliothèques nécessaires
// ============================================

// React : framework pour créer l'interface
import React, { useState, useEffect } from 'react';

// Lucide-react : icônes modernes (Shield, Send, etc.)
import { Send, Shield, AlertTriangle, BarChart3, Loader2, MessageSquare } from 'lucide-react';

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function SpamDetector() {
  
  // ==========================================
  // ÉTAT DE L'APPLICATION (useState)
  // ==========================================
  // useState permet de stocker des données qui changent
  // Syntaxe : const [variable, fonctionPourLaChanger] = useState(valeurInitiale)
  
  const [message, setMessage] = useState(''); 
  // → Stocke le texte saisi par l'utilisateur
  
  const [result, setResult] = useState(null); 
  // → Stocke la réponse de l'API (spam ou ham)
  
  const [loading, setLoading] = useState(false); 
  // → true quand on attend la réponse de l'API
  
  const [stats, setStats] = useState(null); 
  // → Stocke les statistiques du modèle (précision, etc.)
  
  const [apiStatus, setApiStatus] = useState('checking'); 
  // → État de connexion : 'checking', 'connected', ou 'error'
  
  // ==========================================
  // CONFIGURATION DE L'API
  // ==========================================
  // IMPORTANT : Changez cette URL après déploiement !
  
  const API_URL = 'https://spam-detector-api-8p6z.onrender.com';
  // Pour production : 'https://votre-backend.onrender.com'
  
  // ==========================================
  // useEffect : EXÉCUTÉ AU CHARGEMENT
  // ==========================================
  // useEffect s'exécute quand le composant s'affiche
  // [] = exécuté une seule fois au chargement
  
  useEffect(() => {
    checkApiHealth();  // Vérifie si l'API répond
    loadStats();       // Charge les stats du modèle
  }, []);
  
  // ==========================================
  // FONCTION 1 : Vérifier l'API
  // ==========================================
  // But : Savoir si le backend est accessible
  
  const checkApiHealth = async () => {
    try {
      // Appel à l'endpoint /health
      const response = await fetch(`${API_URL}/health`);
      
      if (response.ok) {
        setApiStatus('connected');  // ✅ API OK
      } else {
        setApiStatus('error');      // ❌ API en erreur
      }
    } catch (error) {
      setApiStatus('error');        // ❌ Impossible de joindre l'API
    }
  };
  
  // ==========================================
  // FONCTION 2 : Charger les statistiques
  // ==========================================
  // But : Récupérer la précision du modèle
  
  const loadStats = async () => {
    try {
      const response = await fetch(`${API_URL}/stats`);
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);  // Stocke les stats
      }
    } catch (error) {
      console.log('Stats non disponibles');
      // Pas grave si ça échoue, juste des infos en plus
    }
  };
  
  // ==========================================
  // FONCTION 3 : Prédire si spam ou ham
  // ==========================================
  // But : Envoyer le message au backend pour analyse
  
  const handlePredict = async () => {
    // Vérification : le message ne doit pas être vide
    if (!message.trim()) {
      alert('⚠️ Veuillez entrer un message');
      return;
    }
    
    setLoading(true);    // Affiche le spinner
    setResult(null);     // Efface le résultat précédent
    
    try {
      // Appel POST à l'API
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: message })
        // On envoie : { "text": "le message de l'utilisateur" }
      });
      
      if (!response.ok) {
        throw new Error('Erreur API');
      }
      
      // Récupération de la réponse
      const data = await response.json();
      // data contient : { prediction: "spam", confidence: 95.3 }
      
      setResult(data);  // Affiche le résultat
      
    } catch (error) {
      alert('❌ Erreur : Impossible de contacter l\'API');
      console.error(error);
    } finally {
      setLoading(false);  // Cache le spinner
    }
  };
  
  // ==========================================
  // FONCTION 4 : Exemples prédéfinis
  // ==========================================
  // But : Charger rapidement un exemple de spam ou ham
  
  const examples = {
    ham: [
      "Hey, are we still meeting at 3pm tomorrow?",
      "Thanks for your help with the project",
      "Don't forget to bring the documents"
    ],
    spam: [
      "WINNER! You have won $1000! Click here NOW!!!",
      "FREE iPhone! Call this number immediately",
      "Congratulations! You have been selected for a prize"
    ]
  };
  
  const loadExample = (type) => {
    const exampleList = examples[type];
    // Choisit un exemple au hasard
    const randomExample = exampleList[Math.floor(Math.random() * exampleList.length)];
    setMessage(randomExample);
    setResult(null);  // Efface l'ancien résultat
  };
  
  // ==========================================
  // RENDU DE L'INTERFACE (JSX + Tailwind)
  // ==========================================
  // JSX = mélange de HTML et JavaScript
  // className = équivalent de "class" en HTML
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      {/* min-h-screen = hauteur minimum = 100% de l'écran */}
      {/* bg-gradient-to-br = dégradé diagonal (bleu → indigo → violet) */}
      {/* p-4 = padding de 1rem (16px) */}
      
      <div className="max-w-4xl mx-auto">
        {/* max-w-4xl = largeur max 896px */}
        {/* mx-auto = centre horizontalement */}
        
        {/* ================================ */}
        {/* EN-TÊTE */}
        {/* ================================ */}
        
        <div className="text-center mb-8 mt-8">
          {/* text-center = texte centré */}
          {/* mb-8 = margin-bottom 2rem */}
          {/* mt-8 = margin-top 2rem */}
          
          {/* Logo Shield */}
          <div className="flex items-center justify-center mb-4">
            {/* flex = disposition flexible */}
            {/* items-center = alignement vertical centré */}
            {/* justify-center = alignement horizontal centré */}
            
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg">
              {/* bg-gradient-to-r = dégradé horizontal */}
              {/* p-4 = padding 1rem */}
              {/* rounded-2xl = coins très arrondis */}
              {/* shadow-lg = ombre portée large */}
              
              <Shield className="w-16 h-16 text-white" />
              {/* w-16 h-16 = 64px × 64px */}
              {/* text-white = couleur blanche */}
            </div>
          </div>
          
          {/* Titre principal */}
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            {/* text-5xl = très grande taille (3rem) */}
            {/* font-bold = gras */}
            {/* bg-clip-text = applique le dégradé au texte */}
            {/* text-transparent = rend le texte transparent pour voir le dégradé */}
            
            Détecteur de Spam SMS
          </h1>
          
          {/* Sous-titre */}
          <p className="text-gray-600 text-lg mb-6">
            {/* text-gray-600 = gris moyen */}
            {/* text-lg = taille 1.125rem */}
            
            Intelligence artificielle pour détecter les messages frauduleux
          </p>
          
          {/* ================================ */}
          {/* INDICATEUR DE STATUT API */}
          {/* ================================ */}
          
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white shadow-md border border-gray-100">
            {/* inline-flex = flex en ligne */}
            {/* gap-2 = espacement entre éléments */}
            {/* px-5 = padding horizontal */}
            {/* rounded-full = complètement arrondi */}
            {/* border = bordure */}
            
            {/* Point coloré selon l'état */}
            <div className={`w-3 h-3 rounded-full animate-pulse ${
              apiStatus === 'connected' ? 'bg-green-500' : 
              apiStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
            }`} />
            {/* animate-pulse = animation de pulsation */}
            {/* Ternaire pour choisir la couleur */}
            
            <span className="text-sm font-medium text-gray-700">
              {apiStatus === 'connected' ? '✅ API connectée' : 
               apiStatus === 'error' ? '❌ API déconnectée' : '⏳ Vérification...'}
            </span>
          </div>
        </div>
        
        {/* ================================ */}
        {/* CARTE PRINCIPALE */}
        {/* ================================ */}
        
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 border border-gray-100">
          {/* rounded-3xl = coins très arrondis */}
          {/* shadow-2xl = ombre très prononcée */}
          {/* p-8 = padding 2rem */}
          
          {/* ================================ */}
          {/* ZONE DE TEXTE */}
          {/* ================================ */}
          
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              {/* flex items-center = alignement vertical */}
              {/* gap-2 = espacement 0.5rem */}
              {/* font-semibold = semi-gras */}
              
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              Entrez un message à analyser
            </label>
            
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              // onChange déclenché à chaque modification
              // e.target.value = le texte saisi
              
              placeholder="Tapez ou collez un message SMS ici..."
              className="w-full h-40 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-none text-gray-800"
              // w-full = largeur 100%
              // h-40 = hauteur 10rem
              // focus:border-indigo-500 = bordure indigo au focus
              // focus:ring-4 = anneau de 4px au focus
              // outline-none = supprime le contour par défaut
              // transition-all = animation fluide
              // resize-none = empêche le redimensionnement
            />
          </div>
          
          {/* ================================ */}
          {/* BOUTONS D'EXEMPLES */}
          {/* ================================ */}
          
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {/* flex-wrap = retour à la ligne si nécessaire */}
            
            <span className="text-sm text-gray-500 font-medium">
              📝 Exemples rapides :
            </span>
            
            <button
              onClick={() => loadExample('ham')}
              className="text-sm px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full hover:from-green-200 hover:to-emerald-200 transition-all font-medium shadow-sm"
              // hover:from-green-200 = change le dégradé au survol
              // transition-all = animation fluide
            >
              ✅ Message normal
            </button>
            
            <button
              onClick={() => loadExample('spam')}
              className="text-sm px-4 py-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 rounded-full hover:from-red-200 hover:to-pink-200 transition-all font-medium shadow-sm"
            >
              ⚠️ Message spam
            </button>
          </div>
          
          {/* ================================ */}
          {/* BOUTON D'ANALYSE */}
          {/* ================================ */}
          
          <button
            onClick={handlePredict}
            disabled={loading || !message.trim()}
            // disabled = désactivé si loading=true OU message vide
            
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            // disabled:from-gray-300 = gris si désactivé
            // disabled:cursor-not-allowed = curseur interdit
            // hover:shadow-xl = ombre plus grande au survol
          >
            {loading ? (
              // Si loading = true, affiche le spinner
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                {/* animate-spin = rotation continue */}
                <span>Analyse en cours...</span>
              </>
            ) : (
              // Sinon, affiche l'icône Send
              <>
                <Send className="w-6 h-6" />
                <span>Analyser le message</span>
              </>
            )}
          </button>
          
          {/* ================================ */}
          {/* RÉSULTAT DE LA PRÉDICTION */}
          {/* ================================ */}
          
          {result && (
            // Affiche seulement si result n'est pas null
            
            <div className={`mt-6 p-6 rounded-2xl border-2 transition-all ${
              result.prediction === 'spam' 
                ? 'bg-gradient-to-br from-red-50 to-pink-50 border-red-300' 
                : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
            }`}>
              {/* Couleur selon spam ou ham */}
              
              <div className="flex items-start gap-4">
                
                {/* Icône selon le résultat */}
                {result.prediction === 'spam' ? (
                  <div className="bg-red-100 p-3 rounded-xl">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                ) : (
                  <div className="bg-green-100 p-3 rounded-xl">
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                )}
                
                {/* Contenu du résultat */}
                <div className="flex-1">
                  {/* flex-1 = prend tout l'espace disponible */}
                  
                  <h3 className={`text-2xl font-bold mb-2 ${
                    result.prediction === 'spam' ? 'text-red-800' : 'text-green-800'
                  }`}>
                    {result.prediction === 'spam' ? '⚠️ SPAM DÉTECTÉ' : '✅ MESSAGE LÉGITIME'}
                  </h3>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {/* leading-relaxed = interligne confortable */}
                    
                    {result.prediction === 'spam' 
                      ? '⛔ Ce message semble être un spam ou une tentative de fraude. Soyez très prudent et ne cliquez sur aucun lien !'
                      : '👍 Ce message semble être légitime et sans danger. Aucune menace détectée.'}
                  </p>
                  
                  {/* Barre de confiance */}
                  <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="text-sm font-medium text-gray-600 mb-2">
                      📊 Niveau de confiance
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {/* Barre de progression */}
                      <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            result.prediction === 'spam' 
                              ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                              : 'bg-gradient-to-r from-green-500 to-emerald-500'
                          }`}
                          style={{ width: `${result.confidence}%` }}
                          // Style inline pour la largeur dynamique
                        />
                      </div>
                      
                      {/* Pourcentage */}
                      <span className="text-2xl font-bold text-gray-800 min-w-[80px] text-right">
                        {/* min-w-[80px] = largeur min personnalisée */}
                        {result.confidence.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* ================================ */}
        {/* STATISTIQUES DU MODÈLE */}
        {/* ================================ */}
        
        {stats && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Performance du modèle
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* grid = grille */}
              {/* grid-cols-1 = 1 colonne sur mobile */}
              {/* md:grid-cols-2 = 2 colonnes sur écran moyen+ */}
              
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                <div className="text-sm text-gray-600 mb-1 font-medium">
                  🎯 Précision globale
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {stats.accuracy}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                <div className="text-sm text-gray-600 mb-1 font-medium">
                  🤖 Technologie
                </div>
                <div className="text-lg font-bold text-gray-800">
                  Naïve Bayes + TF-IDF
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Machine Learning
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* ================================ */}
        {/* FOOTER */}
        {/* ================================ */}
        
        <div className="text-center mt-8 text-gray-600 text-sm space-y-2">
          {/* space-y-2 = espacement vertical entre enfants */}
          
          <p className="font-medium">
            ⚡ Propulsé par FastAPI, scikit-learn et React
          </p>
          <p className="text-gray-500">
            🧠 Intelligence artificielle pour la cybersécurité
          </p>
        </div>
        
      </div>
    </div>
  );
}