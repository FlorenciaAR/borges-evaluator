// app/page.tsx
'use client';
import { useState } from 'react';
import TriviaBot from './components/TriviaBot';

export default function Home() {
  const [step, setStep] = useState<'registro' | 'trivia' | 'resultado'>('registro');
  const [userData, setUserData] = useState({ nombre: '', email: '' });
  const [resultado, setResultado] = useState({ score: 0, calificado: false });
  const [loading, setLoading] = useState(false);

  const handleRegistroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userData.nombre && userData.email) {
      setStep('trivia');
    }
  };

  const finalizarEvaluacion = async (score: number, respuestasUsuario: number[]) => {
    setLoading(true);
    const esCalificado = score === 3; // Califica solo si responde las 3 bien
    setResultado({ score, calificado: esCalificado });
    setStep('resultado');

    // Aquí es donde en el futuro golpearás a tu API de Vercel KV o GHL
    try {
      await fetch('/api/evaluacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: 'merge-analitica',
          nombre: userData.nombre,
          email: userData.email,
          score: score,
          respuestas: respuestasUsuario
        }),
      });
    } catch (e) {
      console.error("Error al guardar la evaluación:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 flex flex-col justify-center items-center py-12 px-4 select-none">
      <div className="text-center mb-8 max-w-md">
        <h1 className="text-3xl font-serif text-stone-900 font-bold">El Milagro Secreto</h1>
        <p className="text-stone-600 font-sans text-sm mt-2">
          Demo de Calificación Automatizada para <span className="font-semibold text-blue-900">MERGE Analítica</span>
        </p>
      </div>

      {step === 'registro' && (
        <form onSubmit={handleRegistroSubmit} className="w-full max-w-md p-6 bg-white rounded-xl border border-stone-200 shadow-sm space-y-4 font-sans">
          <h2 className="text-lg font-serif font-bold text-stone-800 mb-2">Ingresa tus datos para iniciar la prueba</h2>
          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">Nombre Completo</label>
            <input 
              type="text" 
              required
              className="w-full p-3 border border-stone-300 rounded-lg text-sm bg-stone-50 focus:outline-none focus:border-stone-500 text-stone-900"
              value={userData.nombre}
              onChange={(e) => setUserData({ ...userData, nombre: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              required
              className="w-full p-3 border border-stone-300 rounded-lg text-sm bg-stone-50 focus:outline-none focus:border-stone-500 text-stone-900"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            />
          </div>
          <button type="submit" className="w-full p-3 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-sm font-semibold transition-colors">
            Comenzar Evaluación
          </button>
        </form>
      )}

      {step === 'trivia' && <TriviaBot onComplete={finalizarEvaluacion} />}

      {step === 'resultado' && (
        <div className="w-full max-w-md text-center p-8 bg-white rounded-xl border border-stone-200 shadow-md font-serif">
          <h2 className="text-2xl font-bold text-stone-800">Sentencia Determinada</h2>
          <p className="mt-2 text-stone-600 font-sans text-sm">Usuario: {userData.nombre} ({userData.email})</p>
          <div className="my-6 p-4 bg-stone-50 border border-stone-200 rounded-lg">
            <span className="text-sm font-sans text-stone-500 block">Puntaje obtenido</span>
            <span className="text-4xl font-bold text-stone-900">{resultado.score} / 3</span>
          </div>
          
          {resultado.calificado ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-sm font-sans font-medium">
              ¡CALIFICADO! Dios ha detenido el tiempo. Tienes un año secreto en tu mente para concluir tu obra dramática.
            </div>
          ) : (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded-lg text-sm font-sans font-medium">
              NO CALIFICADO. El universo ha seguido su curso regular. La descarga de los fusiles de la Gestapo ha concluido.
            </div>
          )}
        </div>
      )}
    </main>
  );
}