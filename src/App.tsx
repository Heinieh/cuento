import { useState, useEffect } from 'react';
import { LienzoCuento } from './motor/LienzoCuento';
import { LienzoVideo } from './motor/LienzoVideo';
import { sesion1 } from './datos/sesion1.datos';
import type { OpcionInteraccion } from './motor/tiposCuento';

interface RegistroMetrica {
  timestamp: string;
  idEscena: string;
  idOpcion: string;
  latenciaMs: number;
  reintentosBloqueados: number;
}

export default function App() {
  const [iniciado, setIniciado] = useState(false);
  const [modoCuento, setModoCuento] = useState<'controles' | 'video'>('video');
  const [idEscenaActual, setIdEscenaActual] = useState(sesion1.escenaInicial);
  const [metricas, setMetricas] = useState<RegistroMetrica[]>([]);

  // Escalar para forzar 16:9
  useEffect(() => {
    const ajustarEscala = () => {
      const contenedor = document.getElementById('contenedor-16-9');
      if (!contenedor) return;

      const windowRatio = window.innerWidth / window.innerHeight;
      const targetRatio = 16 / 9;

      let scale = 1;
      if (windowRatio < targetRatio) {
        // Pantalla más estrecha (ej. tablet vertical o monitor 4:3), ajustar por ancho
        scale = window.innerWidth / 1920;
      } else {
        // Pantalla más ancha, ajustar por alto
        scale = window.innerHeight / 1080;
      }

      contenedor.style.transform = `scale(${scale})`;
    };

    window.addEventListener('resize', ajustarEscala);
    ajustarEscala();

    return () => window.removeEventListener('resize', ajustarEscala);
  }, []);

  const manejarInicio = () => {
    // Es buena práctica inicializar audio con un gesto del usuario
    setIniciado(true);
    // Solicitar pantalla completa
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((e) => console.log('Error full screen:', e));
    }
  };

  const manejarSeleccionOpcion = (opcion: OpcionInteraccion, latenciaMs: number, reintentos: number) => {
    // Registrar métrica
    const nuevaMetrica: RegistroMetrica = {
      timestamp: new Date().toISOString(),
      idEscena: idEscenaActual,
      idOpcion: opcion.id,
      latenciaMs,
      reintentosBloqueados: reintentos
    };

    setMetricas((prev) => [...prev, nuevaMetrica]);

    // Cambiar escena
    if (opcion.idEscenaDestino) {
      setIdEscenaActual(opcion.idEscenaDestino);
    }
  };

  const descargarMetricas = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(metricas, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `telemetria_${sesion1.idSesion}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const escenaActual = sesion1.escenas[idEscenaActual];

  if (!iniciado) {
    return (
      <div className="flex flex-col items-center justify-center w-screen h-screen bg-slate-900 text-white p-8">
        <h1 className="text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          Motor de Cuentos Digitales Interactivos
        </h1>
        <p className="text-xl text-slate-300 mb-12 max-w-2xl text-center">
          Taller "Cuentos Atentos" - Basado en la Teoría de la Carga Cognitiva y el Aprendizaje Multimedia para preescolares de 5 años.
        </p>
        <div className="flex flex-col items-center mb-12 space-y-4">
          <p className="text-slate-400 font-semibold uppercase tracking-widest text-sm"></p>
          <div className="flex space-x-4 bg-slate-800 p-2 rounded-full border border-slate-700">
            {/* 
            <button
              onClick={() => setModoCuento('controles')}
              className={`px-8 py-3 rounded-full font-bold transition-all ${modoCuento === 'controles' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Cuento Interactivo (Objetos y Arrastre)
            </button>
            */}
            <button
              onClick={() => setModoCuento('video')}
              className={`px-8 py-3 rounded-full font-bold transition-all ${modoCuento === 'video' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Cuento Video (Táctil Cinematográfico)
            </button>
          </div>
        </div>

        <button
          onClick={manejarInicio}
          className="px-12 py-6 text-3xl font-bold bg-blue-600 hover:bg-blue-500 rounded-full shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all hover:scale-105"
        >
          INICIAR SESIÓN: {sesion1.titulo.toUpperCase()}
        </button>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Contenedor estricto 16:9 (1920x1080) centrado y escalado */}
      <div
        id="contenedor-16-9"
        className="relative origin-center bg-zinc-900 shadow-2xl"
        style={{ width: '1920px', height: '1080px' }}
      >
        {escenaActual ? (
          modoCuento === 'controles' ? (
            <LienzoCuento
              escena={escenaActual}
              alSeleccionarOpcion={manejarSeleccionOpcion}
            />
          ) : (
            <LienzoVideo
              escena={escenaActual}
              alSeleccionarOpcion={manejarSeleccionOpcion}
            />
          )
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white">
            <h2 className="text-6xl font-bold text-emerald-400 mb-8">¡Fin de la Sesión!</h2>
            <button
              onClick={descargarMetricas}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-2xl text-2xl font-bold"
            >
              Descargar Reporte de Telemetría (JSON)
            </button>
          </div>
        )}
      </div>

      {/* Botón oculto para métricas de escape, solo en dev */}
      {import.meta.env.DEV && (
        <button
          onClick={descargarMetricas}
          className="absolute top-4 left-4 bg-white/20 p-2 rounded text-xs text-white z-50 hover:bg-white/50"
        >
          DL JSON
        </button>
      )}
    </div>
  );
}
