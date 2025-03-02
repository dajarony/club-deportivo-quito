# Guía de Integración de API Deportiva - Club Deportivo Quito

Esta guía técnica explica cómo se integra una API deportiva externa en el sitio web de Club Deportivo Quito para obtener datos de partidos en tiempo real.

## Índice

1. [Introducción](#introducción)
2. [APIs Deportivas Recomendadas](#apis-deportivas-recomendadas)
3. [Configuración de la API](#configuración-de-la-api)
4. [Integración en el Backend](#integración-en-el-backend)
5. [Implementación del Servicio de Datos](#implementación-del-servicio-de-datos)
6. [Actualización de Datos en Tiempo Real](#actualización-de-datos-en-tiempo-real)
7. [Solución de Problemas](#solución-de-problemas)

## Introducción

El sitio web de Club Deportivo Quito utiliza una API deportiva externa para obtener datos actualizados sobre:

- Resultados de partidos en tiempo real
- Estadísticas de partidos
- Calendarios de competiciones
- Información de jugadores y equipos

Estos datos se sincronizan con nuestra base de datos y se muestran automáticamente en el sitio web.

## APIs Deportivas Recomendadas

Recomendamos utilizar una de estas APIs deportivas, que ofrecen datos para el fútbol ecuatoriano:

1. **API-FOOTBALL** (api-football.com)
   - Cobertura completa de la Liga Pro de Ecuador
   - Datos en tiempo real de partidos
   - Plan gratuito disponible con limitaciones

2. **SportMonks** (sportmonks.com)
   - Datos detallados de competiciones ecuatorianas
   - Estadísticas avanzadas de jugadores
   - Requiere suscripción de pago

3. **Football-Data.org**
   - API gratuita con datos básicos
   - Cobertura limitada para ligas menores
   - Buena opción para comenzar sin presupuesto

## Configuración de la API

### Obtener Credenciales

1. Regístrate en el proveedor de API seleccionado
2. Obtén tu clave API (API Key)
3. Configura los límites de uso según tu plan

### Configurar Variables de Entorno

Añade tu clave API al archivo `.env` en el directorio del servidor:

```
SPORTS_API_KEY=tu_clave_api
SPORTS_API_URL=https://api.ejemplo.com/v1
TEAM_ID=123456  # ID de Club Deportivo Quito en la API
```

## Integración en el Backend

El proyecto utiliza un servicio dedicado para gestionar todas las interacciones con la API deportiva externa.

### Estructura de Archivos

```
server/
├── services/
│   ├── sportsApi.service.js  # Servicio principal de la API deportiva
│   └── liveMatches.service.js  # Servicio para partidos en vivo
├── controllers/
│   └── matches.controller.js  # Controlador que utiliza los servicios
└── models/
    └── Match.js  # Modelo de datos para partidos
```

### Ejemplo de Implementación del Servicio

Aquí un ejemplo simplificado de cómo implementar el servicio de API deportiva:

```javascript
// server/services/sportsApi.service.js
const axios = require('axios');

class SportsApiService {
  constructor() {
    this.apiKey = process.env.SPORTS_API_KEY;
    this.baseUrl = process.env.SPORTS_API_URL;
    this.teamId = process.env.TEAM_ID;
    
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json'
      }
    });
  }
  
  async getTeamMatches(status = 'all') {
    try {
      const response = await this.api.get(`/teams/${this.teamId}/matches`, {
        params: { status }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching team matches:', error);
      throw error;
    }
  }
  
  async getLiveMatches() {
    try {
      return await this.getTeamMatches('LIVE');
    } catch (error) {
      console.error('Error fetching live matches:', error);
      throw error;
    }
  }
  
  async getUpcomingMatches(limit = 5) {
    try {
      const matches = await this.getTeamMatches('SCHEDULED');
      return matches.slice(0, limit);
    } catch (error) {
      console.error('Error fetching upcoming matches:', error);
      throw error;
    }
  }
  
  async getMatchDetails(matchId) {
    try {
      const response = await this.api.get(`/matches/${matchId}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching match details for match ${matchId}:`, error);
      throw error;
    }
  }
}

module.exports = new SportsApiService();
```

## Implementación del Servicio de Datos

### Sincronización de Datos

El sistema sincroniza los datos de la API externa con nuestra base de datos:

1. Programación de tareas para actualizar datos periódicamente
2. Almacenamiento de datos en la base de datos MongoDB
3. Uso de datos locales con caída a la API en caso de datos faltantes

### Ejemplo de Sincronización

```javascript
// server/services/dataSynchronization.service.js
const cron = require('node-cron');
const sportsApiService = require('./sportsApi.service');
const Match = require('../models/Match');

class DataSynchronizationService {
  initSyncTasks() {
    // Sincronizar partidos cada 6 horas
    cron.schedule('0 */6 * * *', this.syncMatches);
    
    // Sincronizar partidos en vivo cada 1 minuto durante horario de partidos
    cron.schedule('*/1 15-23 * * *', this.syncLiveMatches);
  }
  
  async syncMatches() {
    try {
      const apiMatches = await sportsApiService.getTeamMatches();
      
      for (const match of apiMatches) {
        // Buscar partido existente por ID externo
        let existingMatch = await Match.findOne({ externalId: match.id });
        
        if (existingMatch) {
          // Actualizar partido existente
          Object.assign(existingMatch, this.mapApiMatchToDbModel(match));
          await existingMatch.save();
        } else {
          // Crear nuevo partido
          const newMatch = new Match(this.mapApiMatchToDbModel(match));
          await newMatch.save();
        }
      }
      
      console.log(`Synchronized ${apiMatches.length} matches from external API`);
    } catch (error) {
      console.error('Error synchronizing matches:', error);
    }
  }
  
  async syncLiveMatches() {
    try {
      const liveMatches = await sportsApiService.getLiveMatches();
      
      for (const match of liveMatches) {
        const existingMatch = await Match.findOne({ externalId: match.id });
        
        if (existingMatch) {
          // Actualizar minuto, marcador, eventos, etc.
          existingMatch.status = 'LIVE';
          existingMatch.minute = match.minute;
          existingMatch.homeScore = match.homeScore;
          existingMatch.awayScore = match.awayScore;
          // Actualizar eventos (goles, tarjetas, etc.)
          existingMatch.events = this.mapApiEventsToDbModel(match.events);
          
          await existingMatch.save();
        }
      }
      
      console.log(`Updated ${liveMatches.length} live matches`);
    } catch (error) {
      console.error('Error synchronizing live matches:', error);
    }
  }
  
  mapApiMatchToDbModel(apiMatch) {
    // Mapear datos de la API al modelo de nuestra base de datos
    return {
      externalId: apiMatch.id,
      competition: apiMatch.competition.name,
      season: apiMatch.season,
      matchday: apiMatch.matchday,
      date: new Date(apiMatch.utcDate),
      homeTeam: apiMatch.homeTeam.name,
      awayTeam: apiMatch.awayTeam.name,
      venue: apiMatch.venue,
      status: apiMatch.status,
      homeScore: apiMatch.score.fullTime.homeTeam || 0,
      awayScore: apiMatch.score.fullTime.awayTeam || 0
      // Mapear otros campos...
    };
  }
  
  mapApiEventsToDbModel(apiEvents) {
    // Mapear eventos de la API al modelo de nuestra base de datos
    // ...
  }
}

module.exports = new DataSynchronizationService();
```

## Actualización de Datos en Tiempo Real

Para los partidos en vivo, implementamos actualizaciones en tiempo real:

### WebSockets (Opción Recomendada)

El sistema utiliza Socket.IO para enviar actualizaciones instantáneas al frontend cuando hay cambios en los partidos en vivo:

```javascript
// server/services/liveMatches.service.js
const socketIo = require('socket.io');
const sportsApiService = require('./sportsApi.service');

class LiveMatchesService {
  init(server) {
    this.io = socketIo(server);
    this.setupSocketConnections();
    this.startLiveUpdatesPolling();
  }
  
  setupSocketConnections() {
    this.io.on('connection', (socket) => {
      console.log('New client connected to live matches service');
      
      socket.on('subscribe', (matchId) => {
        socket.join(`match_${matchId}`);
      });
      
      socket.on('unsubscribe', (matchId) => {
        socket.leave(`match_${matchId}`);
      });
      
      socket.on('disconnect', () => {
        console.log('Client disconnected from live matches service');
      });
    });
  }
  
  startLiveUpdatesPolling() {
    // Consultar la API cada 60 segundos para partidos en vivo
    setInterval(async () => {
      try {
        const liveMatches = await sportsApiService.getLiveMatches();
        
        liveMatches.forEach(match => {
          // Emitir actualizaciones a todos los clientes suscritos a este partido
          this.io.to(`match_${match.id}`).emit('matchUpdate', {
            matchId: match.id,
            minute: match.minute,
            homeScore: match.score.fullTime.homeTeam,
            awayScore: match.score.fullTime.awayTeam,
            events: match.events
          });
        });
      } catch (error) {
        console.error('Error polling live match updates:', error);
      }
    }, 60000);
  }
}

module.exports = new LiveMatchesService();
```

### Polling (Alternativa Simple)

Como alternativa sin WebSockets, el frontend puede consultar periódicamente una API REST:

```javascript
// client/src/services/liveMatchService.js
import axios from 'axios';

class LiveMatchService {
  constructor() {
    this.pollingInterval = null;
    this.updateCallback = null;
  }
  
  startPolling(matchId, callback, interval = 60000) {
    this.updateCallback = callback;
    
    // Detener cualquier polling previo
    this.stopPolling();
    
    // Iniciar nuevo polling
    this.pollingInterval = setInterval(async () => {
      try {
        const response = await axios.get(`/api/v1/matches/${matchId}`);
        const match = response.data.match;
        
        if (this.updateCallback) {
          this.updateCallback(match);
        }
      } catch (error) {
        console.error('Error polling match updates:', error);
      }
    }, interval);
  }
  
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
}

export default new LiveMatchService();
```

## Solución de Problemas

### Problemas Comunes

1. **Límites de API Superados**
   - Implementa almacenamiento en caché para reducir las llamadas a la API
   - Considera actualizar a un plan con mayores límites

2. **Datos Inconsistentes**
   - Implementa validación de datos antes de almacenarlos
   - Configura alertas para datos anómalos

3. **Latencia en Actualizaciones en Vivo**
   - Optimiza la frecuencia de polling según el plan de API
   - Considera implementar un proxy con caché

### Monitoreo

Configura un sistema de monitoreo para:

1. Verificar el estado de la conexión con la API
2. Alertar sobre límites de uso próximos a agotarse
3. Detectar patrones inusuales en los datos

---

Esta guía proporciona una base para implementar la integración con una API deportiva. Adapta la implementación según las necesidades específicas del proyecto y la API seleccionada.