import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

const SLIDES = [
  { id: 1, img: 'http://localhost:3000/public/imagenes/cartel__fusilamiento_de_torrijos_y_sus_compa_eros_en_las_playas_de_m_laga_.jpg', title: 'Fusilamiento de Torrijos', artist: 'Antonio Gisbert' },
  { id: 2, img: 'http://localhost:3000/public/imagenes/cartel__las_meninas__o__la_familia_de_felipe_iv_.jpg', title: 'Las Meninas', artist: 'Diego Velázquez' },
  { id: 3, img: 'http://localhost:3000/public/imagenes/cartel__el_jard_n_de_las_delicias_.jpg', title: 'El Jardín de las Delicias', artist: 'El Bosco' },
  { id: 4, img: 'http://localhost:3000/public/imagenes/cartel__el_caballero_de_la_mano_en_el_pecho_.jpg', title: 'El caballero de la mano en el pecho', artist: 'El Greco' },
];

export default function Carrusel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="flex flex-col items-center justify-center flex-grow bg-[#f8f5f0] py-12 overflow-y-auto">
      
      <div className="text-center mb-12 px-4">
        <h2 className="text-4xl md:text-5xl font-serif text-[#333] mb-6 tracking-wide">Obras Maestras Destacadas</h2>
        <div className="w-24 h-[2px] bg-[#8b6914] mx-auto"></div>
        <p className="mt-6 text-gray-600 font-serif text-lg max-w-2xl mx-auto">
          Explora algunas de las piezas más icónicas de nuestra colección a través de esta galería interactiva. 
          Desliza para descubrir los tesoros del museo.
        </p>
      </div>

      <div className="relative w-full max-w-6xl mx-auto px-4 md:px-16">
        
        {/* Embla Viewport */}
        <div className="overflow-hidden py-8" ref={emblaRef}>
          <div className="flex touch-pan-y items-center">
            {SLIDES.map((slide, index) => (
              <div className="flex-[0_0_100%] min-w-0 md:flex-[0_0_65%] lg:flex-[0_0_55%] pl-4 pr-4" key={slide.id}>
                
                <div className={`relative aspect-[4/3] md:aspect-video transition-[transform,opacity,filter] duration-700 ease-in-out shadow-2xl rounded-sm overflow-hidden bg-white
                  ${index === selectedIndex ? 'opacity-100 scale-100 z-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-[#e0dcd0] grayscale-0' : 'opacity-40 scale-[0.85] z-0 grayscale-[30%]'}`}>
                  
                  <img src={slide.img} alt={slide.title} className="w-full h-full object-cover p-2 md:p-4 bg-white" />
                  
                  {/* Overlay gradiente */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 md:p-8 flex flex-col justify-end text-white transition-opacity duration-700
                    ${index === selectedIndex ? 'opacity-100' : 'opacity-0'}`}>
                    <h3 className="text-2xl md:text-4xl font-serif mb-2 text-shadow-sm">{slide.title}</h3>
                    <p className="text-sm md:text-lg text-gray-300 font-serif tracking-widest uppercase border-l-2 border-[#d4af37] pl-3 mt-2">{slide.artist}</p>
                  </div>

                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Botones de navegación personalizados */}
        <button 
          className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/80 backdrop-blur-sm shadow-xl flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 text-[#8b6914] border border-[#e0dcd0] z-20"
          onClick={scrollPrev}
          aria-label="Obra anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>
        
        <button 
          className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/80 backdrop-blur-sm shadow-xl flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 text-[#8b6914] border border-[#e0dcd0] z-20"
          onClick={scrollNext}
          aria-label="Siguiente obra"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>

      </div>
    </div>
  );
}
