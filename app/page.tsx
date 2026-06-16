import LuisitoChat from './components/LuisitoChat';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050b0f] bg-gradient-to-b from-[#08131a] to-[#04080b] flex flex-col items-center justify-center py-12 px-4">
      
      {/* Hero Badge */}
      <div className="mb-3 px-3 py-1 bg-cyan-950/50 border border-cyan-800/60 rounded-full text-[11px] font-mono tracking-widest text-cyan-400 uppercase">
        Borges · El Milagro Secreto · Merge Analítica
      </div>

      {/* Titulares Principales */}
      <div className="text-center mb-8 max-w-2xl px-2">
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight font-sans">
          ¿Puedes detener el tiempo?<br />
          <span className="text-cyan-400">Estamos aquí para evaluarte.</span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base mt-4 max-w-lg mx-auto font-sans">
          Ante el pelotón de fusilamiento de la Gestapo, Jaromir Hladík exigió un milagro. 
          Demuestra tu comprensión analítica e interactúa con nuestro sistema.
        </p>
      </div>

      {/* Componente del Chat Embebido */}
      <div className="w-full max-w-2xl px-2">
        <LuisitoChat />
      </div>

    </main>
  );
}