const { Tenant } = require("../models");

const tenantResolver = async (req, res, next) => {
  let tenantId = null;

  const tenantHeader = req.headers["x-tenant-id"];
  if (tenantHeader) {
    tenantId = tenantHeader;
  } else {
    const hostname = req.hostname;
    const subdomain = hostname.split(".")[0];
    if (
      subdomain &&
      subdomain !== "www" &&
      subdomain !== "localhost" &&
      subdomain !== "api"
    ) {
      tenantId = subdomain;
    }
  }

  if (tenantId) {
    const tenant = await Tenant.findOne({ where: { subdomain: tenantId } });
    if (tenant) {
      req.tenant = tenant;
    }
  }

  next();
};

module.exports = tenantResolver;
