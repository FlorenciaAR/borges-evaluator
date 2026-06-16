// data/trivia.ts
export interface Pregunta {
  id: number;
  enunciado: string;
  opciones: string[];
  correcta: number; 
}

export const triviaBorges: Pregunta[] = [
  {
    id: 1,
    enunciado: "¿Cuál es la obra teatral inacabada que Jaromir Hladík pide tiempo a Dios para terminar?",
    opciones: ["Los enemigos", "Vindicación de la eternidad", "La biblioteca de Babel"],
    correcta: 0
  },
  {
    id: 2,
    enunciado: "¿Cuánto tiempo extra (en la mente de Hladík) se detiene el universo para que escriba?",
    opciones: ["Un siglo", "Un año", "Un milisegundo"],
    correcta: 1
  },
  {
    id: 3,
    enunciado: "¿Qué acontecimiento físico en el patio de la prisión marca el inicio y el fin del milagro?",
    opciones: ["La caída de una gota de lluvia", "El vuelo de una mosca", "La orden de fuego del sargento"],
    correcta: 0
  }
];