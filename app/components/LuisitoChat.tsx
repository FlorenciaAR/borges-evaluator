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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [historial]);

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
    
    const nuevoHistorial: Mensaje[] = [...historial, { sender: 'user', text: optionText }];
    const nuevasRespuestas = [...respuestasUsuario, optionIndex];
    setRespuestasUsuario(nuevasRespuestas);
    setHistorial(nuevoHistorial);

    const cantidadErrores = nuevasRespuestas.reduce((acc, resp, idx) => {
      return resp !== triviaBorges[idx].correcta ? acc + 1 : acc;
    }, 0);

    const siguientePreguntaIdx = currentStep + 1;

    if (cantidadErrores >= 2) {
      setTimeout(() => {
        setIsFinished(true);
        const resultadoFinal = "NO CALIFICADO. Has cometido demasiados errores. El universo ha seguido su curso y la descarga de fusiles concluyó.";
        setHistorial(prev => [...prev, { sender: 'luisito', text: resultadoFinal }]);
        
        const aciertos = nuevasRespuestas.length - cantidadErrores;
        fetch('/api/evaluacion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tenantId: 'merge-analitica', score: aciertos })
        }).catch(err => console.error(err));
      }, 800);
    } 
    else if (siguientePreguntaIdx < triviaBorges.length) {
      setTimeout(() => {
        setCurrentStep(siguientePreguntaIdx);
        setHistorial(prev => [...prev, { sender: 'luisito', text: triviaBorges[siguientePreguntaIdx].enunciado }]);
        setShowOptions(true);
      }, 800);
    } 
    else {
      setTimeout(() => {
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
    <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden font-sans">
      {/* Header del Bot */}
      <div className="bg-white p-4 border-b border-slate-100 flex items-center justify-between shadow-sm z-10 relative">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-inner border border-white/20">
            M
          </div>
          <div>
            <h3 className="text-slate-800 font-bold text-sm tracking-wide">MERGE Bot</h3>
            <p className="text-xs text-slate-500 font-medium">Asistente Evaluador</p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">En línea</span>
        </div>
      </div>

      {/* Ventana de Conversación */}
      <div className="p-5 h-[380px] overflow-y-auto space-y-5 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200">
        {historial.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.sender === 'user' 
                ? 'bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-tr-sm shadow-md font-medium' 
                : 'bg-white text-slate-700 rounded-tl-sm border border-slate-200 shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Panel de Opciones */}
      <div className="p-5 bg-white border-t border-slate-100 min-h-[140px] flex flex-col justify-center rounded-b-2xl">
        {showOptions && !isFinished && (
          <div className="space-y-2.5 w-full">
            <span className="text-[11px] uppercase tracking-widest font-bold text-slate-400 block mb-2 px-1">Selecciona tu respuesta:</span>
            {triviaBorges[currentStep].opciones.map((opcion, idx) => (
              <button
                key={idx}
                onClick={() => handleSeleccion(idx, opcion)}
                className="w-full text-left p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:shadow-sm text-slate-600 hover:text-emerald-700 transition-all text-sm font-semibold group flex items-center"
              >
                <span className="w-5 h-5 rounded-full border-2 border-slate-200 group-hover:border-emerald-400 flex-shrink-0 mr-3 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                </span>
                {opcion}
              </button>
            ))}
          </div>
        )}
        {isFinished && (
          <div className="text-center py-3">
            <span className="inline-block px-4 py-1.5 bg-slate-100 rounded-full text-xs text-slate-500 font-semibold tracking-wide">
              Evaluación Finalizada
            </span>
          </div>
        )}
      </div>
    </div>
  );
}