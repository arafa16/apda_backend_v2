"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { v4: uuidv4 } = await import("uuid");

    const records = [];
    for (let i = 1; i <= 100; i++) {
      records.push({
        id: i,
        uuid: uuidv4(),
        nominal: i * 10000000,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    return queryInterface.bulkInsert("nominal_selects", records);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("nominal_selects", null, {});
  },
};
