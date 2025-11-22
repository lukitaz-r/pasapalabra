import express from 'express';
import Question from '../models/Question.js';

const router = express.Router();

// GET /api/questions/random - Obtiene una pregunta aleatoria por cada letra
router.get('/random', async (req, res) => {
  try {
    const { difficulty = 'medium' } = req.query;
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const randomQuestions = [];

    // Para cada letra, obtener una pregunta aleatoria
    for (const letter of letters) {
      // Intentar buscar por dificultad específica
      let count = await Question.countDocuments({ letter, difficulty });
      let question;

      if (count > 0) {
        const random = Math.floor(Math.random() * count);
        question = await Question.findOne({ letter, difficulty }).skip(random);
      } else {
        // Si no hay preguntas de esa dificultad, buscar cualquiera para esa letra (fallback)
        count = await Question.countDocuments({ letter });
        if (count === 0) {
          return res.status(404).json({ 
            error: `No hay preguntas disponibles para la letra ${letter}` 
          });
        }
        const random = Math.floor(Math.random() * count);
        question = await Question.findOne({ letter }).skip(random);
      }
      
      randomQuestions.push({
        letter: question.letter,
        question: question.question,
        answer: question.answer,
        difficulty: question.difficulty
      });
    }

    res.json(randomQuestions);
  } catch (error) {
    console.error('Error obteniendo preguntas:', error);
    res.status(500).json({ error: 'Error del servidor al obtener preguntas' });
  }
});

// GET /api/questions - Obtiene todas las preguntas (para administración)
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find().sort({ letter: 1 });
    res.json(questions);
  } catch (error) {
    console.error('Error obteniendo preguntas:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// POST /api/questions - Agregar nueva pregunta (para administración)
router.post('/', async (req, res) => {
  try {
    const { letter, question, answer } = req.body;
    
    if (!letter || !question || !answer) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const newQuestion = new Question({
      letter: letter.toUpperCase(),
      question,
      answer: answer.toUpperCase()
    });

    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Error creando pregunta:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

export default router;
