import React from 'react';

const GameOver = ({ score, totalQuestions, resetGame }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  let message = "¡Buen intento!";
  let color = "text-yellow-500";
  
  if (percentage >= 80) {
    message = "¡Increíble!";
    color = "text-green-500";
  } else if (percentage < 30) {
    message = "¡Sigue practicando!";
    color = "text-red-500";
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 md:p-12 w-full max-w-lg text-center shadow-2xl transform transition-all animate-scale-in">
        <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-2">Juego Terminado</h2>
        <p className={`text-2xl md:text-3xl font-bold ${color} mb-8`}>{message}</p>
        
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
            <p className="text-gray-500 uppercase text-sm font-bold tracking-wider mb-2">Puntuación Final</p>
            <div className="flex items-end justify-center gap-2">
                <span className="text-6xl font-black text-gray-900">{score}</span>
                <span className="text-2xl font-medium text-gray-400 mb-2">/ {totalQuestions}</span>
            </div>
        </div>

        <button
          onClick={resetGame}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl text-xl shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Volver al Menú
        </button>
      </div>
    </div>
  );
};

export default GameOver;