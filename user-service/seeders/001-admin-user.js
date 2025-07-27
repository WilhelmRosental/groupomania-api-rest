'use strict';

const argon2 = require('argon2');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await argon2.hash('admin123');
    
    await queryInterface.bulkInsert('users', [
      {
        email: 'admin@groupomania.com',
        password: hashedPassword,
        first_name: 'Admin',
        last_name: 'System',
        is_admin: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {
      email: 'admin@groupomania.com'
    });
  }
};