const { and, Op } = require("sequelize");
const { User } = require("../models");
const { Tenant } = require("../models");

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  const adminUser = req.user;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide name, email, and password." });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A user with this email already exists." });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role: "User",
      tenantId: adminUser.tenantId,
    });

    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      tenantId: newUser.tenantId,
    };

    res
      .status(201)
      .json({ message: "User created successfully!", user: userResponse });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

exports.getTenant = async (req, res) => {
  try {
    const include = [];
    if (req.user.role === "Admin") {
      include.push({
        model: User,
        as: "users",
        where: { tenantId: req.user.tenantId },
        attributes: ["id", "name", "email", "role"],
      });
    }

    const tenant = await Tenant.findOne({
      where: { id: req.user.tenantId },
      include,
    });

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found." });
    }

    res.json(tenant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const tenant = await User.findAll({
      where: {
        [Op.and]: [
          { tenantId: req.user.tenantId },
          { id: { [Op.ne]: req.user.id } },
        ],
      },
    });
    res.json(tenant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};
