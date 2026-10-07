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

  const [escala, setEscala] = useState(1);

  // Escalar para forzar 16:9
  useEffect(() => {
    const ajustarEscala = () => {
      const windowRatio = window.innerWidth / window.innerHeight;
      const targetRatio = 16 / 9;

      if (windowRatio < targetRatio) {
        // Pantalla más estrecha (ej. tablet vertical o monitor 4:3), ajustar por ancho
        setEscala(window.innerWidth / 1920);
      } else {
        // Pantalla más ancha, ajustar por alto
        setEscala(window.innerHeight / 1080);
      }
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
        <h1 className="text-5xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          Motor de Cuentos Digitales Interactivos
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-3xl text-center">
          Taller "Cuentos Atentos" para fortalecer la atención sostenida mediante cuentos digitales interactivos en niños de 5 años de la Institución Educativa N° 224 Indoamérica, Trujillo - 2026.
        </p>
        <button 
          onClick={manejarInicio}
          className="group relative rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(52,211,153,0.3)] hover:shadow-[0_0_80px_rgba(52,211,153,0.6)] transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-emerald-500 cursor-pointer"
        >
          <img 
            src="/assets/cuento/portada.jpg" 
            alt="Iniciar: Lúmina y el bosque de luz" 
            className="w-[800px] max-w-[90vw] h-auto object-cover border-4 border-slate-700 rounded-3xl transition-transform duration-300" 
          />
        </button>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      {/* Contenedor estricto 16:9 (1920x1080) con centrado absoluto y escala precisa */}
      <div
        id="contenedor-16-9"
        className="absolute top-1/2 left-1/2 bg-zinc-900 shadow-2xl"
        style={{
          width: '1920px',
          height: '1080px',
          transform: `translate(-50%, -50%) scale(${escala})`,
          transformOrigin: 'center center'
        }}
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
