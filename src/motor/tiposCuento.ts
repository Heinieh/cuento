export interface OpcionInteraccion {
  id: string;
  idEscenaDestino: string;
  icono: string; // nombre del ícono, ej: "Heart", "Bell"
  textoDescriptivo: string; 
  audioFeedback: string; 
}

export interface EscenaCuento {
  id: string;
  imagenFondo: string; 
  videoFondo?: string; // Nuevo soporte para el Modo Video
  audioAmbiente: string; 
  audioVozNarrador: string; 
  objetosInteractivos?: {
    id: string;
    tipoRender: 'imagen' | 'componente';
    imagen?: string; // si tipoRender es 'imagen'
    componenteId?: string; // si tipoRender es 'componente'
    posicionInicial: { top: string; left: string };
    animacionBase: string; // ej: "flotar", "latir", "respirar", "ninguna"
    arrastrable?: boolean; // Permite a la docente/niño mover el elemento por la pantalla
    tamaño?: string; // ej: "w-32", "w-1/4"
  }[];
  tiempoBloqueoMs: number; 
  tipoInteraccion: 'ninguna' | 'decision_simple' | 'arrastrar_y_soltar' | 'toque_objeto' | 'secuencia';
  opciones: OpcionInteraccion[];
}

export interface SesionCuento {
  idSesion: string;
  titulo: string;
  dimensionEnfoque: 'orientacion_perceptiva' | 'persistencia_tarea' | 'resistencia_distractores' | 'regulacion_motora';
  escenaInicial: string;
  escenas: Record<string, EscenaCuento>;
}
