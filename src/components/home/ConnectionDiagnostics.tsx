import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Loader2, Server, AlertCircle } from 'lucide-react';
import { getApiUrl, getApiConfig } from '../../lib/api';

export const ConnectionDiagnostics: React.FC = () => {
  const [status, setStatus] = useState<'testing' | 'connected' | 'failed' | 'idle'>('idle');
  const [details, setDetails] = useState<{ time: string; hasKey: boolean } | null>(null);
  const [customUrl, setCustomUrl] = useState<string | null>(null);
  const [config, setConfig] = useState(getApiConfig());

  useEffect(() => {
    const activeConfig = getApiConfig();
    setConfig(activeConfig);
    setCustomUrl(activeConfig.customBaseUrl || null);
    
    if (activeConfig.mode === 'direct' && activeConfig.directApiKey) {
      setStatus('connected');
      setDetails({ time: new Date().toISOString(), hasKey: true });
    } else if (activeConfig.customBaseUrl) {
      testConnection();
    }
  }, []);

  const testConnection = async () => {
    if (config.mode === 'direct') {
      if (!config.directApiKey) {
        setStatus('failed');
        setDetails({ time: new Date().toISOString(), hasKey: false });
        return;
      }
      
      setStatus('testing');
      try {
        let ok = false;
        const modelsToTry = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
        for (const model of modelsToTry) {
          try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.directApiKey}`;
            const res = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                contents: [{ parts: [{ text: 'say ok' }] }]
              }),
              referrerPolicy: 'no-referrer'
            });
            if (res.ok) {
              ok = true;
              break;
            }
          } catch (e) {
            // continue
          }
        }
        
        if (ok) {
          setStatus('connected');
          setDetails({ time: new Date().toISOString(), hasKey: true });
        } else {
          setStatus('failed');
          setDetails({ time: new Date().toISOString(), hasKey: true });
        }
      } catch (err) {
        setStatus('failed');
      }
      return;
    }

    setStatus('testing');
    try {
      const url = getApiUrl('/api/connection-test');
      console.log(`[Diagnostics] Testing connection to: ${url}`);
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        setStatus('connected');
        setDetails({ time: data.time, hasKey: data.env.hasGeminiKey });
      } else {
        setStatus('failed');
      }
    } catch (err) {
      setStatus('failed');
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className={`flex items-center justify-between p-2.5 rounded-lg border text-[12px] font-medium transition-all ${
        status === 'connected' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
        status === 'failed' ? 'bg-red-50 border-red-100 text-red-700' :
        'bg-gray-50 border-gray-100 text-gray-500'
      }`}>
        <div className="flex items-center gap-2.5">
          {status === 'testing' ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : status === 'connected' ? (
            <Wifi className="w-3.5 h-3.5" />
          ) : (
            <WifiOff className="w-3.5 h-3.5" />
          )}
          
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-[10px] uppercase tracking-wider opacity-70">
              {config.mode === 'direct' ? 'Direct Mode' : (customUrl ? 'Dev Loopback' : 'Cloud Proxy')}
            </span>
            <span className="text-[13px] font-bold">
              {status === 'testing' ? 'Connecting...' :
               status === 'connected' ? 'Connected' :
               'Failed'}
            </span>
          </div>
        </div>

        <button 
          onClick={testConnection}
          className="px-3 py-1.5 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 active:scale-95 transition-all text-[11px] font-bold"
        >
          {status === 'testing' ? 'Testing...' : 'Test Now'}
        </button>
      </div>

      {status === 'failed' && (
        <div className="p-3 bg-red-50/50 border border-red-100/50 rounded-lg space-y-1.5">
          <div className="flex items-center gap-1.5 text-red-700">
            <AlertCircle className="w-3.5 h-3.5" />
            <span className="text-[12px] font-bold">Connectivity Error</span>
          </div>
          <p className="text-[11px] text-red-600 leading-normal pl-5">
            Cloud proxy failed. Check server URL, environment keys, or deployment status.
          </p>
        </div>
      )}
    </div>
  );
};
