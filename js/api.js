/**
 * API Service for Club Deportivo Quito Website
 * Handles all data fetching from backend services
 */

class ApiService {
    constructor() {
        // Base URL for API requests
        this.apiBaseUrl = 'https://api.deportivoquito.com/api/v1';
        
        // For development/demo use local data
        this.useMockData = true;
    }

    /**
     * Get latest news articles
     * @param {number} limit - Number of articles to fetch
     * @returns {Promise} - Promise resolving to news array
     */
    async getNews(limit = 3) {
        try {
            if (this.useMockData) {
                return await this._getMockNews(limit);
            }
            
            const response = await fetch(`${this.apiBaseUrl}/news?limit=${limit}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error fetching news');
            }
            
            return data.articles;
        } catch (error) {
            console.error('Error fetching news:', error);
            // Fall back to mock data in case of error
            return await this._getMockNews(limit);
        }
    }

    /**
     * Get match results
     * @param {Object} options - Filter options
     * @returns {Promise} - Promise resolving to results array
     */
    async getResults(options = {}) {
        try {
            if (this.useMockData) {
                return await this._getMockResults(options);
            }
            
            const queryParams = new URLSearchParams();
            if (options.limit) queryParams.append('limit', options.limit);
            if (options.competition) queryParams.append('competition', options.competition);
            
            const response = await fetch(`${this.apiBaseUrl}/matches/results?${queryParams}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error fetching results');
            }
            
            return data.results;
        } catch (error) {
            console.error('Error fetching results:', error);
            return await this._getMockResults(options);
        }
    }

    /**
     * Get upcoming fixtures
     * @param {Object} options - Filter options
     * @returns {Promise} - Promise resolving to fixtures array
     */
    async getFixtures(options = {}) {
        try {
            if (this.useMockData) {
                return await this._getMockFixtures(options);
            }
            
            const queryParams = new URLSearchParams();
            if (options.limit) queryParams.append('limit', options.limit);
            if (options.competition) queryParams.append('competition', options.competition);
            
            const response = await fetch(`${this.apiBaseUrl}/matches/fixtures?${queryParams}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error fetching fixtures');
            }
            
            return data.fixtures;
        } catch (error) {
            console.error('Error fetching fixtures:', error);
            return await this._getMockFixtures(options);
        }
    }

    /**
     * Get live match data if available
     * @returns {Promise} - Promise resolving to live match or null
     */
    async getLiveMatch() {
        try {
            if (this.useMockData) {
                return await this._getMockLiveMatch();
            }
            
            const response = await fetch(`${this.apiBaseUrl}/matches/live`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error fetching live match');
            }
            
            return data.match || null;
        } catch (error) {
            console.error('Error fetching live match:', error);
            return await this._getMockLiveMatch();
        }
    }

    /**
     * Subscribe user to newsletter
     * @param {string} email - User's email address
     * @returns {Promise} - Promise resolving to success message
     */
    async subscribeNewsletter(email) {
        try {
            if (this.useMockData) {
                return await this._mockSubscribeNewsletter(email);
            }
            
            const response = await fetch(`${this.apiBaseUrl}/newsletter/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error subscribing to newsletter');
            }
            
            return data;
        } catch (error) {
            console.error('Error subscribing to newsletter:', error);
            return await this._mockSubscribeNewsletter(email);
        }
    }

    /**
     * Get club sponsors
     * @returns {Promise} - Promise resolving to sponsors array
     */
    async getSponsors() {
        try {
            if (this.useMockData) {
                return await this._getMockSponsors();
            }
            
            const response = await fetch(`${this.apiBaseUrl}/sponsors`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error fetching sponsors');
            }
            
            return data.sponsors;
        } catch (error) {
            console.error('Error fetching sponsors:', error);
            return await this._getMockSponsors();
        }
    }

    /**
     * MOCK DATA METHODS
     * These methods simulate API responses for development/demo
     */
    
    async _getMockNews(limit) {
        const allNews = [
            {
                id: 1,
                title: 'Importante victoria frente a Emelec en casa',
                excerpt: 'El equipo mostró un gran nivel y se impuso por 3-1 contra uno de los rivales más fuertes del campeonato.',
                image: 'https://via.placeholder.com/600/400?text=Noticia+1',
                date: '2025-02-12',
                url: '#news-1'
            },
            {
                id: 2,
                title: 'Nuevo fichaje se incorpora al equipo',
                excerpt: 'El delantero internacional Carlos Martínez firma por dos temporadas y se une a los entrenamientos esta semana.',
                image: 'https://via.placeholder.com/600/400?text=Noticia+2',
                date: '2025-02-08',
                url: '#news-2'
            },
            {
                id: 3,
                title: 'La cantera sigue dando frutos',
                excerpt: 'Tres jóvenes promesas de las divisiones inferiores serán promovidos al primer equipo esta temporada.',
                image: 'https://via.placeholder.com/600/400?text=Noticia+3',
                date: '2025-02-05',
                url: '#news-3'
            },
            {
                id: 4,
                title: 'Entrevista exclusiva con el entrenador',
                excerpt: 'Hablamos con el técnico sobre los desafíos de la temporada y las expectativas para el campeonato.',
                image: 'https://via.placeholder.com/600/400?text=Noticia+4',
                date: '2025-02-01',
                url: '#news-4'
            },
            {
                id: 5,
                title: 'Renovación del estadio en marcha',
                excerpt: 'La directiva anuncia importantes mejoras en las instalaciones del estadio para mejorar la experiencia de los aficionados.',
                image: 'https://via.placeholder.com/600/400?text=Noticia+5',
                date: '2025-01-28',
                url: '#news-5'
            }
        ];
        
        return allNews.slice(0, limit);
    }
    
    async _getMockResults(options) {
        const allResults = [
            {
                id: 1,
                competition: 'Liga Pro',
                date: '2025-02-10',
                homeTeam: 'CD Quito',
                awayTeam: 'Emelec',
                homeScore: 3,
                awayScore: 1,
                matchday: 'Jornada 3'
            },
            {
                id: 2,
                competition: 'Liga Pro',
                date: '2025-02-03',
                homeTeam: 'Liga de Quito',
                awayTeam: 'CD Quito',
                homeScore: 2,
                awayScore: 2,
                matchday: 'Jornada 2'
            },
            {
                id: 3,
                competition: 'Liga Pro',
                date: '2025-01-27',
                homeTeam: 'CD Quito',
                awayTeam: 'Barcelona SC',
                homeScore: 2,
                awayScore: 0,
                matchday: 'Jornada 1'
            },
            {
                id: 4,
                competition: 'Copa Ecuador',
                date: '2025-01-20',
                homeTeam: 'Universidad Católica',
                awayTeam: 'CD Quito',
                homeScore: 1,
                awayScore: 3,
                matchday: 'Dieciseisavos de Final'
            },
            {
                id: 5,
                competition: 'Amistoso',
                date: '2025-01-10',
                homeTeam: 'CD Quito',
                awayTeam: 'Independiente del Valle',
                homeScore: 1,
                awayScore: 1,
                matchday: 'Pretemporada'
            }
        ];
        
        let results = [...allResults];
        
        // Apply competition filter
        if (options.competition) {
            results = results.filter(match => match.competition === options.competition);
        }
        
        // Apply limit
        if (options.limit) {
            results = results.slice(0, options.limit);
        }
        
        return results;
    }
    
    async _getMockFixtures(options) {
        const now = new Date();
        const nextWeek = new Date(now);
        nextWeek.setDate(now.getDate() + 7);
        const twoWeeksLater = new Date(now);
        twoWeeksLater.setDate(now.getDate() + 14);
        
        const allFixtures = [
            {
                id: 6,
                competition: 'Liga Pro',
                date: '2025-03-17T19:00:00',
                venue: 'Estadio Olímpico Atahualpa',
                homeTeam: 'CD Quito',
                awayTeam: 'Independiente',
                matchday: 'Jornada 5',
                ticketUrl: '#tickets-match-6'
            },
            {
                id: 7,
                competition: 'Liga Pro',
                date: '2025-03-24T15:30:00',
                venue: 'Estadio Gonzalo Pozo Ripalda',
                homeTeam: 'Aucas',
                awayTeam: 'CD Quito',
                matchday: 'Jornada 6',
                streamUrl: '#stream-match-7'
            },
            {
                id: 8,
                competition: 'Copa Ecuador',
                date: '2025-03-31T20:00:00',
                venue: 'Estadio Olímpico Atahualpa',
                homeTeam: 'CD Quito',
                awayTeam: 'Técnico U.',
                matchday: 'Octavos de Final',
                ticketUrl: '#tickets-match-8'
            },
            {
                id: 9,
                competition: 'Liga Pro',
                date: '2025-04-07T19:00:00',
                venue: 'Estadio Olímpico Atahualpa',
                homeTeam: 'CD Quito',
                awayTeam: 'Delfín SC',
                matchday: 'Jornada 7',
                ticketUrl: '#tickets-match-9'
            },
            {
                id: 10,
                competition: 'Amistoso',
                date: '2025-04-14T16:00:00',
                venue: 'Estadio Rodrigo Paz Delgado',
                homeTeam: 'Liga de Quito',
                awayTeam: 'CD Quito',
                matchday: 'Amistoso',
                ticketUrl: '#tickets-match-10'
            }
        ];
        
        let fixtures = [...allFixtures];
        
        // Apply competition filter
        if (options.competition) {
            fixtures = fixtures.filter(match => match.competition === options.competition);
        }
        
        // Apply limit
        if (options.limit) {
            fixtures = fixtures.slice(0, options.limit);
        }
        
        return fixtures;
    }
    
    async _getMockLiveMatch() {
        // Randomly decide if there's a live match (for demo purposes)
        const isLive = Math.random() > 0.7;
        
        if (!isLive) {
            return null;
        }
        
        return {
            id: 999,
            competition: 'Liga Pro',
            homeTeam: 'CD Quito',
            awayTeam: 'Barcelona SC',
            homeScore: Math.floor(Math.random() * 4),
            awayScore: Math.floor(Math.random() * 3),
            minute: Math.floor(Math.random() * 90) + 1,
            status: 'LIVE',
            matchUrl: '#live-match-details'
        };
    }
    
    async _mockSubscribeNewsletter(email) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Correo electrónico no válido');
        }
        
        // Simulate successful subscription
        return {
            success: true,
            message: '¡Gracias por suscribirte a nuestro newsletter!'
        };
    }
    
    async _getMockSponsors() {
        return [
            {
                id: 1,
                name: 'Sponsor 1',
                logo: 'https://via.placeholder.com/150x75?text=Sponsor+1',
                url: '#sponsor-1'
            },
            {
                id: 2,
                name: 'Sponsor 2',
                logo: 'https://via.placeholder.com/150x75?text=Sponsor+2',
                url: '#sponsor-2'
            },
            {
                id: 3,
                name: 'Sponsor 3',
                logo: 'https://via.placeholder.com/150x75?text=Sponsor+3',
                url: '#sponsor-3'
            },
            {
                id: 4,
                name: 'Sponsor 4',
                logo: 'https://via.placeholder.com/150x75?text=Sponsor+4',
                url: '#sponsor-4'
            },
            {
                id: 5,
                name: 'Sponsor 5',
                logo: 'https://via.placeholder.com/150x75?text=Sponsor+5',
                url: '#sponsor-5'
            }
        ];
    }
}

// Create a global API service instance
const apiService = new ApiService();