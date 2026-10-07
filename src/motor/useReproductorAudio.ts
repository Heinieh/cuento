import { useEffect, useRef } from 'react';
import { Howl } from 'howler';

export function useReproductorAudio(
  audioAmbienteRuta: string,
  audioVozRuta: string
) {
  const ambienteRef = useRef<Howl | null>(null);
  const vozRef = useRef<Howl | null>(null);

  useEffect(() => {
    // Inicializar y reproducir ambiente
    if (audioAmbienteRuta) {
      ambienteRef.current = new Howl({
        src: [audioAmbienteRuta],
        loop: true,
        volume: 0.3, // Volumen bajo para fondo
        onloaderror: () => console.warn(`No se pudo cargar: ${audioAmbienteRuta}`),
        onplayerror: () => console.warn(`Error al reproducir: ${audioAmbienteRuta}`)
      });
      ambienteRef.current.play();
    }

    // Inicializar y reproducir voz narrativa
    if (audioVozRuta) {
      vozRef.current = new Howl({
        src: [audioVozRuta],
        volume: 1.0,
        onloaderror: () => console.warn(`No se pudo cargar: ${audioVozRuta}`),
        onplayerror: () => console.warn(`Error al reproducir: ${audioVozRuta}`)
      });
      vozRef.current.play();
    }

    // Cleanup: detener audios al cambiar de escena para evitar solapamientos
    return () => {
      if (ambienteRef.current) {
        ambienteRef.current.fade(0.3, 0, 1000); // fade out suave
        setTimeout(() => ambienteRef.current?.unload(), 1000);
      }
      if (vozRef.current) {
        vozRef.current.stop();
        vozRef.current.unload();
      }
    };
  }, [audioAmbienteRuta, audioVozRuta]);

  const reproducirFeedback = (ruta: string) => {
    if (!ruta) return;
    const feedback = new Howl({
      src: [ruta],
      volume: 1.0,
      onloaderror: () => console.warn(`No se pudo cargar feedback: ${ruta}`)
    });
    feedback.play();
  };

  const pausarTodo = () => {
    if (ambienteRef.current) ambienteRef.current.pause();
    if (vozRef.current) vozRef.current.pause();
  };

  const reanudarTodo = () => {
    if (ambienteRef.current) ambienteRef.current.play();
    if (vozRef.current) vozRef.current.play();
  };

  return { reproducirFeedback, pausarTodo, reanudarTodo };
}
