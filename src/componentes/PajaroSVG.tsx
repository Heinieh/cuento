import React from 'react';
import { motion } from 'framer-motion';

export const PajaroSVG: React.FC = () => (
  <motion.svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-xl">
    {/* Patas */}
    <path d="M40 80 L 35 95" stroke="#78350f" strokeWidth="3" />
    <path d="M60 80 L 65 95" stroke="#78350f" strokeWidth="3" />
    <path d="M30 95 L 40 95" stroke="#78350f" strokeWidth="3" />
    <path d="M60 95 L 70 95" stroke="#78350f" strokeWidth="3" />

    {/* Cola */}
    <path d="M20 60 Q 5 70, 10 80 Q 25 70, 30 65" fill="#1e3a8a" />
    <path d="M15 65 Q 0 75, 5 85 Q 20 75, 25 70" fill="#3b82f6" />

    {/* Cuerpo */}
    <ellipse cx="50" cy="65" rx="25" ry="20" fill="#fca5a5" />
    <ellipse cx="55" cy="65" rx="15" ry="15" fill="#fef08a" /> {/* Pecho */}

    {/* Ala animada */}
    <motion.path 
      d="M40 60 Q 30 80, 50 75 Q 60 65, 45 55" 
      fill="#ef4444"
      animate={{ rotate: [0, 10, 0], originX: "45px", originY: "55px" }}
      transition={{ repeat: Infinity, duration: 1 }}
    />

    {/* Cabeza */}
    <circle cx="65" cy="40" r="18" fill="#fca5a5" />
    
    {/* Cresta roja característica del carpintero */}
    <path d="M55 25 Q 65 10, 75 25 Q 70 30, 60 28" fill="#dc2626" />
    <path d="M50 30 Q 60 15, 70 30" fill="#dc2626" />

    {/* Ojo */}
    <circle cx="70" cy="38" r="6" fill="#fff" />
    <motion.circle 
      cx="72" cy="38" r="2.5" fill="#000"
      animate={{ scaleY: [1, 0.1, 1] }}
      transition={{ repeat: Infinity, duration: 3.5, times: [0, 0.1, 0.2] }}
    />

    {/* Pico (Animado para picotear si se desea, pero aquí lo dejamos estático o con sutil rotación) */}
    <motion.path 
      d="M82 40 L 98 42 L 80 46 Z" 
      fill="#f59e0b"
      animate={{ rotate: [0, -5, 0], originX: "80px", originY: "43px" }}
      transition={{ repeat: Infinity, duration: 0.2 }}
    />
  </motion.svg>
);
