'use client';

import { useState } from 'react';
import { Scan, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface ScanResult {
  scanned: number;
  added: number;
  updated: number;
  errors: string[];
}

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    setIsScanning(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/media/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Impossible de se connecter au serveur');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Scanner les médias</h1>

        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scan className="w-12 h-12 text-primary-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              Analyser le dossier local
            </h2>
            <p className="text-dark-500">
              Cette action va scanner le dossier /media et indexer tous les fichiers multimédias trouvés.
            </p>
          </div>

          <button
            onClick={handleScan}
            disabled={isScanning}
            className="btn btn-primary w-full text-lg py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScanning ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Scan en cours...</span>
              </>
            ) : (
              <>
                <Scan className="w-6 h-6" />
                <span>Lancer le scan</span>
              </>
            )}
          </button>

          {error && (
            <div className="mt-6 bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 flex items-start gap-3">
              <XCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Erreur</h3>
                <p>{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="mt-6 space-y-4">
              <div className="bg-green-500/10 border border-green-500 text-green-500 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Scan terminé avec succès !</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-2xl font-bold">{result.scanned}</div>
                      <div className="opacity-75">Fichiers scannés</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{result.added}</div>
                      <div className="opacity-75">Nouveaux médias</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{result.updated}</div>
                      <div className="opacity-75">Mis à jour</div>
                    </div>
                  </div>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-500 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">
                    {result.errors.length} erreur(s) rencontrée(s)
                  </h3>
                  <ul className="text-sm space-y-1 max-h-40 overflow-y-auto">
                    {result.errors.map((err, i) => (
                      <li key={i} className="truncate">
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 bg-dark-100 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Conseils</h3>
          <ul className="space-y-2 text-dark-500">
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-1">•</span>
              <span>
                Organisez vos films avec le format : <code className="bg-dark-200 px-2 py-1 rounded">Film (2024).mp4</code>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-1">•</span>
              <span>
                Organisez vos séries avec le format : <code className="bg-dark-200 px-2 py-1 rounded">Serie S01E01.mp4</code>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-500 mt-1">•</span>
              <span>
                Les métadonnées seront automatiquement récupérées depuis TheMovieDB
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
