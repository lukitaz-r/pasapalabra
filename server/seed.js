import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pasapalabra';

// Preguntas de ejemplo - múltiples por letra para variedad
const sampleQuestions = [
  // Letra A
  { letter: "A", question: "Comienza con A. Reptil constrictor sudamericano de gran tamaño.", answer: "ANACONDA" },
  { letter: "A", question: "Comienza con A. Capital de Grecia.", answer: "ATENAS" },
  { letter: "A", question: "Comienza con A. Fruto tropical amarillo con forma ovalada y piel rugosa.", answer: "AGUACATE" },
  
  // Letra B
  { letter: "B", question: "Contiene B. Instrumento de viento de madera con doble lengüeta.", answer: "OBOE" },
  { letter: "B", question: "Comienza con B. Deporte que se juega con una pelota naranja y dos canastas.", answer: "BASQUET" },
  { letter: "B", question: "Comienza con B. Animal mamífero que vive en el agua y es muy grande.", answer: "BALLENA" },
  
  // Letra C
  { letter: "C", question: "Comienza con C. Metal precioso de color rojizo.", answer: "COBRE" },
  { letter: "C", question: "Comienza con C. Bebida caliente hecha con granos tostados.", answer: "CAFE" },
  { letter: "C", question: "Comienza con C. Animal felino doméstico.", answer: "GATO" },
  
  // Letra D
  { letter: "D", question: "Comienza con D. Juego de mesa con fichas numeradas.", answer: "DOMINO" },
  { letter: "D", question: "Comienza con D. Moneda de Estados Unidos.", answer: "DOLAR" },
  { letter: "D", question: "Comienza con D. Parte del cuerpo que usamos para masticar.", answer: "DIENTE" },
  
  // Letra E
  { letter: "E", question: "Comienza con E. Fenómeno astronómico donde la luna tapa al sol.", answer: "ECLIPSE" },
  { letter: "E", question: "Comienza con E. Animal con trompa y grandes orejas.", answer: "ELEFANTE" },
  { letter: "E", question: "Comienza con E. Construcción muy alta de varios pisos.", answer: "EDIFICIO" },
  
  // Letra F
  { letter: "F", question: "Comienza con F. Deporte que se juega con una pelota redonda y dos porterías.", answer: "FUTBOL" },
  { letter: "F", question: "Comienza con F. Planta que produce oxígeno mediante fotosíntesis.", answer: "FLOR" },
  { letter: "F", question: "Comienza con F. Mes del año que tiene 28 o 29 días.", answer: "FEBRERO" },
  
  // Letra G
  { letter: "G", question: "Comienza con G. Instrumento musical de seis cuerdas.", answer: "GUITARRA" },
  { letter: "G", question: "Comienza con G. Animal que hace 'miau'.", answer: "GATO" },
  { letter: "G", question: "Comienza con G. Deporte que se juega en un campo verde con un palo y una pelota pequeña.", answer: "GOLF" },
  
  // Letra H
  { letter: "H", question: "Comienza con H. Día actual.", answer: "HOY" },
  { letter: "H", question: "Comienza con H. Insecto que produce miel.", answer: "ABEJA" },
  { letter: "H", question: "Comienza con H. Órgano vital que bombea sangre.", answer: "CORAZON" },
  
  // Letra I
  { letter: "I", question: "Comienza con I. Variante de un elemento con distinto número de neutrones.", answer: "ISOTOPO" },
  { letter: "I", question: "Comienza con I. País europeo con forma de bota.", answer: "ITALIA" },
  { letter: "I", question: "Comienza con I. Continente helado en el polo sur.", answer: "ANTARTIDA" },
  
  // Letra J
  { letter: "J", question: "Comienza con J. Árbol ornamental de flores violetas originario de Sudamérica.", answer: "JACARANDA" },
  { letter: "J", question: "Comienza con J. Animal felino con manchas.", answer: "JAGUAR" },
  { letter: "J", question: "Comienza con J. Deporte de combate originario de Japón.", answer: "JUDO" },
  
  // Letra K
  { letter: "K", question: "Comienza con K. Unidad de longitud igual a mil metros.", answer: "KILOMETRO" },
  { letter: "K", question: "Comienza con K. Arte marcial coreano.", answer: "KARATE" },
  { letter: "K", question: "Comienza con K. Unidad de peso igual a mil gramos.", answer: "KILO" },
  
  // Letra L
  { letter: "L", question: "Comienza con L. Metal alcalino de número atómico 3.", answer: "LITIO" },
  { letter: "L", question: "Comienza con L. Satélite natural de la Tierra.", answer: "LUNA" },
  { letter: "L", question: "Comienza con L. Animal felino conocido como el rey de la selva.", answer: "LEON" },
  
  // Letra M
  { letter: "M", question: "Comienza con M. Hidrocarburo más simple y componente principal del gas natural.", answer: "METANO" },
  { letter: "M", question: "Comienza con M. Fruta tropical amarilla alargada.", answer: "MANGO" },
  { letter: "M", question: "Comienza con M. Capital de España.", answer: "MADRID" },
  
  // Letra N
  { letter: "N", question: "Comienza con N. Líquido azucarado producido por las plantas que atrae polinizadores.", answer: "NECTAR" },
  { letter: "N", question: "Comienza con N. Fenómeno meteorológico blanco y frío.", answer: "NIEVE" },
  { letter: "N", question: "Comienza con N. Número que viene después del ocho.", answer: "NUEVE" },
  
  // Letra O
  { letter: "O", question: "Comienza con O. Gas esencial para la respiración.", answer: "OXIGENO" },
  { letter: "O", question: "Comienza con O. Animal marino con ocho tentáculos.", answer: "PULPO" },
  { letter: "O", question: "Comienza con O. Metal precioso de color amarillo.", answer: "ORO" },
  
  // Letra P
  { letter: "P", question: "Comienza con P. Reptil volador fósil del Mesozoico.", answer: "PTERODACTILO" },
  { letter: "P", question: "Comienza con P. Fruta cítrica de color naranja.", answer: "NARANJA" },
  { letter: "P", question: "Comienza con P. Capital de Francia.", answer: "PARIS" },
  
  // Letra Q
  { letter: "Q", question: "Comienza con Q. Alcaloide antiparasitario extraído de la corteza de la quina.", answer: "QUININA" },
  { letter: "Q", question: "Comienza con Q. Producto lácteo amarillo que se hace con leche.", answer: "QUESO" },
  { letter: "Q", question: "Comienza con Q. Ciencia que estudia las sustancias y sus transformaciones.", answer: "QUIMICA" },
  
  // Letra R
  { letter: "R", question: "Comienza con R. Órgano que filtra la sangre en el cuerpo humano.", answer: "RIÑON" },
  { letter: "R", question: "Comienza con R. Animal roedor de cola larga.", answer: "RATON" },
  { letter: "R", question: "Comienza con R. Capital de Italia.", answer: "ROMA" },
  
  // Letra S
  { letter: "S", question: "Contiene S. Hallazgo afortunado e inesperado.", answer: "SERENDIPIA" },
  { letter: "S", question: "Comienza con S. Estrella que ilumina la Tierra.", answer: "SOL" },
  { letter: "S", question: "Comienza con S. Animal reptil sin patas.", answer: "SERPIENTE" },
  
  // Letra T
  { letter: "T", question: "Comienza con T. Rama matemática que estudia propiedades invariantes por deformación continua.", answer: "TOPOLOGIA" },
  { letter: "T", question: "Comienza con T. Aparato para ver programas y películas.", answer: "TELEVISION" },
  { letter: "T", question: "Comienza con T. Bebida caliente hecha con hojas.", answer: "TE" },
  
  // Letra U
  { letter: "U", question: "Comienza con U. Que está presente en todas partes; omnipresente.", answer: "UBICUO" },
  { letter: "U", question: "Comienza con U. Fruta pequeña de color morado.", answer: "UVA" },
  { letter: "U", question: "Comienza con U. Último mes del año.", answer: "DICIEMBRE" },
  
  // Letra V
  { letter: "V", question: "Comienza con V. Propiedad de los fluidos de resistir el flujo.", answer: "VISCOSIDAD" },
  { letter: "V", question: "Comienza con V. Color que resulta de mezclar rojo y azul.", answer: "VIOLETA" },
  { letter: "V", question: "Comienza con V. Día anterior a hoy.", answer: "AYER" },
  
  // Letra W
  { letter: "W", question: "Comienza con W. Tecnología de red inalámbrica de área local.", answer: "WIFI" },
  { letter: "W", question: "Comienza con W. Bebida alcohólica escocesa.", answer: "WHISKY" },
  { letter: "W", question: "Comienza con W. Red mundial de información.", answer: "WEB" },
  
  // Letra X
  { letter: "X", question: "Comienza con X. Actitud positiva de rechazo u hostilidad hacia lo extranjero.", answer: "XENOFOBIA" },
  { letter: "X", question: "Comienza con X. Instrumento musical de percusión con láminas.", answer: "XILOFONO" },
  { letter: "X", question: "Comienza con X. Gas noble de número atómico 54.", answer: "XENON" },
  
  // Letra Y
  { letter: "Y", question: "Comienza con Y. Depósito natural de minerales, petróleo o gas.", answer: "YACIMIENTO" },
  { letter: "Y", question: "Comienza con Y. Deporte de combate japonés.", answer: "YUDO" },
  { letter: "Y", question: "Comienza con Y. Planta de hojas largas y puntiagudas.", answer: "YUCA" },
  
  // Letra Z
  { letter: "Z", question: "Comienza con Z. Célula resultante de la unión de dos gametos.", answer: "ZIGOTO" },
  { letter: "Z", question: "Comienza con Z. Animal equino con rayas blancas y negras.", answer: "CEBRA" },
  { letter: "Z", question: "Comienza con Z. Calzado que cubre el pie.", answer: "ZAPATO" }
];

async function seedDatabase() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar colección existente
    await Question.deleteMany({});
    console.log('🗑️  Base de datos limpiada');

    // Insertar preguntas con dificultades
    // Asignar dificultad cíclica: fácil, medio, difícil
    const questionsWithDifficulty = sampleQuestions.map((q, index) => {
      const difficulties = ['easy', 'medium', 'hard'];
      return {
        ...q,
        difficulty: difficulties[index % 3]
      };
    });

    await Question.insertMany(questionsWithDifficulty);
    console.log(`✅ ${questionsWithDifficulty.length} preguntas insertadas exitosamente`);

    // Mostrar resumen
    const letterCounts = await Question.aggregate([
      { $group: { _id: '$letter', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📊 Resumen de preguntas por letra:');
    letterCounts.forEach(({ _id, count }) => {
      console.log(`   ${_id}: ${count} pregunta(s)`);
    });

    console.log('\n✨ Base de datos poblada exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
    process.exit(1);
  }
}

seedDatabase();
