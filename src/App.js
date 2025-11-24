import { AlertTriangle, BarChart3, Loader2, Send, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SpamDetector() {
  // ============================================
  // ÉTAT DE L'APPLICATION (useState)
  // ============================================
  
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  
  // URL de votre API (À MODIFIER après déploiement)
  const API_URL = 'http://localhost:8000';  // Pour test local
  // const API_URL = 'https://votre-app.onrender.com';  // Pour production
  
  // ============================================
  // VÉRIFICATION DE L'API AU CHARGEMENT
  // ============================================
  
  useEffect(() => {
    checkApiHealth();
    loadStats();
  }, []);
  
  const checkApiHealth = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      if (response.ok) {
        setApiStatus('connected');
      } else {
        setApiStatus('error');
      }
    } catch (error) {
      setApiStatus('error');
    }
  };
  
  const loadStats = async () => {
    try {
      const response = await fetch(`${API_URL}/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.log('Stats non disponibles');
    }
  };
  
  // ============================================
  // FONCTION DE PRÉDICTION
  // ============================================
  
  const handlePredict = async () => {
    if (!message.trim()) {
      alert('Veuillez entrer un message');
      return;
    }
    
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: message })
      });
      
      if (!response.ok) {
        throw new Error('Erreur API');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert('Erreur : Impossible de contacter l\'API. Vérifiez que le backend est lancé.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // ============================================
  // EXEMPLES DE MESSAGES
  // ============================================
  
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
    const randomExample = exampleList[Math.floor(Math.random() * exampleList.length)];
    setMessage(randomExample);
    setResult(null);
  };
  
  // ============================================
  // RENDU DE L'INTERFACE
  // ============================================
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* En-tête */}
        <div className="text-center mb-8 mt-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-16 h-16 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Détecteur de Spam SMS
          </h1>
          <p className="text-gray-600">
            Intelligence artificielle pour détecter les messages spam
          </p>
          
          {/* Indicateur de statut API */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm">
            <div className={`w-2 h-2 rounded-full ${
              apiStatus === 'connected' ? 'bg-green-500' : 
              apiStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
            }`} />
            <span className="text-sm text-gray-600">
              {apiStatus === 'connected' ? 'API connectée' : 
               apiStatus === 'error' ? 'API déconnectée' : 'Vérification...'}
            </span>
          </div>
        </div>
        
        {/* Carte principale */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          
          {/* Zone de texte */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entrez un message à analyser
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tapez ou collez un message SMS ici..."
              className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
            />
          </div>
          
          {/* Boutons d'exemples */}
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 mr-2">Exemples :</span>
            <button
              onClick={() => loadExample('ham')}
              className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
            >
              Message normal
            </button>
            <button
              onClick={() => loadExample('spam')}
              className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
            >
              Message spam
            </button>
          </div>
          
          {/* Bouton d'analyse */}
          <button
            onClick={handlePredict}
            disabled={loading || !message.trim()}
            className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Analyser le message
              </>
            )}
          </button>
          
          {/* Résultat de la prédiction */}
          {result && (
            <div className={`mt-6 p-6 rounded-xl border-2 ${
              result.prediction === 'spam' 
                ? 'bg-red-50 border-red-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-start gap-4">
                {result.prediction === 'spam' ? (
                  <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
                ) : (
                  <Shield className="w-8 h-8 text-green-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h3 className={`text-xl font-bold mb-2 ${
                    result.prediction === 'spam' ? 'text-red-800' : 'text-green-800'
                  }`}>
                    {result.prediction === 'spam' ? '⚠️ SPAM DÉTECTÉ' : '✅ MESSAGE LÉGITIME'}
                  </h3>
                  <p className="text-gray-700 mb-3">
                    {result.prediction === 'spam' 
                      ? 'Ce message semble être un spam. Soyez prudent !'
                      : 'Ce message semble être légitime et sans danger.'}
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Niveau de confiance</div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            result.prediction === 'spam' ? 'bg-red-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                      <span className="text-lg font-bold text-gray-800">
                        {result.confidence.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Statistiques du modèle */}
        {stats && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Performance du modèle
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Précision globale</div>
                <div className="text-3xl font-bold text-indigo-600">
                  {stats.accuracy}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Technologie</div>
                <div className="text-lg font-semibold text-gray-800">
                  Naïve Bayes + TF-IDF
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>Propulsé par FastAPI, scikit-learn et React</p>
          <p className="mt-2">Machine Learning pour la détection de spam</p>
        </div>
        
      </div>
    </div>
  );
}