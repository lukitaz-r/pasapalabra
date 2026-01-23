import React, { useEffect, useRef } from 'react';
import Rosco from './Rosco';

const Game = ({
  questions,
  currentIndex,
  letterStates,
  letterTimes,
  score,
  gameActive,
  answerInput,
  setAnswerInput,
  handlePasapalabra,
  handleSubmitAnswer,
  resetGame,
  countdown,
}) => {
  const inputRef = useRef(null);
  const currentQuestion = questions[currentIndex];
  const currentTime = letterTimes[currentQuestion?.letter] || 0;

  // Focus input on change
  useEffect(() => {
    if (gameActive && !countdown && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, gameActive, countdown]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-900 text-gray-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 animate-fade-in-up"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

      {/* Header */}
      <header className="w-full max-w-6xl mx-auto p-4 flex justify-between items-center z-10 glass-effect rounded-b-2xl mb-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-tighter filter drop-shadow-sm">
          PASAPALABRA
        </h1>

        <div className="flex items-center gap-4">
          <div className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-2xl border border-white/20 flex items-center gap-3 shadow-lg">
            <div className="flex flex-col items-center leading-none">
              <span className="text-[0.6rem] text-blue-300 uppercase font-bold tracking-wider">Aciertos</span>
              <span className="text-green-400 text-2xl font-black filter drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">{score}</span>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div className="flex flex-col items-center leading-none">
              <span className="text-[0.6rem] text-purple-300 uppercase font-bold tracking-wider">Total</span>
              <span className="text-gray-300 text-xl font-bold">26</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 p-4 relative">

        {/* Left Side: Question & Input */}
        <div className="flex-1 w-full max-w-md flex flex-col gap-6 z-20 order-2 md:order-1 pb-20 md:pb-0">
          {/* Question Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/40 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-purple-600"></div>
            <div className="mb-4 flex justify-between items-center">
              <span className="bg-blue-100/80 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                Definición
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-bold uppercase">Tiempo Restante</span>
                <span className={`text-2xl font-mono font-black ${currentTime <= 5 ? 'text-red-500 animate-pulse scale-110' : 'text-gray-700'}`}>
                  {currentTime}s
                </span>
              </div>
            </div>
            <p className="text-xl md:text-3xl font-medium text-gray-800 leading-snug min-h-[5rem] flex items-center">
              {gameActive ? currentQuestion?.question : "¡Partida finalizada!"}
            </p>
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmitAnswer} className="relative w-full group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <input
              ref={inputRef}
              type="text"
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              placeholder="Escribe tu respuesta..."
              className="relative w-full bg-white border-none text-gray-900 text-2xl px-6 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all shadow-xl placeholder:text-gray-300 uppercase font-bold tracking-wide"
              disabled={!gameActive || countdown !== null}
              autoComplete="off"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 rounded-xl font-black tracking-wider transition-all shadow-lg hover:shadow-blue-500/50 active:scale-95"
              disabled={!gameActive || countdown !== null}
            >
              ENVIAR
            </button>
          </form>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handlePasapalabra}
              className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 hover:text-white py-4 rounded-2xl font-bold text-lg transition-all border border-indigo-500/30 backdrop-blur-sm"
              disabled={!gameActive || countdown !== null}
            >
              PASAPALABRA
            </button>
            <button
              type="button"
              onClick={resetGame}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 py-4 rounded-2xl font-bold text-lg transition-all border border-red-500/20 backdrop-blur-sm"
            >
              SALIR
            </button>
          </div>
        </div>

        {/* Right Side: Rosco */}
        <div className="flex-1 flex justify-center items-center order-1 md:order-2">
          <Rosco
            questions={questions}
            currentIndex={currentIndex}
            letterStates={letterStates}
            letterTimes={letterTimes}
          />
        </div>
      </main>

      {/* Countdown Overlay */}
      {countdown !== null && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-[15rem] font-black text-white animate-ping-slow drop-shadow-[0_0_50px_rgba(255,255,255,0.5)]">
            {countdown > 0 ? countdown : 'YA!'}
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;