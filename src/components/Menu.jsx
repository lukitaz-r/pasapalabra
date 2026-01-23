import React from 'react';

const Menu = ({ difficulty, setDifficulty, startGame, loading, error }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-4">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 animate-fade-in-up">
        <h1 className="text-6xl md:text-8xl font-extrabold text-center mb-4 drop-shadow-lg tracking-tight">
          Pasapalabra
        </h1>
        <p className="text-xl md:text-2xl text-center mb-10 text-white/90 font-light">
          ¿Estás listo para el desafío?
        </p>

        <div className="flex flex-col items-center gap-6 mb-12">
          <p className="text-lg font-semibold uppercase tracking-wider text-white/80">Selecciona la dificultad</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['easy', 'medium', 'hard'].map((level) => (
              <button
                key={level}
                className={`px-6 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105 active:scale-95 ${
                  difficulty === level
                    ? level === 'easy'
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/50 ring-4 ring-green-300/30'
                      : level === 'medium'
                      ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/50 ring-4 ring-yellow-300/30'
                      : 'bg-red-500 text-white shadow-lg shadow-red-500/50 ring-4 ring-red-300/30'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                onClick={() => setDifficulty(level)}
              >
                {level === 'easy' ? 'FÁCIL' : level === 'medium' ? 'MEDIO' : 'DIFÍCIL'}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-8 text-center animate-pulse">
            <p className="text-red-100 font-medium">{error}</p>
            <p className="text-xs text-red-200 mt-2 font-mono">Ejecuta: npm run seed && npm run server</p>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={startGame}
            disabled={loading}
            className={`px-10 py-5 rounded-2xl text-2xl font-black tracking-widest uppercase transition-all transform hover:scale-105 hover:-translate-y-1 shadow-2xl ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-400 to-cyan-300 text-indigo-900 hover:shadow-cyan-400/50'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <svg className="animate-spin h-6 w-6 text-indigo-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cargando...
              </span>
            ) : (
              'Iniciar Juego'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu;