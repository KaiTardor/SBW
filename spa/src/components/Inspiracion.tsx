import { useState, useEffect } from 'react';

type Cita = { texto: string; autor: string };

export default function Inspiracion() {
  const [historial, setHistorial] = useState<Cita[]>([]);
  const [indice, setIndice] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCita = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://dummyjson.com/quotes/random');
      const data = await res.json();
      const nuevaCita = { texto: data.quote, autor: data.author };
      
      setHistorial(prev => {
        const nuevo = [...prev, nuevaCita];
        setIndice(nuevo.length - 1);
        return nuevo;
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCita();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const irAtras = () => {
    if (indice > 0) setIndice(indice - 1);
  };

  const irAdelante = () => {
    if (indice < historial.length - 1) {
      setIndice(indice + 1);
    } else {
      fetchCita(); // Pide una nueva si estamos al final del historial
    }
  };

  const citaActual = historial[indice];

  return (
    <div className="max-w-4xl w-full flex flex-col items-center justify-center relative">
      
      <div className="w-full flex items-center justify-between gap-4 md:gap-8">
        
        {/* Flecha Atrás */}
        <button 
          onClick={irAtras}
          disabled={indice <= 0 || loading}
          className={`flex-shrink-0 p-3 md:p-5 rounded-full transition-all duration-300 backdrop-blur-sm 
            ${indice <= 0 ? 'text-gray-300 opacity-50 cursor-not-allowed bg-transparent' : 'text-gray-800 bg-white/30 hover:bg-white/80 hover:shadow-lg hover:scale-105'}`}
          title="Cita anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        </button>

        {/* Contenido Cita */}
        <div className="flex-grow text-center min-h-[300px] flex flex-col justify-center relative">
          {loading && indice === historial.length - 1 ? (
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-6 bg-gray-300/50 rounded w-3/4 mb-6"></div>
              <div className="h-6 bg-gray-300/50 rounded w-5/6 mb-12"></div>
              <div className="h-4 bg-gray-300/50 rounded w-1/3"></div>
            </div>
          ) : citaActual ? (
            <div className="relative px-6 md:px-10 py-8 bg-white/40 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50">
              <span className="text-8xl text-[#d4af37] font-serif leading-none absolute -top-6 -left-2 opacity-40 select-none">"</span>
              <span className="text-8xl text-[#d4af37] font-serif leading-none absolute -bottom-12 -right-2 opacity-40 select-none transform rotate-180">"</span>
              
              <p className="text-xl md:text-2xl italic text-gray-900 mb-8 font-serif leading-relaxed relative z-10" style={{ textShadow: '0 2px 10px rgba(255,255,255,0.8)' }}>
                {citaActual.texto}
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-8 bg-[#8b6914]"></div>
                <p className="text-sm md:text-base font-bold text-[#8b6914] uppercase tracking-[0.25em]">
                  {citaActual.autor}
                </p>
                <div className="h-px w-8 bg-[#8b6914]"></div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Flecha Adelante */}
        <button 
          onClick={irAdelante}
          disabled={loading}
          className={`flex-shrink-0 p-3 md:p-5 rounded-full transition-all duration-300 backdrop-blur-sm 
            ${loading ? 'opacity-50 cursor-wait bg-transparent text-gray-400' : 'text-gray-800 bg-white/30 hover:bg-white/80 hover:shadow-lg hover:scale-105'}`}
          title="Siguiente cita"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
        </button>

      </div>
    </div>
  );
}
