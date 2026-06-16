import LuisitoChat from './components/LuisitoChat';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12 px-4 font-sans">
      
      {/* Hero Badge (Estilo MERGE) */}
      <div className="mb-4 px-4 py-1.5 bg-white border border-slate-200 shadow-sm rounded-full text-[11px] font-semibold tracking-widest text-slate-500 uppercase flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400"></span>
        <span>Borges · El Milagro Secreto · Merge Analítica</span>
      </div>

      {/* Titulares Principales */}
      <div className="text-center mb-10 max-w-2xl px-2">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
          ¿Puedes detener el tiempo?<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-400">
            Estamos aquí para evaluarte.
          </span>
        </h1>
        <p className="text-slate-500 text-sm md:text-base mt-4 max-w-lg mx-auto font-medium">
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