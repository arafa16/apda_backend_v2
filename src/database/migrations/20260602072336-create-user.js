"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      membership_number: {
        type: Sequelize.TEXT,
      },
      nik: {
        type: Sequelize.TEXT,
      },
      phone_number: {
        type: Sequelize.STRING,
      },
      bank_id: {
        type: Sequelize.INTEGER,
      },
      bank_account_number: {
        type: Sequelize.TEXT,
      },
      address: {
        type: Sequelize.TEXT,
      },
      registration_date: {
        type: Sequelize.DATE,
      },
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      status_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      npwp: {
        type: Sequelize.TEXT,
      },
      privilege_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
