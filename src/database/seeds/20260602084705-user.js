"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { v4: uuidv4 } = await import("uuid");
    const argon = await import("argon2");

    return queryInterface.bulkInsert("users", [
      {
        id: 1,
        uuid: uuidv4(),
        name: "admin",
        email: "admin@gmail.com",
        password: await argon.hash("password"),
        status_id: 2,
        privilege_id: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete("users", null, {});
  },
};
