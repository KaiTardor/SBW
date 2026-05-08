import Inspiracion from '../components/Inspiracion.tsx'
import Cuadros from '../components/Cuadros.tsx'

export default function Tarea9() {
  return (
    <div className="flex flex-col md:flex-row flex-grow w-full h-full bg-[#f8f5f0]">
      {/* Panel Izquierdo: Galería Prado (Maestro) */}
      <div className="w-full md:w-[55%] flex-[1_1_50%] md:flex-[0_0_55%] border-b md:border-b-0 md:border-r border-[#e0dcd0] bg-white flex flex-col items-center justify-center relative p-4 md:p-8 shadow-2xl z-10 overflow-hidden">
        <Cuadros />
      </div>
      
      {/* Panel Derecho: Citas de Arte (Detalle) */}
      <div 
        className="w-full md:w-[45%] flex-[1_1_50%] md:flex-[0_0_45%] flex items-center justify-center p-4 md:p-8 relative bg-cover bg-center overflow-auto"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(248, 245, 240, 1) 0%, rgba(248, 245, 240, 0.85) 100%), url('http://localhost:3000/public/imagenes/granada.jpg')"
        }}
      >
        <Inspiracion />
      </div>
    </div>
  )
}
