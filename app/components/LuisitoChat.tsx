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

  // Auto-scroll al final del chat cada vez que cambia el historial
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [historial]);

  // Delay para simular que Luisito está "pensando" la siguiente pregunta
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
    
    // 1. Agregar la respuesta del usuario al chat
    const nuevoHistorial = [...historial, { sender: 'user', text: optionText }];
    const nuevasRespuestas = [...respuestasUsuario, optionIndex];
    setRespuestasUsuario(nuevasRespuestas);
    setHistorial(nuevoHistorial);

    const siguientePreguntaIdx = currentStep + 1;

    // 2. Verificar si hay más preguntas o si terminamos
    if (siguientePreguntaIdx < triviaBorges.length) {
      setTimeout(() => {
        setCurrentStep(siguientePreguntaIdx);
        setHistorial(prev => [...prev, { sender: 'luisito', text: triviaBorges[siguientePreguntaIdx].enunciado }]);
        setShowOptions(true);
      }, 800);
    } else {
      setTimeout(() => {
        // Calcular Calificación final
        const aciertos = nuevasRespuestas.reduce((acc, resp, idx) => {
          return resp === triviaBorges[idx].correcta ? acc + 1 : acc;
        }, 0);
        
        setIsFinished(true);
        const resultadoFinal = aciertos === 3 
          ?