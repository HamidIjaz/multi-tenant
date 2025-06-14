const { User, Tenant } = require("../models");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../models");

// 1. Tenant and initial Admin registration
exports.register = async (req, res) => {
  const { tenantName, subdomain, adminName, email, password } = req.body;

  if (!tenantName || !subdomain || !adminName || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }

  const t = await sequelize.transaction();
  try {
    // Check if subdomain or email is already in use
    const existingTenant = await Tenant.findOne({ where: { subdomain } });
    if (existingTenant) {
      await t.rollback();
      return res.status(400).json({ message: "Subdomain is already in use." });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      await t.rollback();
      return res.status(400).json({ message: "Email is already registered." });
    }

    // Create the new tenant
    const newTenant = await Tenant.create(
      { name: tenantName, subdomain },
      { transaction: t }
    );

    // Create the initial admin user for this tenant
    const newAdmin = await User.create(
      {
        name: adminName,
        email,
        password,
        role: "Admin",
        tenantId: newTenant.id,
      },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({
      message: "Tenant and Admin user created successfully!",
      tenant: newTenant,
      user: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// 2. User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.validPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // ✅ THIS LOGIC IS NOW CRITICAL
    // It enforces the multi-tenancy rules at the point of login.

    // Case 1: SuperAdmin can log in from anywhere (no tenant context needed)
    if (user.role !== "SuperAdmin") {
      // If the user is a tenant user, a tenant MUST be resolved from the subdomain.
      if (!req.tenant) {
        return res.status(401).json({
          message:
            "Access denied. Please use your company's subdomain to log in.",
        });
      }
      // The resolved tenant's ID must match the user's tenantId.
      if (req.tenant.id !== user.tenantId) {
        return res.status(401).json({
          message: "Access denied. You are not a member of this tenant.",
        });
      }
    }

    console.log("user :>> ", user);
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "Logged in successfully!", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login." });
  }
};

exports.getProfile = async (req, res) => {
  const { id, name, email, role, tenantId } = req.user;
  res.json({ id, name, email, role, tenantId });
};
