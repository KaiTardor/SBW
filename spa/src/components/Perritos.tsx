import { useState, useEffect } from 'react';

export default function Perritos() {
  const [dogUrl, setDogUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDog = () => {
    setLoading(true);
    fetch('https://dog.ceo/api/breeds/image/random')
      .then(res => res.json())
      .then(data => {
        setDogUrl(data.message);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar perrito", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDog();
  }, []);

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-xl w-80">
      <h3 className="font-bold text-xl mb-4 text-center">Perrito Aleatorio</h3>
      
      <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden mb-6">
        {loading ? (
          <p className="text-gray-500 animate-pulse">Buscando perrito...</p>
        ) : (
          <img src={dogUrl} alt="Perrito aleatorio" className="w-full h-full object-cover" />
        )}
      </div>

      <button 
        onClick={fetchDog}
        className="font-bold cursor-pointer bg-blue-300 px-6 py-3 rounded-2xl hover:bg-blue-400 text-slate-800 transition-colors shadow-sm"
      >
        ¡Guau! 🐶
      </button>
    </div>
  );
}
