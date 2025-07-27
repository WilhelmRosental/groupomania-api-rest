/**
 * Authentication middleware for post service
 * Validates JWT tokens and extracts user information
 */

const jwt = require('jsonwebtoken');

const auth = async (request, reply) => {
  try {
    const token = request.headers.authorization;
    
    if (!token) {
      return reply.code(401).send({
        success: false,
        message: 'Token d\'authentification manquant'
      });
    }

    // Remove "Bearer " prefix if present
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    
    const decodedToken = jwt.verify(cleanToken, process.env.JWT_SECRET || 'your-secret-key');
    
    request.user = {
      id: decodedToken.userId,
      isAdmin: decodedToken.isAdmin || false
    };
    
  } catch (error) {
    return reply.code(401).send({
      success: false,
      message: 'Token invalide'
    });
  }
};

module.exports = auth;