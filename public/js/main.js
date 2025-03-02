/**
 * Main JavaScript for Club Deportivo Quito Website
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initMobileMenu();
    initNewsSection();
    initMatchesSection();
    initLiveMatch();
    initCountdown();
    initNewsletterForm();
    initSponsors();
    updateFooterYear();
    initLazyLoading();
});

/**
 * Initialize mobile menu toggle
 */
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('menu');
    
    if (mobileMenuButton && menu) {
        mobileMenuButton.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
    }
}

/**
 * Initialize and load news articles
 */
async function initNewsSection() {
    const newsContainer = document.getElementById('news-container');
    
    if (!newsContainer) return;
    
    try {
        const news = await apiService.getNews(3);
        
        // Clear loading spinner
        newsContainer.innerHTML = '';
        
        if (news.length === 0) {
            newsContainer.innerHTML = '<p class="text-center col-span-3 py-8 text-gray-500">No hay noticias disponibles en este momento.</p>';
            return;
        }
        
        // Format date helper function
        const formatDate = (dateString) => {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('es-ES', options);
        };
        
        // Create and append news cards
        news.forEach(article => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300';
            
            newsCard.innerHTML = `
                <div class="h-48 overflow-hidden">
                    <img data-src="${article.image}" alt="${article.title}" class="lazy-image w-full h-full object-cover">
                </div>
                <div class="p-6">
                    <span class="text-xs text-gray-500">${formatDate(article.date)}</span>
                    <h3 class="text-xl font-bold mb-2 mt-1">${article.title}</h3>
                    <p class="text-gray-600 mb-4">${article.excerpt}</p>
                    <a href="${article.url}" class="text-blue-700 font-medium hover:text-blue-900">Leer más →</a>
                </div>
            `;
            
            newsContainer.appendChild(newsCard);
        });
        
    } catch (error) {
        console.error('Error loading news:', error);
        newsContainer.innerHTML = '<p class="text-center col-span-3 py-8 text-gray-500">Error al cargar las noticias. Por favor, intenta de nuevo más tarde.</p>';
    }
}

/**
 * Initialize and load match results and fixtures
 */
async function initMatchesSection() {
    const resultsContainer = document.getElementById('results-container');
    const fixturesContainer = document.getElementById('fixtures-container');
    
    if (!resultsContainer || !fixturesContainer) return;
    
    // Set up filter buttons
    const competitionFilters = document.querySelectorAll('.match-filter-btn');
    const timeFilters = document.querySelectorAll('.time-filter-btn');
    
    let activeCompetition = null; // null means all competitions
    let showUpcoming = true; // true for upcoming, false for past matches
    
    // Competition filter click handler
    competitionFilters.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            competitionFilters.forEach(btn => btn.classList.remove('active-filter'));
            
            // Add active class to clicked button
            button.classList.add('active-filter');
            
            // Update active competition
            if (button.id === 'all-matches') {
                activeCompetition = null;
            } else if (button.id === 'liga-pro') {
                activeCompetition = 'Liga Pro';
            } else if (button.id === 'copa-ecuador') {
                activeCompetition = 'Copa Ecuador';
            } else if (button.id === 'friendly') {
                activeCompetition = 'Amistoso';
            }
            
            // Reload matches with new filter
            loadMatches(activeCompetition, showUpcoming);
        });
    });
    
    // Time filter click handler
    timeFilters.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            timeFilters.forEach(btn => btn.classList.remove('active-filter'));
            
            // Add active class to clicked button
            button.classList.add('active-filter');
            
            // Update time filter
            showUpcoming = button.id === 'upcoming-matches';
            
            // Toggle containers visibility
            document.getElementById('past-matches-container').style.display = showUpcoming ? 'none' : 'block';
            document.getElementById('upcoming-matches-container').style.display = showUpcoming ? 'block' : 'none';
            
            // Reload matches with new filter
            loadMatches(activeCompetition, showUpcoming);
        });
    });
    
    // Initial load
    await loadMatches(activeCompetition, showUpcoming);
    
    // Function to load matches based on filters
    async function loadMatches(competition, upcoming) {
        try {
            // Set loading state
            resultsContainer.innerHTML = '<div class="loading-spinner text-center py-8"><div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-900"></div><p class="mt-2 text-gray-600">Cargando resultados...</p></div>';
            fixturesContainer.innerHTML = '<div class="loading-spinner text-center py-8"><div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-900"></div><p class="mt-2 text-gray-600">Cargando partidos...</p></div>';
            
            // Fetch data
            const options = { competition: competition };
            
            const [results, fixtures] = await Promise.all([
                apiService.getResults(options),
                apiService.getFixtures(options)
            ]);
            
            // Format date helper function
            const formatDate = (dateString) => {
                const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
                return new Date(dateString).toLocaleDateString('es-ES', options);
            };
            
            const formatDateTime = (dateTimeString) => {
                const options = { 
                    year: 'numeric', 
                    month: 'numeric', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                };
                return new Date(dateTimeString).toLocaleDateString('es-ES', options);
            };
            
            // Render results
            if (results.length === 0) {
                resultsContainer.innerHTML = '<p class="text-center py-8 text-gray-500">No hay resultados disponibles.</p>';
            } else {
                resultsContainer.innerHTML = '';
                
                results.forEach(match => {
                    const resultCard = document.createElement('div');
                    resultCard.className = 'match-card bg-gray-50 rounded-lg shadow p-4 flex items-center justify-between';
                    
                    // Determine home team result class
                    let homeResultClass = 'text-gray-600'; // Draw
                    if (match.homeScore > match.awayScore) {
                        homeResultClass = 'text-green-600'; // Win
                    } else if (match.homeScore < match.awayScore) {
                        homeResultClass = 'text-red-600'; // Loss
                    }
                    
                    // Determine away team result class
                    let awayResultClass = 'text-gray-600'; // Draw
                    if (match.awayScore > match.homeScore) {
                        awayResultClass = 'text-green-600'; // Win
                    } else if (match.awayScore < match.homeScore) {
                        awayResultClass = 'text-red-600'; // Loss
                    }
                    
                    resultCard.innerHTML = `
                        <div class="flex items-center">
                            <span class="font-medium">${match.homeTeam}</span>
                            <span class="mx-2 text-lg font-bold ${homeResultClass}">${match.homeScore}</span>
                        </div>
                        <div class="text-xs text-gray-500">${formatDate(match.date)}</div>
                        <div class="flex items-center">
                            <span class="mx-2 text-lg font-bold ${awayResultClass}">${match.awayScore}</span>
                            <span class="font-medium">${match.awayTeam}</span>
                        </div>
                    `;
                    
                    resultsContainer.appendChild(resultCard);
                });
            }
            
            // Render fixtures
            if (fixtures.length === 0) {
                fixturesContainer.innerHTML = '<p class="text-center py-8 text-gray-500">No hay próximos partidos disponibles.</p>';
            } else {
                fixturesContainer.innerHTML = '';
                
                fixtures.forEach(match => {
                    const fixtureCard = document.createElement('div');
                    fixtureCard.className = 'match-card bg-gradient-to-r from-blue-50 to-red-50 rounded-lg shadow p-4';
                    
                    const matchDateTime = formatDateTime(match.date);
                    
                    // Determine action link based on match properties
                    let actionLink = '';
                    if (match.ticketUrl) {
                        actionLink = `<a href="${match.ticketUrl}" class="text-blue-600 hover:text-blue-800 text-sm font-semibold">Comprar Entradas →</a>`;
                    } else if (match.streamUrl) {
                        actionLink = `<a href="${match.streamUrl}" class="text-blue-600 hover:text-blue-800 text-sm font-semibold">Ver Transmisión →</a>`;
                    }
                    
                    fixtureCard.innerHTML = `
                        <div class="flex justify-between items-center mb-3">
                            <span class="text-sm font-medium text-gray-500">${match.competition} - ${match.matchday}</span>
                            <span class="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">${matchDateTime}</span>
                        </div>
                        <div class="flex justify-center items-center space-x-4">
                            <div class="text-center">
                                <div class="font-bold">${match.homeTeam}</div>
                            </div>
                            <div class="text-gray-500 font-bold">VS</div>
                            <div class="text-center">
                                <div class="font-bold">${match.awayTeam}</div>
                            </div>
                        </div>
                        ${match.venue ? `<div class="mt-2 text-center text-sm text-gray-500">${match.venue}</div>` : ''}
                        <div class="mt-3 text-center">
                            ${actionLink}
                        </div>
                    `;
                    
                    fixturesContainer.appendChild(fixtureCard);
                });
            }
            
        } catch (error) {
            console.error('Error loading matches:', error);
            resultsContainer.innerHTML = '<p class="text-center py-8 text-gray-500">Error al cargar los resultados. Por favor, intenta de nuevo más tarde.</p>';
            fixturesContainer.innerHTML = '<p class="text-center py-8 text-gray-500">Error al cargar los próximos partidos. Por favor, intenta de nuevo más tarde.</p>';
        }
    }
}

/**
 * Initialize and update live match data if available
 */
async function initLiveMatch() {
    const liveMatchSection = document.getElementById('live-match');
    
    if (!liveMatchSection) return;
    
    try {
        const liveMatch = await apiService.getLiveMatch();
        
        if (!liveMatch) {
            liveMatchSection.classList.add('hidden');
            return;
        }
        
        // Match is live, update UI
        liveMatchSection.classList.remove('hidden');
        
        // Update match info
        document.getElementById('live-home-team-name').textContent = liveMatch.homeTeam;
        document.getElementById('live-away-team-name').textContent = liveMatch.awayTeam;
        document.getElementById('live-home-score').textContent = liveMatch.homeScore;
        document.getElementById('live-away-score').textContent = liveMatch.awayScore;
        document.getElementById('live-match-time').textContent = `Minuto: ${liveMatch.minute}'`;
        
        // Set up link
        const detailsLink = liveMatchSection.querySelector('a');
        if (detailsLink && liveMatch.matchUrl) {
            detailsLink.href = liveMatch.matchUrl;
        }
        
        // Set up auto-refresh for live match data
        setInterval(async () => {
            try {
                const updatedMatch = await apiService.getLiveMatch();
                
                if (!updatedMatch) {
                    liveMatchSection.classList.add('hidden');
                    return;
                }
                
                document.getElementById('live-home-score').textContent = updatedMatch.homeScore;
                document.getElementById('live-away-score').textContent = updatedMatch.awayScore;
                document.getElementById('live-match-time').textContent = `Minuto: ${updatedMatch.minute}'`;
                
            } catch (error) {
                console.error('Error refreshing live match:', error);
            }
        }, 60000); // Refresh every minute
        
    } catch (error) {
        console.error('Error initializing live match:', error);
        liveMatchSection.classList.add('hidden');
    }
}

/**
 * Initialize countdown timer for next match
 */
async function initCountdown() {
    const countdownContainer = document.getElementById('next-match-countdown');
    const nextMatchInfo = document.getElementById('next-match-teams');
    
    if (!countdownContainer || !nextMatchInfo) return;
    
    try {
        // Get first upcoming fixture
        const fixtures = await apiService.getFixtures({ limit: 1 });
        
        if (fixtures.length === 0) {
            countdownContainer.style.display = 'none';
            return;
        }
        
        const nextMatch = fixtures[0];
        const matchDate = new Date(nextMatch.date);
        
        // Update next match info
        nextMatchInfo.textContent = `${nextMatch.homeTeam} vs ${nextMatch.awayTeam}`;
        
        // Set up countdown timer
        function updateCountdown() {
            const now = new Date();
            const diff = matchDate - now;
            
            if (diff <= 0) {
                // Match has started
                document.getElementById('days').textContent = '00';
                document.getElementById('hours').textContent = '00';
                document.getElementById('minutes').textContent = '00';
                document.getElementById('seconds').textContent = '00';
                return;
            }
            
            // Calculate time units
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            // Update countdown display
            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        }
        
        // Initial update
        updateCountdown();
        
        // Update countdown every second
        setInterval(updateCountdown, 1000);
        
    } catch (error) {
        console.error('Error initializing countdown:', error);
        countdownContainer.style.display = 'none';
    }
}

/**
 * Initialize newsletter subscription form
 */
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('email-input');
    const messageContainer = document.getElementById('newsletter-message');
    
    if (!newsletterForm || !emailInput || !messageContainer) return;
    
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!email) {
            showMessage('Por favor, introduce tu dirección de correo electrónico.', 'error');
            return;
        }
        
        try {
            // Disable form while submitting
            emailInput.disabled = true;
            newsletterForm.querySelector('button').disabled = true;
            
            // Submit subscription request
            const response = await apiService.subscribeNewsletter(email);
            
            // Show success message
            showMessage(response.message, 'success');
            
            // Reset form
            newsletterForm.reset();
            
        } catch (error) {
            // Show error message
            showMessage(error.message || 'Error al suscribirse. Por favor, intenta de nuevo.', 'error');
            
        } finally {
            // Re-enable form
            emailInput.disabled = false;
            newsletterForm.querySelector('button').disabled = false;
        }
    });
    
    function showMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.className = type === 'success' ? 'newsletter-success mt-4' : 'newsletter-error mt-4';
        messageContainer.classList.remove('hidden');
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageContainer.classList.add('hidden');
        }, 5000);
    }
}

/**
 * Initialize sponsors section
 */
async function initSponsors() {
    const sponsorsContainer = document.getElementById('sponsors-container');
    
    if (!sponsorsContainer) return;
    
    try {
        const sponsors = await apiService.getSponsors();
        
        if (sponsors.length === 0) {
            sponsorsContainer.innerHTML = '<p class="text-center w-full py-8 text-gray-500">No hay patrocinadores disponibles.</p>';
            return;
        }
        
        // Clear container
        sponsorsContainer.innerHTML = '';
        
        // Create and append sponsor logos
        sponsors.forEach(sponsor => {
            const sponsorDiv = document.createElement('div');
            sponsorDiv.className = 'w-32 h-16 bg-white rounded shadow-sm flex items-center justify-center';
            
            const link = document.createElement('a');
            link.href = sponsor.url;
            link.title = sponsor.name;
            
            // Use lazy loading for sponsor logos
            const img = document.createElement('img');
            img.dataset.src = sponsor.logo;
            img.alt = sponsor.name;
            img.className = 'lazy-image max-w-full max-h-full p-2';
            
            link.appendChild(img);
            sponsorDiv.appendChild(link);
            sponsorsContainer.appendChild(sponsorDiv);
        });
        
    } catch (error) {
        console.error('Error loading sponsors:', error);
        sponsorsContainer.innerHTML = '<p class="text-center w-full py-8 text-gray-500">Error al cargar los patrocinadores. Por favor, intenta de nuevo más tarde.</p>';
    }
}

/**
 * Update footer year to current year
 */
function updateFooterYear() {
    const yearElement = document.getElementById('current-year');
    
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
    // Initial check for visible lazy images
    checkLazyImages();
    
    // Set up intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.add('loaded');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });
        
        // Observe all lazy images
        document.querySelectorAll('.lazy-image').forEach((img) => {
            lazyImageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without intersection observer
        document.addEventListener('scroll', checkLazyImages);
        window.addEventListener('resize', checkLazyImages);
        window.addEventListener('orientationchange', checkLazyImages);
    }
    
    function checkLazyImages() {
        const lazyImages = document.querySelectorAll('.lazy-image:not(.loaded)');
        
        lazyImages.forEach((lazyImage) => {
            if (isElementInViewport(lazyImage)) {
                lazyImage.src = lazyImage.dataset.src;
                lazyImage.classList.add('loaded');
            }
        });
    }
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}