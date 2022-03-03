'use strict';

const sequelize = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('Outbox', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      orderTotal: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      customerId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      orderId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sent:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Outbox');
  }
};