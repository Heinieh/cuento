import React from 'react';
import { motion } from 'framer-motion';

export const LuminaSVG: React.FC = () => (
  <motion.svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,100,0.8)] overflow-visible">
    {/* Alas traseras */}
    <motion.path 
      d="M50 40 Q 20 10, 10 30 Q 30 50, 50 40" 
      fill="#aaddff" opacity="0.6"
      animate={{ rotate: [-10, 10, -10], originX: "50px", originY: "40px" }}
      transition={{ repeat: Infinity, duration: 0.2 }}
    />
    <motion.path 
      d="M50 40 Q 80 10, 90 30 Q 70 50, 50 40" 
      fill="#aaddff" opacity="0.6"
      animate={{ rotate: [10, -10, 10], originX: "50px", originY: "40px" }}
      transition={{ repeat: Infinity, duration: 0.2 }}
    />
    
    {/* Cuerpo luminoso */}
    <circle cx="50" cy="60" r="25" fill="url(#gradLumina)" />
    
    {/* Cabeza */}
    <circle cx="50" cy="35" r="18" fill="#ffcc00" />
    
    {/* Ojos */}
    <circle cx="43" cy="32" r="3" fill="#000" />
    <circle cx="57" cy="32" r="3" fill="#000" />
    
    {/* Sonrisa */}
    <path d="M45 40 Q50 45 55 40" stroke="#000" strokeWidth="2" fill="transparent" />

    {/* Antenas */}
    <path d="M43 17 Q 35 10, 30 15" stroke="#000" strokeWidth="2" fill="transparent" />
    <path d="M57 17 Q 65 10, 70 15" stroke="#000" strokeWidth="2" fill="transparent" />
    <circle cx="30" cy="15" r="3" fill="#ffaa00" />
    <circle cx="70" cy="15" r="3" fill="#ffaa00" />

    <defs>
      <radialGradient id="gradLumina" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffaa" />
        <stop offset="70%" stopColor="#ffaa00" />
        <stop offset="100%" stopColor="#ff8800" />
      </radialGradient>
    </defs>
  </motion.svg>
);
