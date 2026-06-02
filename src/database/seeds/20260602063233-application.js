"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { v4: uuidv4 } = await import("uuid");

    return queryInterface.bulkInsert("applications", [
      {
        id: 1,
        uuid: uuidv4(),
        name: "apda",
        description: "apda application",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete("applications", null, {});
  },
};
