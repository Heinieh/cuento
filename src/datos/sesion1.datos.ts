import type { SesionCuento } from '../motor/tiposCuento';

export const sesion1: SesionCuento = {
  idSesion: "sesion_01",
  titulo: "Lúmina y el bosque de luz",
  dimensionEnfoque: "regulacion_motora",
  escenaInicial: "inicio",
  escenas: {
    inicio: {
      id: "inicio",
      imagenFondo: "/assets/sesion1/1.jpeg",
      videoFondo: "/assets/cuento/luciernaga.mp4",
      audioAmbiente: "/assets/audio/bosque_ambiente.mp3",
      audioVozNarrador: "/assets/audio/narrador_inicio.mp3",
      objetosInteractivos: [
        {
          id: "lumina_inicio",
          tipoRender: "componente",
          componenteId: "lumina_lottie",
          posicionInicial: { top: "60%", left: "30%" },
          animacionBase: "flotar",
          arrastrable: true,
          tamaño: "w-48 h-48"
        }
      ],
      tiempoBloqueoMs: 5000,
      tipoInteraccion: "decision_simple",
      opciones: [
        {
          id: "continuar",
          idEscenaDestino: "reto1",
          icono: "ArrowRight",
          textoDescriptivo: "Comenzar la aventura",
          audioFeedback: "/assets/audio/ok.mp3"
        }
      ]
    },
    reto1: {
      id: "reto1",
      imagenFondo: "/assets/sesion1/2.jpeg",
      videoFondo: "/assets/cuento/sapo_normal.mp4",
      audioAmbiente: "/assets/audio/bosque_viento.mp3",
      audioVozNarrador: "/assets/audio/narrador_reto1.mp3",
      objetosInteractivos: [
        {
          id: "sapito_triste",
          tipoRender: "componente",
          componenteId: "sapito",
          posicionInicial: { top: "65%", left: "50%" },
          animacionBase: "pulso",
          arrastrable: true,
          tamaño: "w-64 h-64"
        },
        {
          id: "lumina_reto1",
          tipoRender: "componente",
          componenteId: "lumina_lottie",
          posicionInicial: { top: "50%", left: "20%" },
          animacionBase: "flotar",
          arrastrable: true,
          tamaño: "w-40 h-40"
        }
      ],
      tiempoBloqueoMs: 6000,
      tipoInteraccion: "decision_simple",
      opciones: [
        {
          id: "hacer_ruido",
          idEscenaDestino: "reto1_consecuencia_ruido",
          icono: "BellRing",
          textoDescriptivo: "Hacer ruido fuerte",
          audioFeedback: "/assets/audio/error.mp3"
        },
        {
          id: "silencio",
          idEscenaDestino: "reto1_consecuencia_exito",
          icono: "Heart",
          textoDescriptivo: "Escuchar con el corazón (Silencio)",
          audioFeedback: "/assets/audio/acierto.mp3"
        }
      ]
    },
    reto1_consecuencia_ruido: {
      id: "reto1_consecuencia_ruido",
      imagenFondo: "/assets/sesion1/2.jpeg",
      videoFondo: "/assets/cuento/sapo_asustado.mp4",
      audioAmbiente: "/assets/audio/bosque_viento.mp3",
      audioVozNarrador: "/assets/audio/narrador_reintento1.mp3",
      tiempoBloqueoMs: 3000,
      tipoInteraccion: "decision_simple",
      opciones: [
        {
          id: "reintentar",
          idEscenaDestino: "reto1",
          icono: "RotateCcw",
          textoDescriptivo: "Volver a intentar",
          audioFeedback: "/assets/audio/ok.mp3"
        }
      ]
    },
    reto1_consecuencia_exito: {
      id: "reto1_consecuencia_exito",
      imagenFondo: "/assets/sesion1/2.jpeg",
      videoFondo: "/assets/cuento/sapo_calmado.mp4",
      audioAmbiente: "/assets/audio/bosque_ambiente.mp3", // El viento se calma
      audioVozNarrador: "", // Silencio mágico o pequeña narración de éxito
      tiempoBloqueoMs: 4000, // Darles tiempo de ver al sapito calmado
      tipoInteraccion: "decision_simple",
      opciones: [
        {
          id: "avanzar_reto2",
          idEscenaDestino: "reto2",
          icono: "ArrowRight",
          textoDescriptivo: "Continuar el camino",
          audioFeedback: "/assets/audio/ok.mp3"
        }
      ]
    },
    reto2: {
      id: "reto2",
      imagenFondo: "/assets/sesion1/4.jpeg",
      videoFondo: "/assets/cuento/carpintero.mp4",
      audioAmbiente: "/assets/audio/bosque_pajaro.mp3",
      audioVozNarrador: "/assets/audio/narrador_reto2.mp3",
      objetosInteractivos: [
        {
          id: "pajaro_carpintero",
          tipoRender: "componente",
          componenteId: "pajaro",
          posicionInicial: { top: "35%", left: "75%" },
          animacionBase: "respirar",
          arrastrable: true,
          tamaño: "w-48 h-48"
        },
        {
          id: "lumina_reto2",
          tipoRender: "componente",
          componenteId: "lumina_lottie",
          posicionInicial: { top: "65%", left: "25%" },
          animacionBase: "flotar",
          arrastrable: true,
          tamaño: "w-40 h-40"
        }
      ],
      tiempoBloqueoMs: 6000,
      tipoInteraccion: "decision_simple",
      opciones: [
        {
          id: "tapar_oidos",
          idEscenaDestino: "reto2_consecuencia_error",
          icono: "EarOff",
          textoDescriptivo: "Tapar oídos e ignorar",
          audioFeedback: "/assets/audio/error.mp3"
        },
        {
          id: "preguntar",
          idEscenaDestino: "reto2_consecuencia_exito",
          icono: "Search",
          textoDescriptivo: "Preguntar con curiosidad",
          audioFeedback: "/assets/audio/acierto.mp3"
        }
      ]
    },
    reto2_consecuencia_error: {
      id: "reto2_consecuencia_error",
      imagenFondo: "/assets/sesion1/4.jpeg",
      videoFondo: "/assets/cuento/carpintero_taparoidos.mp4",
      audioAmbiente: "/assets/audio/bosque_pajaro.mp3",
      audioVozNarrador: "/assets/audio/narrador_reintento2.mp3",
      tiempoBloqueoMs: 3000,
      tipoInteraccion: "decision_simple",
      opciones: [
        {
          id: "reintentar",
          idEscenaDestino: "reto2",
          icono: "RotateCcw",
          textoDescriptivo: "Volver a intentar",
          audioFeedback: "/assets/audio/ok.mp3"
        }
      ]
    },
    reto2_consecuencia_exito: {
      id: "reto2_consecuencia_exito",
      imagenFondo: "/assets/sesion1/4.jpeg",
      videoFondo: "/assets/cuento/carpintero_enredado.mp4",
      audioAmbiente: "/assets/audio/bosque_ambiente.mp3",
      audioVozNarrador: "/assets/audio/narrador_reto2_exito.mp3",
      tiempoBloqueoMs: 4000,
      tipoInteraccion: "decision_simple",
      opciones: [
        {
          id: "avanzar_desenlace",
          idEscenaDestino: "desenlace",
          icono: "ArrowRight",
          textoDescriptivo: "Finalizar la aventura",
          audioFeedback: "/assets/audio/ok.mp3"
        }
      ]
    },
    desenlace: {
      id: "desenlace",
      imagenFondo: "/assets/sesion1/6.jpeg",
      videoFondo: "/assets/cuento/bosque.mp4",
      audioAmbiente: "/assets/audio/bosque_magico.mp3",
      audioVozNarrador: "/assets/audio/narrador_desenlace.mp3",
      objetosInteractivos: [
        {
          id: "lumina_final",
          tipoRender: "componente",
          componenteId: "lumina_lottie",
          posicionInicial: { top: "50%", left: "50%" },
          animacionBase: "pulso",
          arrastrable: true,
          tamaño: "w-64"
        }
      ],
      tiempoBloqueoMs: 8000,
      tipoInteraccion: "ninguna",
      opciones: []
    }
  }
};
