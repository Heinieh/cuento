import React from 'react';
import { motion } from 'framer-motion';

export const SapitoSVG: React.FC = () => (
  <motion.svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-xl">
    {/* Patas traseras */}
    <path d="M15 80 Q 5 70, 10 90 Q 20 95, 30 90" fill="#4ade80" />
    <path d="M85 80 Q 95 70, 90 90 Q 80 95, 70 90" fill="#4ade80" />
    
    {/* Cuerpo principal */}
    <ellipse cx="50" cy="70" rx="35" ry="25" fill="#22c55e" />
    <ellipse cx="50" cy="75" rx="25" ry="15" fill="#86efac" /> {/* Barriga */}

    {/* Cabeza */}
    <ellipse cx="50" cy="45" rx="30" ry="20" fill="#22c55e" />

    {/* Ojos saltones */}
    <circle cx="35" cy="30" r="12" fill="#22c55e" />
    <circle cx="65" cy="30" r="12" fill="#22c55e" />
    <circle cx="35" cy="30" r="8" fill="#fff" />
    <circle cx="65" cy="30" r="8" fill="#fff" />
    
    {/* Pupilas (animadas para parpadear) */}
    <motion.circle 
      cx="35" cy="30" r="4" fill="#000"
      animate={{ scaleY: [1, 0.1, 1] }}
      transition={{ repeat: Infinity, duration: 4, times: [0, 0.1, 0.2] }}
    />
    <motion.circle 
      cx="65" cy="30" r="4" fill="#000"
      animate={{ scaleY: [1, 0.1, 1] }}
      transition={{ repeat: Infinity, duration: 4, times: [0, 0.1, 0.2] }}
    />

    {/* Patas delanteras */}
    <path d="M40 85 Q 35 95, 30 95" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" />
    <path d="M60 85 Q 65 95, 70 95" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" />

    {/* Sonrisa (animable) */}
    <motion.path 
      d="M35 50 Q 50 60, 65 50" 
      stroke="#064e3b" strokeWidth="3" fill="transparent" strokeLinecap="round"
      animate={{ d: ["M35 50 Q 50 60, 65 50", "M35 52 Q 50 65, 65 52", "M35 50 Q 50 60, 65 50"] }}
      transition={{ repeat: Infinity, duration: 2 }}
    />
    
    {/* Mejillas sonrojadas */}
    <ellipse cx="30" cy="50" rx="4" ry="2" fill="#fca5a5" opacity="0.6" />
    <ellipse cx="70" cy="50" rx="4" ry="2" fill="#fca5a5" opacity="0.6" />
  </motion.svg>
);
