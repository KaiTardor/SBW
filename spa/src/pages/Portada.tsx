import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Portada() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex-grow flex flex-col items-center bg-[#f8f5f0] overflow-y-auto">
      {/* Hero Section */}
      <div className="hero bg-base-200 py-16 md:py-24 w-full relative" style={{ backgroundImage: 'linear-gradient(to right, rgba(248, 245, 240, 1) 0%, rgba(248, 245, 240, 0.7) 100%), url(http://localhost:3000/public/imagenes/granada.jpg)' }}>
        <div className="hero-content text-center py-10 z-10 relative">
          <div className="max-w-3xl bg-white/60 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-white/50">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#333] mb-6 tracking-wide drop-shadow-sm">El Legado Clásico</h1>
            <p className="py-6 text-lg text-gray-800 font-serif leading-relaxed mb-4">
              Sumérgete en la estética grecorromana y descubre cómo las formas clásicas inspiraron 
              las grandes obras del Renacimiento y Barroco. Explora la simetría, la proporción y el mito.
            </p>
            <Link to="/carrusel" className="btn btn-outline border-[#8b6914] text-[#8b6914] hover:bg-[#8b6914] hover:border-[#8b6914] hover:text-white font-serif tracking-widest rounded-none px-8 py-3 text-lg transition-all shadow-md">
              Visitar Colección
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs Section con DaisyUI */}
      <div className="w-full max-w-5xl px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-[#333] tracking-widest uppercase mb-4">Salas de Exposición</h2>
          <div className="h-px w-24 bg-[#8b6914] mx-auto"></div>
        </div>

        <div role="tablist" className="tabs tabs-bordered w-full justify-center border-b border-gray-300">
          <button 
            role="tab" 
            className={`tab tab-lg font-serif text-lg md:text-xl transition-all ${activeTab === 0 ? 'tab-active font-bold text-[#8b6914] border-b-2 border-[#8b6914] !border-opacity-100' : 'text-gray-500 hover:text-gray-800'}`}
            onClick={() => setActiveTab(0)}
          >
            Escultura
          </button>
          <button 
            role="tab" 
            className={`tab tab-lg font-serif text-lg md:text-xl transition-all ${activeTab === 1 ? 'tab-active font-bold text-[#8b6914] border-b-2 border-[#8b6914] !border-opacity-100' : 'text-gray-500 hover:text-gray-800'}`}
            onClick={() => setActiveTab(1)}
          >
            Pintura Clásica
          </button>
          <button 
            role="tab" 
            className={`tab tab-lg font-serif text-lg md:text-xl transition-all ${activeTab === 2 ? 'tab-active font-bold text-[#8b6914] border-b-2 border-[#8b6914] !border-opacity-100' : 'text-gray-500 hover:text-gray-800'}`}
            onClick={() => setActiveTab(2)}
          >
            Mitología
          </button>
        </div>

        <div className="mt-12 bg-white p-8 md:p-12 shadow-2xl rounded-sm border border-[#e0dcd0] min-h-[350px] relative overflow-hidden group">
          {activeTab === 0 && (
            <div className="flex flex-col md:flex-row gap-10 items-center animate-fade-in">
              <div className="w-full md:w-5/12 flex justify-center">
                <img src="http://localhost:3000/public/imagenes/cartel__el_caballero_de_la_mano_en_el_pecho_.jpg" alt="Augusto de Prima Porta" className="shadow-lg object-cover aspect-[3/4] w-full max-w-sm rounded-sm" />
              </div>
              <div className="w-full md:w-7/12">
                <h2 className="text-3xl font-serif text-[#333] mb-6 border-l-4 border-[#8b6914] pl-4">La Majestuosidad del Mármol</h2>
                <p className="text-gray-700 leading-relaxed font-serif text-lg mb-6">
                  La escultura clásica destaca por su realismo idealizado y su profundo interés en el retrato de la anatomía y la propaganda imperial. 
                  Explora las copias romanas de originales griegos perdidos y descubre cómo el mármol cobró vida.
                </p>
                <button className="btn btn-sm btn-ghost text-[#8b6914] hover:bg-[#f8f5f0] px-0 uppercase tracking-widest font-bold">Descubrir estatuas &rarr;</button>
              </div>
            </div>
          )}
          {activeTab === 1 && (
            <div className="flex flex-col md:flex-row gap-10 items-center animate-fade-in">
              <div className="w-full md:w-7/12 order-2 md:order-1">
                <h2 className="text-3xl font-serif text-[#333] mb-6 border-l-4 border-[#8b6914] pl-4">El Triunfo del Color</h2>
                <p className="text-gray-700 leading-relaxed font-serif text-lg mb-6">
                  Desde los frescos pompeyanos hasta las grandes telas del Renacimiento que imitaron la antigüedad. 
                  Un viaje visual a través de la perspectiva perfecta y la armonía clásica que redefinió la estética occidental.
                </p>
                <button className="btn btn-sm btn-ghost text-[#8b6914] hover:bg-[#f8f5f0] px-0 uppercase tracking-widest font-bold">Ver pinturas &rarr;</button>
              </div>
              <div className="w-full md:w-5/12 order-1 md:order-2 flex justify-center">
                <img src="http://localhost:3000/public/imagenes/cartel__la_rendici_n_de_breda_o_las_lanzas_.jpg" alt="La Rendición de Breda" className="shadow-lg w-full object-cover aspect-video rounded-sm" />
              </div>
            </div>
          )}
          {activeTab === 2 && (
            <div className="flex flex-col items-center animate-fade-in w-full">
              <h2 className="text-3xl font-serif text-[#333] mb-8 border-b-2 border-[#8b6914] pb-2 inline-block">Mitos que Perduran</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                
                <div className="card bg-white shadow-md border border-[#e0dcd0] rounded-none hover:shadow-xl transition-shadow cursor-pointer group/card">
                  <figure className="px-4 pt-4 overflow-hidden"><img src="http://localhost:3000/public/imagenes/cartel__saturno_.jpg" alt="Ícaro" className="aspect-[4/3] object-cover w-full transform group-hover/card:scale-105 transition-transform duration-500" /></figure>
                  <div className="card-body items-center text-center p-6">
                    <h2 className="card-title font-serif text-xl">Saturno</h2>
                    <p className="text-sm text-gray-500 italic mt-2">F. Goya</p>
                  </div>
                </div>
                
                <div className="card bg-white shadow-md border border-[#e0dcd0] rounded-none hover:shadow-xl transition-shadow cursor-pointer group/card">
                  <figure className="px-4 pt-4 overflow-hidden"><img src="http://localhost:3000/public/imagenes/cartel__lucha_de_san_jorge_y_el_drag_n_.jpg" alt="Vulcano" className="aspect-[4/3] object-cover w-full transform group-hover/card:scale-105 transition-transform duration-500" /></figure>
                  <div className="card-body items-center text-center p-6">
                    <h2 className="card-title font-serif text-xl">Lucha de San Jorge</h2>
                    <p className="text-sm text-gray-500 italic mt-2">P.P. Rubens</p>
                  </div>
                </div>
                
                <div className="card bg-white shadow-md border border-[#e0dcd0] rounded-none hover:shadow-xl transition-shadow cursor-pointer group/card">
                  <figure className="px-4 pt-4 overflow-hidden"><img src="http://localhost:3000/public/imagenes/cartel__el_paso_de_la_laguna_estigia_.jpg" alt="Juicio Paris" className="aspect-[4/3] object-cover w-full transform group-hover/card:scale-105 transition-transform duration-500" /></figure>
                  <div className="card-body items-center text-center p-6">
                    <h2 className="card-title font-serif text-xl">Laguna Estigia</h2>
                    <p className="text-sm text-gray-500 italic mt-2">J. Patinir</p>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
