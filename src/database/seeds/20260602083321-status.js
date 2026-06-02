"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { v4: uuidv4 } = await import("uuid");

    return queryInterface.bulkInsert("statuses", [
      {
        id: 1,
        uuid: uuidv4(),
        name: "register",
        sequence: 1,
        code: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        uuid: uuidv4(),
        name: "active",
        sequence: 2,
        code: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        uuid: uuidv4(),
        name: "inactive",
        sequence: 3,
        code: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete("statuses", null, {});
  },
};
