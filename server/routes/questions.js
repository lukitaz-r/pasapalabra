import express from 'express';
import Question from '../models/Question.js';

const router = express.Router();

// GET /api/questions/random - Obtiene una pregunta aleatoria por cada letra
router.get('/random', async (req, res) => {
  try {
    const { difficulty = 'medium' } = req.query;
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    // Create an array of promises to fetch questions in parallel
    const questionPromises = letters.map(async (letter) => {
      // Try to find by specific difficulty
      const countSpecific = await Question.countDocuments({ letter, difficulty });
      
      if (countSpecific > 0) {
        const random = Math.floor(Math.random() * countSpecific);
        return Question.findOne({ letter, difficulty }).skip(random);
      }
      
      // Fallback: any difficulty for this letter
      const countAny = await Question.countDocuments({ letter });
      if (countAny === 0) {
        throw new Error(`No hay preguntas disponibles para la letra ${letter}`);
      }
      
      const random = Math.floor(Math.random() * countAny);
      return Question.findOne({ letter }).skip(random);
    });

    const questions = await Promise.all(questionPromises);

    const randomQuestions = questions.map(q => ({
      letter: q.letter,
      question: q.question,
      answer: q.answer,
      difficulty: q.difficulty
    }));

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
