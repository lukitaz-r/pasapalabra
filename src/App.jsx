import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import Menu from './components/Menu';
import Game from './components/Game';
import GameOver from './components/GameOver';

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
    }, 1600);

    return () => clearTimeout(timer);
  }, [countdown]);


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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (!gameStarted) {
    return (
      <Menu
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        startGame={startGame}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <>
      <Game
        questions={questions}
        currentIndex={currentIndex}
        letterStates={letterStates}
        letterTimes={letterTimes}
        score={score}
        gameActive={gameActive}
        answerInput={answerInput}
        setAnswerInput={setAnswerInput}
        handlePasapalabra={handlePasapalabra}
        handleSubmitAnswer={handleSubmitAnswer}
        resetGame={resetGame}
        countdown={countdown}
      />
      {!gameActive && (
        <GameOver
          score={score}
          totalQuestions={questions.length}
          resetGame={resetGame}
        />
      )}
    </>
  );
}

export default App;