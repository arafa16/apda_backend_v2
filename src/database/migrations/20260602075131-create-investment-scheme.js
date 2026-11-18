"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("investment_schemes", {
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
      code: {
        type: Sequelize.STRING,
      },
      number: {
        type: Sequelize.DECIMAL,
      },
      year: {
        type: Sequelize.STRING,
      },
      start_date: {
        type: Sequelize.DATE,
      },
      end_date: {
        type: Sequelize.DATE,
      },
      target_amount: {
        type: Sequelize.DECIMAL(18, 2),
      },
      max_investment_amount: {
        type: Sequelize.DECIMAL(18, 2),
      },
      is_target_reached: {
        type: Sequelize.BOOLEAN,
      },
      fund_received_date: {
        type: Sequelize.DATE,
      },
      signer_name: {
        type: Sequelize.STRING,
      },
      profit_share: {
        type: Sequelize.STRING,
      },
      payment_term: {
        type: Sequelize.STRING,
      },
      first_payment_date: {
        type: Sequelize.DATE,
      },
      last_payment_date: {
        type: Sequelize.DATE,
      },
      contract_name: {
        type: Sequelize.STRING,
      },
      contract_start_date: {
        type: Sequelize.DATE,
      },
      contract_end_date: {
        type: Sequelize.DATE,
      },
      auto_deactivate_after_submit: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("investment_schemes");
  },
};
