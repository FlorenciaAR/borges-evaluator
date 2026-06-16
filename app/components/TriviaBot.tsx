// app/components/TriviaBot.tsx
'use client';
import { useState } from 'react';
import { triviaBorges } from '../../data/trivia';

interface TriviaBotProps {
  onComplete: (score: number, respuestasUsuario: number[]) => void;
}

export default function TriviaBot({ onComplete }: TriviaBotProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [respuestas, setRespuestas] = useState<number[]>([]);

  const handleSeleccion = (indexOpcion: number) => {
    const nuevasRespuestas = [...respuestas, indexOpcion];
    setRespuestas(nuevasRespuestas);

    if (currentStep < triviaBorges.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calcular el score en base a las respuestas correctas
      const aciertos = nuevasRespuestas.reduce((acc, resp, idx) => {
        return resp === triviaBorges[idx].correcta ? acc + 1 : acc;
      }, 0);
      
      onComplete(aciertos, nuevasRespuestas);
    }
  };

  const preguntaActual = triviaBorges[currentStep];

  return (
    <div className="w-full max-w-md p-6 bg-stone-100 rounded-xl border border-stone-300 shadow-lg font-serif">
      <div className="mb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-stone-500 block mb-1">
          MERGE Analítica — Evaluación {currentStep + 1} de {triviaBorges.length}
        </span>
        <h3 className="text-xl font-bold text-stone-900 leading-snug">{preguntaActual.enunciado}</h3>
      </div>
      
      <div className="space-y-3 font-sans">
        {preguntaActual.opciones.map((opcion, index) => (
          <button
            key={index}
            onClick={() => handleSeleccion(index)}
            className="w-full text-left p-4 rounded-lg bg-white hover:bg-stone-200 border border-stone-200 shadow-sm transition-all text-sm text-stone-800 font-medium active:scale-[0.99]"
          >
            {opcion}
          </button>
        ))}
      </div>
    </div>
  );
}