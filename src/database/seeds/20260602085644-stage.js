"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { v4: uuidv4 } = await import("uuid");

    return queryInterface.bulkInsert("stages", [
      {
        id: 1,
        uuid: uuidv4(),
        name: "draft",
        sequence: 1,
        code: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        uuid: uuidv4(),
        name: "submission",
        sequence: 2,
        code: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        uuid: uuidv4(),
        name: "Approved",
        sequence: 3,
        code: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        uuid: uuidv4(),
        name: "Waiting List",
        sequence: 4,
        code: 4,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        uuid: uuidv4(),
        name: "Cancel",
        sequence: 5,
        code: 5,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete("stages", null, {});
  },
};
