import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navigation() {
  const links = [
    { to: '/', label: '首頁' },
    { to: '/upload', label: '上傳' },
    { to: '/manual', label: '手動輸入' },
    { to: '/history', label: '歷史' },
    { to: '/stats', label: '統計' },
  ];

  return (
    <nav className="bg-dune-deep/90 backdrop-blur-md border-b border-dune-sand/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-2xl font-orbitron font-bold text-dune-spice">DUNE STATS</h1>
          <div className="flex gap-4">
            {links.map(link => (
              <NavLink key={link.to} to={link.to}>
                {({ isActive }) => (
                  <motion.span
                    className={`px-4 py-2 rounded-lg font-rajdhani font-semibold ${ isActive ? 'bg-dune-spice text-white' : 'text-dune-sand hover:bg-dune-sky'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {link.label}
                  </motion.span>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
