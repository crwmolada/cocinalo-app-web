# Cocínalo - Sistema de Gestión de Recetas

## Descripción
Cocínalo es una aplicación web que permite a los usuarios gestionar sus recetas favoritas y planificar sus comidas a través de un calendario interactivo. Los usuarios pueden registrarse, iniciar sesión y visualizar variedad de categorias en comida y diferenctes recetas.

## Características
- Autenticación de usuarios (registro e inicio de sesión)
- Calendario interactivo para planificación de comidas
- Categorías de recetas
- Visualización de recetas por categoría
- Mensajes de feedback para el usuario
- Protección de rutas
- Manejo de sesiones con JWT

## Tecnologías Utilizadas
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

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Autenticación Global
Todos los endpoints protegidos requieren el siguiente header:
```javascript
headers: {
  'Authorization': 'Bearer <token_jwt>'
}
```

### Formato de Respuestas

#### Respuesta Exitosa:
```javascript
{
  "status": "success",
  "data": {
    // datos específicos de la respuesta
  }
}
```

#### Respuesta de Error:
```javascript
{
  "status": "error",
  "message": "Descripción del error"
}
```

### Códigos de Estado HTTP
| Código | Descripción |
|--------|-------------|
| 200 | Petición exitosa |
| 201 | Recurso creado exitosamente |
| 400 | Error en la petición |
| 401 | No autorizado |
| 403 | Prohibido |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

### Endpoints de Autenticación
| Método | Endpoint | Auth Required | Descripción |
|--------|----------|---------------|-------------|
| POST | `/auth/register` | No | Registro de usuario |
| POST | `/auth/login` | No | Inicio de sesión |

#### Ejemplos:
```javascript

// registro
POST /api/auth/register
{
  "nombre": "Usuario Ejemplo",
  "correo": "usuario@ejemplo.com",
  "apellido": "Usuario Apellido",
  "password": "contraseña123"
}

// login
POST /api/auth/login
{
  "correo": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

### Endpoints de Recetas
| Método | Endpoint | Auth Required | Descripción |
|--------|----------|---------------|-------------|
| GET | `/recipes/categories` | No | Obtener categorías |
| GET | `/recipes/search?q=:query` | No | Buscar recetas |
| GET | `/recipes/category/:category` | No | Recetas por categoría |
| GET | `/recipes/:id` | No | Detalles de receta |

#### Ejemplos:
```javascript
// Búsqueda
GET /api/recipes/search?q=pasta

// Categoría específica
GET /api/recipes/category/italiana

// Receta específica
GET /api/recipes/123
```

### Endpoints de Calendario
| Método | Endpoint | Auth Required | Descripción |
|--------|----------|---------------|-------------|
| POST | `/calendar` | Sí | Crear evento |
| GET | `/calendar` | Sí | Obtener eventos |
| DELETE | `/calendar/:id` | Sí | Eliminar evento |

#### Ejemplos:
```javascript
// Crear evento
POST /api/calendar
{
  "title": "Preparar Pasta",
  "day": 15,
  "month": 3,
  "year": 2024,
  "timeFrom": "14:00",
  "timeTo": "15:00"
}

// Obtener eventos
GET /api/calendar

// Eliminar evento
DELETE /api/calendar/123
```

## Instalación

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
PORT=5000
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
https://pastebin.com/5gw2DHPX

# Pre visualización

![Captura de pantalla 2024-11-20 180907](https://github.com/user-attachments/assets/d6dab7e6-349f-47a0-8642-cc9220638046)
![Captura de pantalla 2024-11-18 153151](https://github.com/user-attachments/assets/962737b2-59e3-402c-810d-d2c5825a2932)
![Captura de pantalla 2024-11-18 153213](https://github.com/user-attachments/assets/8e794026-0b91-465e-b37b-c595ea632aa5)
![Captura de pantalla 2024-11-18 153239](https://github.com/user-attachments/assets/61240d5c-b31b-4fed-832f-ab621284fcaa)
![Captura de pantalla 2024-11-19 205506](https://github.com/user-attachments/assets/807e5898-d889-4855-bde2-7e7bf4183e8e)
![Captura de pantalla 2024-11-18 153254](https://github.com/user-attachments/assets/6ce1780c-c490-441f-9770-b858435b61e3)
![Captura de pantalla 2024-11-18 153325](https://github.com/user-attachments/assets/bd8b50b0-1714-4730-8747-b70848fd0c96)
![Captura de pantalla 2024-11-18 153341](https://github.com/user-attachments/assets/6877c59e-dac5-466c-b964-f012842f05ec)



















