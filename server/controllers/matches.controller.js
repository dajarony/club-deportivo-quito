const Match = require('../models/Match');

/**
 * Get all matches
 */
exports.getAllMatches = async (req, res) => {
  try {
    const { 
      limit = 10, 
      page = 1, 
      sort = '-date',
      competition,
      season,
      status
    } = req.query;
    
    // Build query
    const query = {};
    
    if (competition) {
      query.competition = competition;
    }
    
    if (season) {
      query.season = season;
    }
    
    if (status) {
      query.status = status.toUpperCase();
    }
    
    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const totalMatches = await Match.countDocuments(query);
    const matches = await Match.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalPages = Math.ceil(totalMatches / limit);
    
    res.status(200).json({
      success: true,
      count: matches.length,
      totalMatches,
      totalPages,
      currentPage: parseInt(page),
      matches
    });
  } catch (error) {
    console.error('Error in getAllMatches:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener partidos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get match by ID
 */
exports.getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Partido no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      match
    });
  } catch (error) {
    console.error('Error in getMatchById:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener partido',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create new match
 */
exports.createMatch = async (req, res) => {
  try {
    const { 
      competition, 
      season, 
      matchday, 
      date, 
      homeTeam, 
      awayTeam, 
      venue,
      status,
      homeScore,
      awayScore,
      ticketUrl,
      streamUrl
    } = req.body;
    
    // Check for existing match with same teams and date
    const existingMatch = await Match.findOne({
      homeTeam,
      awayTeam,
      date: new Date(date)
    });
    
    if (existingMatch) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un partido con los mismos equipos y fecha'
      });
    }
    
    // Create new match
    const match = new Match({
      competition,
      season,
      matchday,
      date,
      homeTeam,
      awayTeam,
      venue,
      status: status || 'SCHEDULED',
      homeScore: homeScore || 0,
      awayScore: awayScore || 0,
      ticketUrl,
      streamUrl
    });
    
    await match.save();
    
    res.status(201).json({
      success: true,
      message: 'Partido creado exitosamente',
      match
    });
  } catch (error) {
    console.error('Error in createMatch:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear partido',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update match by ID
 */
exports.updateMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Partido no encontrado'
      });
    }
    
    // Update fields
    const updateData = req.body;
    
    // If updating teams and date, check for duplicates
    if ((updateData.homeTeam || updateData.awayTeam || updateData.date) && 
        (updateData.homeTeam !== match.homeTeam || 
         updateData.awayTeam !== match.awayTeam ||
         updateData.date !== match.date)) {
      
      const homeTeam = updateData.homeTeam || match.homeTeam;
      const awayTeam = updateData.awayTeam || match.awayTeam;
      const date = updateData.date || match.date;
      
      const existingMatch = await Match.findOne({
        _id: { $ne: match._id }, // Exclude current match
        homeTeam,
        awayTeam,
        date: new Date(date)
      });
      
      if (existingMatch) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un partido con los mismos equipos y fecha'
        });
      }
    }
    
    // Apply updates
    Object.keys(updateData).forEach(key => {
      match[key] = updateData[key];
    });
    
    await match.save();
    
    res.status(200).json({
      success: true,
      message: 'Partido actualizado exitosamente',
      match
    });
  } catch (error) {
    console.error('Error in updateMatch:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar partido',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete match by ID
 */
exports.deleteMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Partido no encontrado'
      });
    }
    
    await match.remove();
    
    res.status(200).json({
      success: true,
      message: 'Partido eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error in deleteMatch:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar partido',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get upcoming matches (fixtures)
 */
exports.getFixtures = async (req, res) => {
  try {
    const { 
      limit = 5, 
      competition 
    } = req.query;
    
    // Build query for matches in the future with status SCHEDULED
    const query = {
      date: { $gte: new Date() },
      status: 'SCHEDULED'
    };
    
    if (competition) {
      query.competition = competition;
    }
    
    // Find upcoming matches
    const fixtures = await Match.find(query)
      .sort('date')
      .limit(parseInt(limit));
    
    res.status(200).json({
      success: true,
      count: fixtures.length,
      fixtures
    });
  } catch (error) {
    console.error('Error in getFixtures:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener próximos partidos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get past match results
 */
exports.getResults = async (req, res) => {
  try {
    const { 
      limit = 5, 
      competition 
    } = req.query;
    
    // Build query for matches in the past with status FINISHED
    const query = {
      date: { $lt: new Date() },
      status: 'FINISHED'
    };
    
    if (competition) {
      query.competition = competition;
    }
    
    // Find past matches
    const results = await Match.find(query)
      .sort('-date')
      .limit(parseInt(limit));
    
    res.status(200).json({
      success: true,
      count: results.length,
      results
    });
  } catch (error) {
    console.error('Error in getResults:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener resultados',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get live matches
 */
exports.getLiveMatches = async (req, res) => {
  try {
    // Find matches with status LIVE
    const liveMatches = await Match.find({ status: 'LIVE' });
    
    res.status(200).json({
      success: true,
      count: liveMatches.length,
      matches: liveMatches
    });
  } catch (error) {
    console.error('Error in getLiveMatches:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener partidos en vivo',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update match status and score
 */
exports.updateMatchResult = async (req, res) => {
  try {
    const { status, homeScore, awayScore, minute } = req.body;
    
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Partido no encontrado'
      });
    }
    
    // Update match details
    match.status = status || match.status;
    match.homeScore = homeScore !== undefined ? homeScore : match.homeScore;
    match.awayScore = awayScore !== undefined ? awayScore : match.awayScore;
    match.minute = minute !== undefined ? minute : match.minute;
    
    await match.save();
    
    res.status(200).json({
      success: true,
      message: 'Resultado actualizado exitosamente',
      match
    });
  } catch (error) {
    console.error('Error in updateMatchResult:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar resultado',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};