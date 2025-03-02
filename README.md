# Club Deportivo Quito - Sitio Web Oficial

Un sitio web dinámico y moderno para Club Deportivo Quito con sistema de administración integrado.

## 🌟 Características

- **Resultados de Partidos en Vivo**: Integración con API deportiva para mostrar resultados en tiempo real
- **Sistema de Noticias Automatizado**: Gestión dinámica de noticias desde el panel de administración
- **Calendario de Partidos Interactivo**: Visualización filtrable de próximos partidos con cuenta regresiva
- **Panel de Administración Completo**: Gestión del sitio sin necesidad de conocimientos técnicos
- **Diseño Responsivo**: Experiencia óptima en dispositivos móviles y de escritorio

## 🚀 Tecnologías Utilizadas

- **Frontend**: HTML, CSS, JavaScript, React.js
- **Backend**: Node.js, Express.js
- **Base de Datos**: MongoDB
- **Autenticación**: JWT (JSON Web Tokens)
- **Despliegue**: GitHub Pages

## 📋 Requisitos Previos

- Node.js (v14.0.0 o superior)
- MongoDB (v4.0.0 o superior)
- npm (v6.0.0 o superior)

## ⚙️ Instalación

1. Clonar el repositorio:
   ```
   git clone https://github.com/yourusername/club-deportivo-quito.git
   cd club-deportivo-quito
   ```

2. Instalar dependencias del frontend:
   ```
   cd client
   npm install
   ```

3. Instalar dependencias del backend:
   ```
   cd ../server
   npm install
   ```

4. Configurar variables de entorno:
   - Crea un archivo `.env` en la carpeta `server` con las siguientes variables:
     ```
     PORT=5000
     MONGODB_URI=tu_uri_de_mongodb
     JWT_SECRET=tu_clave_secreta_para_jwt
     SPORTS_API_KEY=tu_clave_api_deportiva
     ```

5. Iniciar la aplicación:
   ```
   # Iniciar el servidor (desde la carpeta server)
   npm run start

   # Iniciar el cliente (desde la carpeta client)
   npm run start
   ```

## 📱 Uso del Panel de Administración

1. Accede al panel de administración en `/admin`
2. Inicia sesión con las credenciales proporcionadas
3. Desde el panel podrás:
   - Gestionar noticias
   - Actualizar resultados de partidos
   - Administrar la plantilla de jugadores
   - Editar información del club

## 🔄 API de Resultados en Vivo

El sitio se conecta automáticamente a la API deportiva para mostrar:
- Resultados de partidos en tiempo real
- Estadísticas actualizadas
- Próximos encuentros

## 🛠️ Estructura del Proyecto

```
club-deportivo-quito/
├── client/              # Frontend (React)
│   ├── public/          # Archivos estáticos
│   └── src/             # Código fuente React
├── server/              # Backend (Node.js/Express)
│   ├── controllers/     # Controladores de la API
│   ├── models/          # Modelos de MongoDB
│   ├── routes/          # Rutas de la API
│   └── middleware/      # Middleware personalizado
└── docs/                # Documentación adicional
```

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerir cambios o mejoras.

---

Desarrollado con ❤️ para Club Deportivo Quito