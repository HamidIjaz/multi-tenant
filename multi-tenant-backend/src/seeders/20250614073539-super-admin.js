"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("superadminpassword", salt);

    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "Super Admin",
          email: "superadmin@gmail.com",
          password: hashedPassword,
          role: "SuperAdmin",
          tenantId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", {
      email: "superadmin@gmail.com",
    });
  },
};
