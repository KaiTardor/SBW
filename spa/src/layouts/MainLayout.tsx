import { Outlet, Link, useLocation } from 'react-router-dom';

export default function MainLayout() {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    return `btn btn-ghost rounded-none ${location.pathname === path ? 'border-b-2 border-[#8b6914] text-[#8b6914] font-bold bg-transparent hover:bg-transparent' : 'text-gray-600 font-normal hover:bg-gray-100'}`;
  };

  return (
    <div className="min-h-screen flex flex-col font-montserrat bg-[#f9f9f9]">
      <div className="navbar bg-white shadow-sm border-b border-[#e0dcd0] px-4 md:px-12 sticky top-0 z-50">
        <div className="flex-1">
          <Link to="/" className="text-xl font-serif text-[#333] tracking-widest uppercase hover:text-[#8b6914] transition-colors">
            🏛️ Museo Virtual
          </Link>
        </div>
        <div className="flex-none gap-2">
          <ul className="menu menu-horizontal px-1 font-serif text-base gap-2">
            <li><Link to="/" className={getLinkClass('/')}>Portada</Link></li>
            <li><Link to="/carrusel" className={getLinkClass('/carrusel')}>Colección de Obras</Link></li>
            <li><Link to="/tarea9" className={getLinkClass('/tarea9')}>Tienda Prado</Link></li>
          </ul>
        </div>
      </div>
      
      {/* Contenido dinámico */}
      <main className="flex-grow flex flex-col relative overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
