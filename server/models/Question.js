import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  letter: {
    type: String,
    required: true,
    uppercase: true,
    maxlength: 1,
    index: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true,
    uppercase: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
    index: true
  }
}, {
  timestamps: true
});

// Index para búsquedas eficientes por letra
questionSchema.index({ letter: 1 });

const Question = mongoose.model('Question', questionSchema);

export default Question;
