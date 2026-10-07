import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Iconos from 'lucide-react';
import type { EscenaCuento, OpcionInteraccion } from './tiposCuento';
import { useReproductorAudio } from './useReproductorAudio';
import { LuminaSVG } from '../componentes/LuminaSVG';
import { LuminaLottie } from '../componentes/LuminaLottie';
import { SapitoSVG } from '../componentes/SapitoSVG';
import { PajaroSVG } from '../componentes/PajaroSVG';

const MapaComponentes: Record<string, React.FC> = {
  lumina: LuminaSVG,
  lumina_lottie: LuminaLottie,
  sapito: SapitoSVG,
  pajaro: PajaroSVG,
};

interface PropiedadesLienzo {
  escena: EscenaCuento;
  alSeleccionarOpcion: (opcion: OpcionInteraccion, latenciaMs: number, reintentos: number) => void;
}

export const LienzoCuento: React.FC<PropiedadesLienzo> = ({ escena, alSeleccionarOpcion }) => {
  const [interaccionBloqueada, setInteraccionBloqueada] = useState(true);
  const [horaHabilitacion, setHoraHabilitacion] = useState<number>(0);
  const [reintentos, setReintentos] = useState(0);

  const { reproducirFeedback } = useReproductorAudio(
    escena.audioAmbiente,
    escena.audioVozNarrador
  );

  useEffect(() => {
    setInteraccionBloqueada(true);
    setReintentos(0);

    const temporizador = setTimeout(() => {
      setInteraccionBloqueada(false);
      setHoraHabilitacion(Date.now());
    }, escena.tiempoBloqueoMs);

    return () => clearTimeout(temporizador);
  }, [escena]);

  const manejarClicOpcion = (opcion: OpcionInteraccion) => {
    if (interaccionBloqueada) {
      setReintentos((prev) => prev + 1);
      // Feedback visual/auditivo sutil de que está bloqueado podría ir aquí
      return;
    }

    const latenciaMs = Date.now() - horaHabilitacion;
    reproducirFeedback(opcion.audioFeedback);
    alSeleccionarOpcion(opcion, latenciaMs, reintentos);
  };

  const manejarClicFondo = () => {
    if (interaccionBloqueada) {
      setReintentos((prev) => prev + 1);
    }
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden bg-black select-none"
      onClick={manejarClicFondo}
    >
      {/* Fondo con leve zoom tipo Ken Burns */}
      <AnimatePresence mode="wait">
        <motion.img
          key={escena.imagenFondo}
          src={escena.imagenFondo}
          alt="Fondo de la escena"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </AnimatePresence>

      {/* Objetos Interactivos Arrastrables / Animados */}
      {escena.objetosInteractivos?.map((obj) => {
        const Contenido = obj.tipoRender === 'componente' && obj.componenteId && MapaComponentes[obj.componenteId]
          ? MapaComponentes[obj.componenteId]
          : 'img';

        return (
          <motion.div
            key={obj.id}
            drag={obj.arrastrable}
            dragConstraints={{ top: -400, left: -800, right: 800, bottom: 400 }}
            dragElastic={0.2}
            whileDrag={{ scale: 1.2, cursor: 'grabbing', filter: 'drop-shadow(0px 20px 30px rgba(0,0,0,0.6))' }}
            className={`absolute z-10 ${obj.tamaño || 'w-1/4 h-auto'} ${obj.arrastrable ? 'cursor-grab' : ''}`}
            style={{
              top: obj.posicionInicial.top,
              left: obj.posicionInicial.left,
              transform: 'translate(-50%, -50%)',
              touchAction: 'none'
            }}
            animate={
              obj.animacionBase === 'flotar'
                ? { y: [0, -20, 0] }
                : obj.animacionBase === 'pulso'
                ? { scale: [1, 1.05, 1] }
                : obj.animacionBase === 'respirar'
                ? { scaleY: [1, 1.02, 1], scaleX: [1, 1.05, 1] }
                : {}
            }
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            {obj.tipoRender === 'componente' ? (
              // @ts-ignore
              <Contenido />
            ) : (
              <img src={obj.imagen} alt={obj.id} className="w-full h-full object-contain drop-shadow-2xl" />
            )}
          </motion.div>
        );
      })}

      {/* Indicador de "Escuchando" (Control Inhibitorio) */}
      <AnimatePresence>
        {interaccionBloqueada && escena.tiempoBloqueoMs > 0 && (
          <motion.div
            className="absolute top-8 right-8 flex items-center space-x-2 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Iconos.Volume2 className="w-6 h-6 animate-pulse text-blue-300" />
            <span className="text-xl font-bold tracking-wider">Escuchando...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Opciones Interactivas */}
      {escena.tipoInteraccion === 'decision_simple' && (
        <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-12 px-8">
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
