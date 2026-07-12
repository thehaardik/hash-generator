'use client';

import { useState } from 'react';

async function hash(text: string, algorithm: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function Home() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState('');

  const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

  const generateHashes = async () => {
    if (!input.trim()) return;
    const newResults: Record<string, string> = {};
    for (const algo of algorithms) {
      newResults[algo] = await hash(input, algo);
    }
    setResults(newResults);
  };

  const copyToClipboard = (text: string, algo: string) => {
    navigator.clipboard.writeText(text);
    setCopied(algo);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Hash Generator</h1>
          <p className="text-xl text-gray-600">Generate MD5, SHA-1, SHA-256, SHA-512 hashes from any text</p>
        </div>

        <div className="bg-white rounded-lg border p-6 mb-8">
          <h2 className="font-semibold mb-3">Input Text</h2>
          <textarea className="w-full h-32 p-3 border rounded-lg font-mono text-sm" placeholder="Enter text to hash..." value={input} onChange={(e) => setInput(e.target.value)} />
          <button onClick={generateHashes} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Generate Hashes</button>
        </div>

        {Object.keys(results).length > 0 && (
          <div className="space-y-4">
            {Object.entries(results).map(([algo, hashVal]) => (
              <div key={algo} className="bg-white rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{algo}</h3>
                  <button onClick={() => copyToClipboard(hashVal, algo)} className="text-sm text-blue-600 hover:underline">
                    {copied === algo ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto text-xs font-mono break-all">{hashVal}</pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
