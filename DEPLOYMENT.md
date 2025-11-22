# Guía de Despliegue - Pasapalabra

Este proyecto es una aplicación **Full Stack** (Frontend React + Backend Express + Base de Datos MongoDB).

> ⚠️ **IMPORTANTE:** GitHub Pages solo aloja contenido estático (Frontend). No puede ejecutar el servidor Backend (Node.js/Express).

Para desplegar la aplicación completa, necesitas dos partes:
1. **Backend + Base de Datos:** Un servidor que ejecute Node.js y MongoDB.
2. **Frontend:** El sitio web que ven los usuarios.

A continuación, te presento la forma más sencilla y gratuita de desplegar todo.

---

## Paso 1: Base de Datos (MongoDB Atlas)

Necesitas una base de datos en la nube.

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) y crea una cuenta gratuita.
2. Crea un **Cluster** gratuito (M0 Sandbox).
3. En **Database Access**, crea un usuario y contraseña.
4. En **Network Access**, permite acceso desde cualquier lugar (`0.0.0.0/0`).
5. Obtén tu **Connection String** (se ve como `mongodb+srv://usuario:password@cluster...`).

---

## Paso 2: Backend (Render.com)

Render es excelente para desplegar servidores Node.js gratis.

1. Sube tu código a **GitHub** (si no lo has hecho).
2. Crea una cuenta en [Render](https://render.com).
3. Haz clic en **New +** -> **Web Service**.
4. Conecta tu repositorio de GitHub.
5. Configura el servicio:
   - **Name:** `pasapalabra-api` (o lo que quieras)
   - **Root Directory:** `.` (raíz)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server/server.js`
6. En la sección **Environment Variables**, agrega:
   - `MONGODB_URI`: (Tu connection string de MongoDB Atlas)
   - `PORT`: `10000` (Render usa este puerto por defecto)
7. Haz clic en **Create Web Service**.

Render te dará una URL (ej: `https://pasapalabra-api.onrender.com`). **Guárdala**, la necesitarás para el frontend.

> **Nota:** El plan gratuito de Render se "duerme" tras inactividad. La primera petición puede tardar 50 segundos en despertar.

---

## Paso 3: Frontend (GitHub Pages o Vercel)

Recomiendo **Vercel** sobre GitHub Pages para aplicaciones React/Vite porque es más fácil de configurar, pero aquí están ambas opciones.

### Opción A: Vercel (Recomendada)
1. Ve a [Vercel](https://vercel.com) y conecta tu GitHub.
2. Importa tu repositorio `pasapalabra`.
3. En **Environment Variables**, agrega:
   - `VITE_API_URL`: `https://pasapalabra-api.onrender.com` (La URL de tu backend en Render, **sin** la barra al final).
4. Haz clic en **Deploy**.

¡Listo! Vercel detecta que es Vite y lo configura automáticamente.

### Opción B: GitHub Pages
Si prefieres usar GitHub Pages estrictamente:

1. En tu `vite.config.js`, agrega la base si no es la raíz (generalmente no es necesario si usas dominio personalizado, pero para `usuario.github.io/repo` sí):
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/nombre-de-tu-repo/', // Reemplaza con el nombre de tu repo
   })
   ```

2. Instala `gh-pages`:
   ```bash
   npm install gh-pages --save-dev
   ```

3. En `package.json`, agrega estos scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```

4. Crea un archivo `.env.production` en la raíz del proyecto:
   ```
   VITE_API_URL=https://pasapalabra-api.onrender.com
   ```

5. Ejecuta el despliegue:
   ```bash
   npm run deploy
   ```

---

## Resumen de Arquitectura Desplegada

```mermaid
graph LR
    User[Usuario] -->|Visita| Frontend[Frontend (Vercel/GH Pages)]
    Frontend -->|API Request| Backend[Backend (Render)]
    Backend -->|Query| DB[(MongoDB Atlas)]
```

## Poblar la Base de Datos en Producción

Una vez desplegado el backend, necesitarás cargar las preguntas en la base de datos de producción (Atlas).

Puedes hacerlo desde tu máquina local conectándote a la base de datos remota:

1. En tu archivo `.env` **local**, cambia temporalmente `MONGODB_URI` por la URL de Atlas.
2. Ejecuta `npm run seed`.
3. Vuelve a poner tu URI local en el `.env`.

O puedes agregar un script en el `package.json` de producción para correr el seed, pero hacerlo localmente es más seguro y controlado.
