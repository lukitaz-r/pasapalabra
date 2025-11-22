# Pasapalabra - Juego con MongoDB

## 📋 Descripción
Juego de Pasapalabra con integración de MongoDB para almacenar múltiples preguntas por letra y seleccionarlas aleatoriamente en cada partida.

## 🚀 Características
- ✅ Menú inicial animado
- ✅ Input de texto para respuestas
- ✅ Validación automática de respuestas
- ✅ Base de datos MongoDB con preguntas aleatorias
- ✅ Backend Express + API REST
- ✅ Frontend React + Vite

## 📦 Requisitos Previos

### Opción 1: MongoDB Local
1. Instalar MongoDB Community Edition:
   - Windows: https://www.mongodb.com/try/download/community
   - Mac: `brew install mongodb-community`
   - Linux: https://docs.mongodb.com/manual/administration/install-on-linux/

2. Iniciar MongoDB:
   ```bash
   # Windows (como servicio)
   net start MongoDB
   
   # Mac/Linux
   brew services start mongodb-community
   # o
   mongod
   ```

### Opción 2: MongoDB Atlas (Cloud - Gratis)
1. Crear cuenta en https://www.mongodb.com/cloud/atlas
2. Crear un cluster gratuito
3. Obtener el connection string
4. Actualizar `.env` con tu connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pasapalabra?retryWrites=true&w=majority
   ```

## 🛠️ Instalación

1. **Instalar dependencias** (ya hecho):
   ```bash
   pnpm install
   ```

2. **Configurar variables de entorno**:
   - El archivo `.env` ya está creado con configuración local
   - Si usas MongoDB Atlas, edita `.env` con tu connection string

3. **Poblar la base de datos**:
   ```bash
   npm run seed
   ```
   
   Deberías ver:
   ```
   ✅ Conectado a MongoDB
   🗑️  Base de datos limpiada
   ✅ 78 preguntas insertadas exitosamente
   📊 Resumen de preguntas por letra:
      A: 3 pregunta(s)
      B: 3 pregunta(s)
      ...
   ```

## 🎮 Uso

### Modo Desarrollo (Frontend + Backend juntos)
```bash
npm start
```
Esto inicia:
- Backend en http://localhost:5000
- Frontend en http://localhost:5173

### Modo Individual

**Solo Frontend:**
```bash
npm run dev
```

**Solo Backend:**
```bash
npm run server
```

## 📁 Estructura del Proyecto

```
pasapalabra/
├── server/
│   ├── models/
│   │   └── Question.js       # Modelo de Mongoose
│   ├── routes/
│   │   └── questions.js      # Rutas de API
│   ├── server.js             # Servidor Express
│   └── seed.js               # Script para poblar BD
├── src/
│   ├── App.jsx               # Componente principal
│   ├── App.css               # Estilos
│   └── main.jsx
├── .env                      # Variables de entorno
├── .env.example              # Plantilla de variables
└── package.json
```

## 🔌 API Endpoints

### GET `/api/questions/random`
Obtiene una pregunta aleatoria por cada letra (26 total).

**Respuesta:**
```json
[
  {
    "letter": "A",
    "question": "Comienza con A. Reptil constrictor...",
    "answer": "ANACONDA"
  },
  ...
]
```

### GET `/api/questions`
Obtiene todas las preguntas de la base de datos.

### POST `/api/questions`
Agrega una nueva pregunta.

**Body:**
```json
{
  "letter": "A",
  "question": "Tu pregunta aquí",
  "answer": "RESPUESTA"
}
```

## 🎯 Cómo Jugar

1. Abre http://localhost:5173
2. Haz clic en "INICIAR JUEGO"
3. Lee la pregunta
4. Escribe tu respuesta en el input
5. Presiona Enter para enviar
6. Usa "PASAPALABRA" para saltar preguntas
7. ¡Completa el rosco!

## 🐛 Solución de Problemas

### Error: "No se pudieron cargar las preguntas"
- Verifica que MongoDB esté corriendo
- Verifica que el backend esté corriendo (`npm run server`)
- Revisa la consola del backend para errores

### Error al ejecutar `npm run seed`
- Asegúrate de que MongoDB esté corriendo
- Verifica el connection string en `.env`
- Para MongoDB Atlas, verifica que tu IP esté en la whitelist

### Puerto 5000 ya en uso
- Cambia el puerto en `.env`:
  ```
  PORT=5001
  ```
- Actualiza la URL en `src/App.jsx` línea 30:
  ```javascript
  const response = await axios.get('http://localhost:5001/api/questions/random');
  ```

## 📝 Agregar Más Preguntas

### Opción 1: Editar seed.js
1. Abre `server/seed.js`
2. Agrega preguntas al array `sampleQuestions`
3. Ejecuta `npm run seed`

### Opción 2: Usar la API
```bash
curl -X POST http://localhost:5000/api/questions \
  -H "Content-Type: application/json" \
  -d '{
    "letter": "A",
    "question": "Tu pregunta",
    "answer": "RESPUESTA"
  }'
```

## 🔧 Scripts Disponibles

- `npm run dev` - Inicia solo el frontend
- `npm run server` - Inicia solo el backend
- `npm run seed` - Puebla la base de datos
- `npm start` - Inicia frontend y backend juntos
- `npm run build` - Construye para producción

## ☁️ Como desplegar la página

Aquí esta una guía rápida de como desplegar la página a internet para probar su funcionamiento en producción.

[Guía de despliegue](https://github.com/lukitaz-r/pasapalabra/blob/main/DEPLOYMENT.md)

## 📄 Licencia
MIT

## 👨‍💻 Autor
Desarrollado por Luca Ramirez, con ❤️ para el juego de Pasapalabra
