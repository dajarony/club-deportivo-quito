const News = require('../models/News');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

/**
 * Get all news articles
 */
exports.getAllNews = async (req, res) => {
  try {
    const { 
      limit = 10, 
      page = 1, 
      sort = '-publishDate',
      category,
      tag,
      published = true
    } = req.query;
    
    // Build query
    const query = {};
    
    if (published === 'true') {
      query.isPublished = true;
    } else if (published === 'false') {
      query.isPublished = false;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (tag) {
      query.tags = tag;
    }
    
    // Execute query with pagination
    const skip = (page - 1) * limit;
    
    const totalArticles = await News.countDocuments(query);
    const articles = await News.find(query)
      .populate('author', 'username')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalPages = Math.ceil(totalArticles / limit);
    
    res.status(200).json({
      success: true,
      count: articles.length,
      totalArticles,
      totalPages,
      currentPage: parseInt(page),
      articles
    });
  } catch (error) {
    console.error('Error in getAllNews:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener noticias',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get news article by ID or slug
 */
exports.getNewsById = async (req, res) => {
  try {
    let article;
    
    // Check if param is ObjectID
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      article = await News.findById(req.params.id).populate('author', 'username');
    } else {
      // Try to find by slug
      article = await News.findOne({ slug: req.params.id }).populate('author', 'username');
    }
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }
    
    // Increment view count
    article.views += 1;
    await article.save();
    
    res.status(200).json({
      success: true,
      article
    });
  } catch (error) {
    console.error('Error in getNewsById:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener noticia',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create new news article
 */
exports.createNews = async (req, res) => {
  try {
    const { 
      title, 
      slug, 
      excerpt, 
      content, 
      image,
      category,
      tags,
      isPublished,
      publishDate
    } = req.body;
    
    // Check if slug is already taken
    if (slug) {
      const existingArticle = await News.findOne({ slug });
      if (existingArticle) {
        return res.status(400).json({
          success: false,
          message: 'El slug ya está en uso'
        });
      }
    }
    
    // Create new article
    const article = new News({
      title,
      slug,
      excerpt,
      content,
      image,
      author: req.user.id,
      category: category || 'other',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      isPublished: isPublished !== undefined ? isPublished : true,
      publishDate: publishDate || Date.now()
    });
    
    await article.save();
    
    res.status(201).json({
      success: true,
      message: 'Noticia creada exitosamente',
      article
    });
  } catch (error) {
    console.error('Error in createNews:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear noticia',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update news article by ID
 */
exports.updateNews = async (req, res) => {
  try {
    const article = await News.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }
    
    // Update fields
    const updateData = req.body;
    
    // If updating slug, check for duplicates
    if (updateData.slug && updateData.slug !== article.slug) {
      const existingArticle = await News.findOne({ 
        slug: updateData.slug,
        _id: { $ne: article._id } // Exclude current article
      });
      
      if (existingArticle) {
        return res.status(400).json({
          success: false,
          message: 'El slug ya está en uso'
        });
      }
    }
    
    // Handle tags if provided as string
    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(tag => tag.trim());
    }
    
    // Apply updates
    Object.keys(updateData).forEach(key => {
      article[key] = updateData[key];
    });
    
    await article.save();
    
    res.status(200).json({
      success: true,
      message: 'Noticia actualizada exitosamente',
      article
    });
  } catch (error) {
    console.error('Error in updateNews:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar noticia',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete news article by ID
 */
exports.deleteNews = async (req, res) => {
  try {
    const article = await News.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Artículo no encontrado'
      });
    }
    
    // Delete associated image file if it's stored locally
    if (article.image && article.image.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', 'public', article.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await article.remove();
    
    res.status(200).json({
      success: true,
      message: 'Noticia eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error in deleteNews:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar noticia',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Upload article image
 */
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se ha subido ninguna imagen'
      });
    }
    
    // Generate image URL
    const imageUrl = `/uploads/news/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      message: 'Imagen subida exitosamente',
      imageUrl
    });
  } catch (error) {
    console.error('Error in uploadImage:', error);
    res.status(500).json({
      success: false,
      message: 'Error al subir imagen',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};