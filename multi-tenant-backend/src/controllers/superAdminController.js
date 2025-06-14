const { Tenant, User } = require("../models");

exports.getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.findAll({
      include: {
        model: User,
        as: "users",
        attributes: ["id", "name", "email", "role"],
      },
    });
    res.json(tenants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};
