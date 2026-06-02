"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { v4: uuidv4 } = await import("uuid");

    return queryInterface.bulkInsert("banks", [
      {
        id: 1,
        uuid: uuidv4(),
        name: "Mandiri",
        sequence: 1,
        code: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        uuid: uuidv4(),
        name: "BRI",
        sequence: 2,
        code: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        uuid: uuidv4(),
        name: "MUAMALAT",
        sequence: 3,
        code: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        uuid: uuidv4(),
        name: "BNI",
        sequence: 4,
        code: 4,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        uuid: uuidv4(),
        name: "BCA",
        sequence: 5,
        code: 5,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 6,
        uuid: uuidv4(),
        name: "BSI",
        sequence: 6,
        code: 6,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 7,
        uuid: uuidv4(),
        name: "CIMB NIAGA",
        sequence: 7,
        code: 7,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete("banks", null, {});
  },
};
