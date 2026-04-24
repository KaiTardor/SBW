import Inspiracion from './components/Inspiracion.tsx'
import Cuadros from './components/Cuadros.tsx'

function App() {
  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-[#f8f5f0] font-montserrat">
      {/* Panel Izquierdo: Galería Prado (Maestro) */}
      <div className="w-full md:w-[55%] h-full border-r border-[#e0dcd0] bg-white flex flex-col items-center justify-center relative p-4 md:p-8 shadow-2xl z-10 overflow-hidden">
        <Cuadros />
      </div>
      
      {/* Panel Derecho: Citas de Arte (Detalle) */}
      <div 
        className="w-full md:w-[45%] h-full flex items-center justify-center p-4 md:p-8 relative bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(248, 245, 240, 1) 0%, rgba(248, 245, 240, 0.85) 100%), url('https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Museo_del_Prado_2016_%282%29.jpg/1200px-Museo_del_Prado_2016_%282%29.jpg')"
        }}
      >
        <Inspiracion />
      </div>
    </div>
  )
}

export default App
