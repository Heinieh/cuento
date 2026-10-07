import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Iconos from 'lucide-react';
import type { EscenaCuento, OpcionInteraccion } from './tiposCuento';
import { useReproductorAudio } from './useReproductorAudio';

interface PropiedadesLienzo {
  escena: EscenaCuento;
  alSeleccionarOpcion: (opcion: OpcionInteraccion, latenciaMs: number, reintentos: number) => void;
}

export const LienzoVideo: React.FC<PropiedadesLienzo> = ({ escena, alSeleccionarOpcion }) => {
  const [interaccionBloqueada, setInteraccionBloqueada] = useState(true);
  const [horaHabilitacion, setHoraHabilitacion] = useState<number>(0);
  const [reintentos, setReintentos] = useState(0);
  
  // Estado del bucle
  const [enBucle, setEnBucle] = useState(false);
  const limitesBucle = useRef({ inicio: 0, fin: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);

  const { reproducirFeedback, pausarTodo, reanudarTodo } = useReproductorAudio(
    escena.audioAmbiente,
    escena.audioVozNarrador
  );

  useEffect(() => {
    setInteraccionBloqueada(true);
    setReintentos(0);
    setEnBucle(false);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(e => console.log('Auto-play prevent', e));
    }

    const temporizador = setTimeout(() => {
      setInteraccionBloqueada(false);
      setHoraHabilitacion(Date.now());
    }, escena.tiempoBloqueoMs);

    return () => clearTimeout(temporizador);
  }, [escena]);

  const alternarReproduccion = () => {
    if (!videoRef.current) return;
    
    if (enBucle) {
      // Salir del bucle y reanudar
      setEnBucle(false);
      reanudarTodo();
    } else {
      // Pausa manual de la docente: bucle de los siguientes 2 segundos
      const tiempoActual = videoRef.current.currentTime;
      // Nos aseguramos de no pasarnos de la duración total
      const duration = videoRef.current.duration || 2;
      const fin = Math.min(tiempoActual + 2, duration);
      
      limitesBucle.current = { inicio: tiempoActual, fin };
      setEnBucle(true);
      pausarTodo();
    }
  };

  const handleTimeUpdate = () => {
    if (enBucle && videoRef.current) {
      if (videoRef.current.currentTime >= limitesBucle.current.fin) {
        videoRef.current.currentTime = limitesBucle.current.inicio;
      }
    }
  };

  const handleVideoEnded = () => {
    if (!videoRef.current) return;
    // Cuando el video termina de forma natural, en lugar de repetir desde 0 (que repetiría la entrada del personaje),
    // atrapamos el video en un bucle de los últimos 2 segundos.
    const duration = videoRef.current.duration;
    const inicio = Math.max(0, duration - 2);
    
    limitesBucle.current = { inicio, fin: duration };
    setEnBucle(true);
    videoRef.current.currentTime = inicio;
    videoRef.current.play(); // Forzar que siga reproduciendo el bucle final
  };

  const manejarClicOpcion = (opcion: OpcionInteraccion) => {
    if (interaccionBloqueada) {
      setReintentos((prev) => prev + 1);
      return;
    }

    const latenciaMs = Date.now() - horaHabilitacion;
    reproducirFeedback(opcion.audioFeedback);
    alSeleccionarOpcion(opcion, latenciaMs, reintentos);
  };

  const necesitaOscurecer = escena.id.includes('reto1');

  return (
    <div className="relative w-full h-full overflow-hidden bg-black select-none">
      
      {/* Capa de video */}
      <AnimatePresence mode="wait">
        {escena.videoFondo ? (
          <motion.video
            key={`vid-${escena.id}`}
            ref={videoRef}
            src={escena.videoFondo}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              filter: necesitaOscurecer ? 'brightness(0.75) saturate(0.8) hue-rotate(10deg)' : 'none',
              transition: 'filter 2s ease-in-out'
            }}
            // ¡Quitamos el loop! Lo manejamos con onEnded para que no repita la entrada
            autoPlay
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        ) : (
          <motion.img
            key={`img-${escena.id}`}
            src={escena.imagenFondo}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          />
        )}
      </AnimatePresence>

      {/* Capa invisible para atrapar los clics de pausa/reproducción táctil de la docente */}
      <div 
        className="absolute inset-0 z-0 cursor-pointer" 
        onClick={alternarReproduccion}
      />

      {/* Indicador de "Escuchando" MUY sutil */}
      <AnimatePresence>
        {interaccionBloqueada && escena.tiempoBloqueoMs > 0 && !enBucle && (
          <motion.div
            className="absolute top-4 right-4 flex items-center space-x-2 text-white/50 px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Iconos.Volume2 className="w-4 h-4 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Opciones Interactivas VISIBLES (Restauradas) */}
      {escena.tipoInteraccion === 'decision_simple' && (
        <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-12 px-8 z-20 pointer-events-none">
          {escena.opciones.map((opcion) => {
            const IconoComponente = (Iconos as any)[opcion.icono] || Iconos.HelpCircle;
            return (
              <motion.button
                key={opcion.id}
                onClick={(e) => {
                  e.stopPropagation();
                  manejarClicOpcion(opcion);
                }}
                disabled={interaccionBloqueada}
                className={`
                  pointer-events-auto
                  flex flex-col items-center justify-center 
                  w-48 h-48 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] 
                  border-4 border-white backdrop-blur-md transition-all
                  ${interaccionBloqueada ? 'opacity-40 grayscale cursor-not-allowed bg-gray-500/50' : 'opacity-100 cursor-pointer bg-white/80 hover:scale-105 hover:bg-white active:scale-95 active:shadow-inner'}
                `}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: interaccionBloqueada ? 0.4 : 1, y: 0 }}
                transition={{ delay: interaccionBloqueada ? 0 : 0.2 }}
                aria-label={opcion.textoDescriptivo}
              >
                <IconoComponente 
                  className={`w-24 h-24 mb-4 ${opcion.icono === 'Heart' ? 'text-rose-500' : opcion.icono === 'BellRing' ? 'text-amber-500' : 'text-slate-700'}`} 
                />
                <span className="text-xl font-bold text-slate-800 text-center leading-tight">
                  {opcion.textoDescriptivo}
                </span>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
};
