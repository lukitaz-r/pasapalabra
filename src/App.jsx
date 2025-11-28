import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // Estados del juego
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('medium'); // easy, medium, hard
  const [countdown, setCountdown] = useState(null); // 3, 2, 1, null (cuando termina)
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [letterStates, setLetterStates] = useState({});
  const [letterTimes, setLetterTimes] = useState({});
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [answerInput, setAnswerInput] = useState("");
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  // Inicializar tiempo independiente para cada letra (30 segundos por letra)
  const initializeLetterTimes = () => {
    const times = {};
    questions.forEach(q => {
      times[q.letter] = 30; // 30 segundos por letra
    });
    return times;
  };

  // Función para obtener preguntas aleatorias del servidor
  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${API_URL}/api/questions/random?difficulty=${difficulty}`);
      setQuestions(response.data);
      return response.data;
    } catch (err) {
      console.error('Error obteniendo preguntas:', err);
      setError('No se pudieron cargar las preguntas. Asegúrate de que el servidor esté corriendo.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Countdown de preparación
  useEffect(() => {
    if (countdown === null || countdown === 0) return;

    const timer = setTimeout(() => {
      if (countdown > 1) {
        setCountdown(countdown - 1);
      } else {
        setCountdown(null); // Termina el countdown, empieza el juego
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-focus input cuando cambia la pregunta (solo si no hay countdown)
  useEffect(() => {
    if (gameStarted && gameActive && inputRef.current && countdown === null) {
      inputRef.current.focus();
    }
  }, [currentIndex, gameStarted, gameActive, countdown]);

  // Timer independiente para cada letra (solo si no hay countdown)
  useEffect(() => {
    if (!gameActive || !gameStarted || countdown !== null) return;

    const currentLetter = questions[currentIndex]?.letter;
    if (!currentLetter) return;

    const currentState = letterStates[currentLetter];

    // No iniciar timer si la letra ya está respondida
    if (currentState === "correct" || currentState === "incorrect") {
      return;
    }

    // Iniciar temporizador para la letra actual
    timerRef.current = setInterval(() => {
      setLetterTimes(prev => {
        const newTimes = { ...prev };
        const currentTime = newTimes[currentLetter];

        if (currentTime <= 1) {
          // Tiempo agotado - marcar como fallido automáticamente
          handleIncorrect();
          return newTimes;
        }

        newTimes[currentLetter] = currentTime - 1;
        return newTimes;
      });
    }, 1000);

    // Limpiar intervalo cuando cambia de letra o se desmonta
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentIndex, gameActive, gameStarted, letterStates, countdown]);

  // Buscar siguiente pregunta sin responder
  const findNextQuestion = (currentLetterStates = letterStates) => {
    let nextIndex = (currentIndex + 1) % 26;
    let attempts = 0;

    while (attempts < 26) {
      const letter = questions[nextIndex]?.letter;
      const state = currentLetterStates[letter];
      if (state !== "correct" && state !== "incorrect") {
        return nextIndex;
      }
      nextIndex = (nextIndex + 1) % 26;
      attempts++;
    }

    // Todas las preguntas respondidas - terminar el juego
    setGameActive(false);
    return currentIndex;
  };

  // Función CORRECTO - Marca la respuesta como correcta
  const handleCorrect = () => {
    if (!gameActive) return;

    const currentLetter = questions[currentIndex].letter;
    const newLetterStates = { ...letterStates, [currentLetter]: "correct" };

    setLetterStates(newLetterStates);
    setScore(prev => prev + 1);
    setAnswerInput("");

    const nextIndex = findNextQuestion(newLetterStates);
    setCurrentIndex(nextIndex);
  };

  // Función FALLIDO - Marca la respuesta como incorrecta
  const handleIncorrect = () => {
    if (!gameActive) return;

    const currentLetter = questions[currentIndex].letter;
    const newLetterStates = { ...letterStates, [currentLetter]: "incorrect" };

    setLetterStates(newLetterStates);
    setAnswerInput("");

    const nextIndex = findNextQuestion(newLetterStates);
    setCurrentIndex(nextIndex);
  };

  // Función PASAPALABRA - Salta a la siguiente pregunta
  const handlePasapalabra = () => {
    if (!gameActive) return;

    const currentLetter = questions[currentIndex].letter;

    // Solo marcar como pasapalabra si no está ya marcada
    if (!letterStates[currentLetter]) {
      setLetterStates(prev => ({ ...prev, [currentLetter]: "pasapalabra" }));
    }

    setAnswerInput("");
    const nextIndex = findNextQuestion();
    setCurrentIndex(nextIndex);
  };

  // Función para validar respuesta del input
  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (!gameActive || !answerInput.trim()) return;

    const userAnswer = answerInput.trim().toUpperCase();
    const correctAnswer = questions[currentIndex].answer.toUpperCase();

    if (userAnswer === correctAnswer) {
      handleCorrect();
    } else {
      handleIncorrect();
    }

    setAnswerInput("");
  };

  // Iniciar juego desde el menú
  const startGame = async () => {
    const fetchedQuestions = await fetchQuestions();
    if (!fetchedQuestions) return; // Si hay error, no iniciar el juego

    setGameStarted(true);
    setCountdown(3); // Iniciar countdown de 3 segundos
    setCurrentIndex(0);
    setLetterStates({});

    // Inicializar tiempos después de obtener las preguntas
    const times = {};
    fetchedQuestions.forEach(q => {
      times[q.letter] = 30;
    });
    setLetterTimes(times);

    setScore(0);
    setGameActive(true);
    setAnswerInput("");
  };

  // Reiniciar juego
  const resetGame = () => {
    setGameStarted(false);
    setCountdown(null);
    setCurrentIndex(0);
    setLetterStates({});
    setLetterTimes({});
    setScore(0);
    setGameActive(true);
    setAnswerInput("");
  };

  // Formato del tiempo en segundos
  const formatTime = (seconds) => {
    return `${seconds}s`;
  };

  // Obtener color según estado de la letra
  const getLetterColor = (letter) => {
    const state = letterStates[letter];
    if (state === "correct") return "#4CAF50";
    if (state === "incorrect") return "#f44336";
    if (state === "pasapalabra") return "#2196F3";
    return "#e0e0e0";
  };

  // Valores seguros para cuando no hay preguntas cargadas
  const currentLetter = questions.length > 0 ? questions[currentIndex]?.letter : 'A';
  const currentTime = letterTimes[currentLetter] || 0;

  // Mostrar menú inicial si el juego no ha comenzado
  if (!gameStarted) {
    return (
      <div className="app-container">
        <div className="menu-screen">
          <h1 className="menu-title">Pasapalabra</h1>
          <p className="menu-subtitle">¿Estás listo para el desafío?</p>

          <div className="difficulty-selector">
            <p className="difficulty-label">Selecciona la dificultad:</p>
            <div className="difficulty-buttons">
              <button
                className={`btn-difficulty easy ${difficulty === 'easy' ? 'active' : ''}`}
                onClick={() => setDifficulty('easy')}
              >
                FÁCIL
              </button>
              <button
                className={`btn-difficulty medium ${difficulty === 'medium' ? 'active' : ''}`}
                onClick={() => setDifficulty('medium')}
              >
                MEDIO
              </button>
              <button
                className={`btn-difficulty hard ${difficulty === 'hard' ? 'active' : ''}`}
                onClick={() => setDifficulty('hard')}
              >
                DIFÍCIL
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <p className="error-hint">Ejecuta: npm run seed (para poblar la BD) y npm run server (para iniciar el backend)</p>
            </div>
          )}

          <button
            onClick={startGame}
            className="btn menu-button"
            disabled={loading}
          >
            {loading ? 'CARGANDO...' : 'INICIAR JUEGO'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Countdown Overlay */}
      {countdown !== null && (
        <div className="countdown-overlay">
          <div className="countdown-number">
            {countdown > 0 ? countdown : '¡Ya!'}
          </div>
        </div>
      )}

      <header className="header">
        <h1 className="title">Pasapalabra</h1>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">Tiempo:</span>
            <span className={`stat-value ${currentTime <= 5 ? 'time-warning' : ''}`}>
              {formatTime(currentTime)}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Aciertos:</span>
            <span className="stat-value">{score}/26</span>
          </div>
        </div>
      </header>

      <div className="question-panel">
        <p className="question-text">
          {gameActive ? questions[currentIndex]?.question : "¡Juego terminado!"}
        </p>
      </div>

      <div className="game-layout">
        {/* Botón izquierdo - PASAPALABRA */}
        <div className="side-button-container left">
          <button
            onClick={handlePasapalabra}
            className="btn btn-pasapalabra side-button"
            disabled={!gameActive || countdown !== null}
          >
            PASAPALABRA
          </button>
        </div>

        {/* Rosco central */}
        <div className="center-content">
          <div className="rosco-container">
            {questions.map((q, index) => {
              const angle = (360 / 26) * index;
              const radius = 200;
              const x = Math.sin((angle * Math.PI) / 180) * radius;
              const y = -Math.cos((angle * Math.PI) / 180) * radius;
              const isActive = index === currentIndex;
              const letterTime = letterTimes[q.letter];
              const isLowTime = letterTime <= 5;
              const isCorrect = letterStates[q.letter] === "correct";
              const isIncorrect = letterStates[q.letter] === "incorrect";

              return (
                <div
                  key={q.letter}
                  className={`letter ${isActive ? 'active' : ''} ${isLowTime && !letterStates[q.letter] ? 'low-time' : ''} ${isCorrect ? 'correct' : ''} ${isIncorrect ? 'incorrect' : ''}`}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                    backgroundColor: getLetterColor(q.letter)
                  }}
                >
                  <span className="letter-text">{q.letter}</span>
                  {!isCorrect && !isIncorrect && (
                    <span className="letter-time">{letterTime}</span>
                  )}
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmitAnswer} className="input-section">
            <input
              ref={inputRef}
              type="text"
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              placeholder="Escribe tu respuesta..."
              className="answer-input"
              disabled={!gameActive || countdown !== null}
              autoComplete="off"
            />
          </form>
        </div>

        {/* Botón derecho - VOLVER AL MENÚ */}
        <div className="side-button-container right">
          <button onClick={resetGame} className="btn btn-reset side-button">
            VOLVER AL MENÚ
          </button>
        </div>
      </div>

      {!gameActive && (
        <div className="game-over">
          <h2>¡Juego Terminado!</h2>
          <p>Puntuación Final: {score}/26</p>
          <button onClick={resetGame} className="btn btn-reset">
            VOLVER AL MENÚ
          </button>
        </div>
      )}
    </div>
  );
}

export default App;