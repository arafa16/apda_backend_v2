"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { v4: uuidv4 } = await import("uuid");

    return queryInterface.bulkInsert("privileges", [
      {
        id: 1,
        uuid: uuidv4(),
        name: "Admin",
        user: true,
        dashboard: true,
        investment: true,
        setting: true,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete("privileges", null, {});
  },
};
