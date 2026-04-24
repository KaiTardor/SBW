import { useState, useEffect } from 'react';
import useSWR from 'swr';

const url = 'http://localhost:3000/api/productos/random';
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Cuadros() {
  const [progress, setProgress] = useState(0);
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false
  });
  
  // Temporizador para la barra de progreso (10s)
  useEffect(() => {
    setProgress(0); // Reiniciar al cargar nueva obra
    if (isLoading || error) return;

    const duration = 10000;
    const intervalTime = 100;
    const step = (intervalTime / duration) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          mutate();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [mutate, data, isLoading, error]);

  return (
    <div className="w-full h-full max-w-2xl flex flex-col items-center justify-center relative group py-4">
      
      <div className="text-center mb-4 flex-shrink-0">
        <h2 className="text-xl md:text-2xl text-[#333] tracking-[0.2em] uppercase font-serif">Galería</h2>
        <div className="h-px w-12 bg-[#d4af37] mx-auto mt-2 md:mt-4"></div>
      </div>
      
      {/* Contenedor flexible para la imagen que evita que se pase del alto de la pantalla */}
      <div className="relative w-full flex-grow min-h-0 shadow-xl rounded-sm overflow-hidden bg-gray-50 transition-transform duration-700 hover:scale-[1.02] mb-4 flex items-center justify-center">
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center absolute inset-0">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-[#d4af37] rounded-full animate-spin mb-4"></div>
            <span className="text-gray-400 font-serif text-sm italic">Preparando sala...</span>
          </div>
        ) : error ? (
          <div className="w-full h-full flex items-center justify-center absolute inset-0">
            <p className="text-red-500 font-serif">Obra no disponible</p>
          </div>
        ) : data ? (
          <a href={`http://localhost:3000/producto/${data.id}`} className="absolute inset-0 block cursor-pointer group/link" title="Ver en la Tienda">
            <img 
              src={data.imagen} 
              alt={data.titulo} 
              className="w-full h-full object-contain p-2 bg-white"
            />
            {/* CORRECCIÓN CUADRADO NEGRO */}
            <div className="absolute inset-0 bg-black/0 group-hover/link:bg-black/5 transition-all duration-300 flex items-center justify-center">
                <span className="bg-white/90 text-black text-xs uppercase tracking-widest px-4 py-2 opacity-0 group-hover/link:opacity-100 transition-opacity transform translate-y-2 group-hover/link:translate-y-0 shadow-sm">
                    Ver detalles
                </span>
            </div>
          </a>
        ) : null}
        
        {/* Botón Actualizar */}
        <button 
          onClick={() => mutate()}
          className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-white transition-all text-gray-800 opacity-0 group-hover:opacity-100 z-10 border border-gray-100 hover:scale-110"
          title="Siguiente obra manual"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.92-10.26l1.08 1.19"/></svg>
        </button>
      </div>

      <div className="text-center w-full flex-shrink-0 h-[60px] md:h-[80px]">
        {data && !isLoading && !error ? (
          <>
            <h3 className="font-serif text-lg md:text-xl text-gray-800 leading-tight mb-1 line-clamp-2" title={data.titulo}>{data.titulo}</h3>
            <p className="text-sm md:text-md font-bold text-[#8b6914]">{parseFloat(data.precio).toFixed(2).replace('.', ',')} €</p>
          </>
        ) : (
          <div className="h-full"></div>
        )}
      </div>
      
      {/* Barra de progreso inferior */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 overflow-hidden">
        <div 
          className="h-full bg-[#d4af37] transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
