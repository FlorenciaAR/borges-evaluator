'use client';
import { useState, useEffect, useRef } from 'react';
import { triviaBorges } from '../../data/trivia';

interface Mensaje {
  sender: 'luisito' | 'user';
  text: string;
}

export default function LuisitoChat() {
  const [currentStep, setCurrentStep] = useState(0);
  const [historial, setHistorial] = useState<Mensaje[]>([
    { sender: 'luisito', text: 'Hola 📖 Soy Luisito, el coordinador literario de MERGE Analítica.' },
    { sender: 'luisito', text: 'Estamos acá para evaluar tus conocimientos sobre "El milagro secreto" de Borges. ¿Comenzamos?' }
  ]);
  const [showOptions, setShowOptions] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [respuestasUsuario, setRespuestasUsuario] = useState<number[]>([]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al final del chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [historial]);

  // Delay para simular que Luisito está "pensando" la primera pregunta
  useEffect(() => {
    if (currentStep === 0 && historial.length === 2) {
      const timer = setTimeout(() => {
        setHistorial(prev => [...prev, { sender: 'luisito', text: triviaBorges[0].enunciado }]);
        setShowOptions(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, historial.length]);

  const handleSeleccion = (optionIndex: number, optionText: string) => {
    setShowOptions(false);
    
    // 1. Agregar respuesta al chat y al estado
    const nuevoHistorial: Mensaje[] = [...historial, { sender: 'user', text: optionText }];
    const nuevasRespuestas = [...respuestasUsuario, optionIndex];
    setRespuestasUsuario(nuevasRespuestas);
    setHistorial(nuevoHistorial);

    // 2. Calcular los errores exactos hasta este momento
    const cantidadErrores = nuevasRespuestas.reduce((acc, resp, idx) => {
      return resp !== triviaBorges[idx].correcta ? acc + 1 : acc;
    }, 0);

    const siguientePreguntaIdx = currentStep + 1;

    // 3. Lógica de Evaluación: El Condicional Fail Fast
    if (cantidadErrores >= 2) {
      // Condición A: Cortar si ya tiene 2 respuestas incorrectas
      setTimeout(() => {
        setIsFinished(true);
        const resultadoFinal = "NO CALIFICADO y seguir respondiendo no cambiará el destino. Has cometido demasiados errores. El universo ha seguido su curso y la descarga de fusiles concluyó.";
        
        setHistorial(prev => [...prev, { sender: 'luisito', text: resultadoFinal }]);
        
        // Calcular aciertos para enviar a la API
        const aciertos = nuevasRespuestas.length - cantidadErrores;
        fetch('/api/evaluacion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tenantId: 'merge-analitica', score: aciertos })
        }).catch(err => console.error(err));

      }, 800);
    } 
    else if (siguientePreguntaIdx < triviaBorges.length) {
      // Condición B: Sigue vivo y hay más preguntas
      setTimeout(() => {
        setCurrentStep(siguientePreguntaIdx);
        setHistorial(prev => [...prev, { sender: 'luisito', text: triviaBorges[siguientePreguntaIdx].enunciado }]);
        setShowOptions(true);
      }, 800);
    } 
    else {
      // Condición C: Terminó todas las preguntas sin ser eliminado (Ganó / Puntaje perfecto o 1 solo error permitido)
      setTimeout(() => {
        setIsFinished(true);
        // Volvemos a contar aciertos totales por seguridad
        const aciertos = nuevasRespuestas.reduce((acc, resp, idx) => {
          return resp === triviaBorges[idx].correcta ? acc + 1 : acc;
        }, 0);

        const resultadoFinal = aciertos === 3 
          ? "¡CALIFICADO! Dios ha detenido el tiempo para ti. Tienes un año secreto para terminar tu obra."
          : "NO CALIFICADO. Tu conocimiento no fue suficiente. La bala alcanzó su destino.";
        
        setHistorial(prev => [...prev, { sender: 'luisito', text: resultadoFinal }]);
        
        fetch('/api/evaluacion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tenantId: 'merge-analitica', score: aciertos })
        }).catch(err => console.error(err));

      }, 800);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-[#0b171e] rounded-xl border border-slate-800 shadow-2xl overflow-hidden font-sans">
      {/* Header del Bot */}
      <div className="bg-[#0f242e] p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-serif font-bold text-lg">
            L
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Luisito</h3>
            <p className="text-xs text-cyan-400">Coordinador literario — MERGE</p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-xs text-slate-400">En línea ahora</span>
        </div>
      </div>

      {/* Ventana de Conversación */}
      <div className="p-4 h-[350px] overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {historial.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-cyan-500 text-white rounded-tr-none' 
                : 'bg-[#162c39] text-slate-100 rounded-tl-none border border-slate-800/50'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Panel de Opciones */}
      <div className="p-4 bg-[#091319] border-t border-slate-800 min-h-[140px] flex flex-col justify-center">
        {showOptions && !isFinished && (
          <div className="space-y-2 w-full">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 block mb-1 px-1">Selecciona una opción:</span>
            {triviaBorges[currentStep].opciones.map((opcion, idx) => (
              <button
                key={idx}
                onClick={() => handleSeleccion(idx, opcion)}
                className="w-full text-left p-3 rounded-xl bg-[#12242f] hover:bg-[#1a3444] border border-slate-800 hover:border-cyan-500 text-slate-200 hover:text-white transition-all text-sm font-medium active:scale-[0.995]"
              >
                ✦ {opcion}
              </button>
            ))}
          </div>
        )}
        {isFinished && (
          <div className="text-center py-2 text-xs text-slate-500 font-mono">
            — Evaluación finalizada con Luisito —
          </div>
        )}
      </div>
    </div>
  );
}