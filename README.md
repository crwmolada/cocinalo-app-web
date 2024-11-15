# Cocínalo - Sistema de Gestión de Recetas

## 📝 Descripción
Cocínalo es una aplicación web que permite a los usuarios gestionar sus recetas favoritas y planificar sus comidas a través de un calendario interactivo. Los usuarios pueden registrarse, iniciar sesión y visualizar variedad de categorias en comida y diferenctes recetas.

## 🚀 Características
- Autenticación de usuarios (registro e inicio de sesión)
- Calendario interactivo para planificación de comidas
- Mensajes de feedback para el usuario
- Protección de rutas
- Manejo de sesiones con JWT

## 🛠️ Tecnologías Utilizadas
### Frontend
- React.js
- React Router DOM
- SASS/SCSS
- Axios
- Font Awesome
- React Icons

### Backend
- Node.js
- Express.js
- MySQL
- JWT para autenticación
- Bcrypt para encriptación
- CORS

## 📦 Instalación

1. Clonar el repositorio
```
git clone https://github.com/crwmolada/cocinalo-app-web.git
```
2. Instalar dependencias en el frontend
```
cd client
npm install
```
3. Instalar dependencias en el backend
```
cd server
npm install
```
4. Configurar variables de entorno
```
En /server crear un archivo .env
DB_HOST=tu_host
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_db
JWT_SECRET=tu_secret_key
```
5. Iniciar el servidor
```
Terminal 1 - Backend
cd server
npm start
Terminal 2 - Frontend
cd client
npm start
```

6. Estructura de la base de datos
https://pastebin.com/9tNu1JPn

# Pre visualización
![Captura de pantalla 2024-11-12 192857](https://github.com/user-attachments/assets/e2604120-3fc2-4be7-84f1-d6348fcf944c)

![Captura de pantalla 2024-11-12 192909](https://github.com/user-attachments/assets/0c3a2dcb-ac12-4ce5-a4db-a97a265b8188)

![Captura de pantalla 2024-11-12 192919](https://github.com/user-attachments/assets/a14a2c2c-6344-4cda-8935-1b3c1cc19045)

![Captura de pantalla 2024-11-12 191955](https://github.com/user-attachments/assets/4a7acdc8-43ee-4952-b51e-9d0e20901d8b)

![Captura de pantalla 2024-11-12 192004](https://github.com/user-attachments/assets/1918f566-360c-4269-a48e-3b3391d8fad6)







