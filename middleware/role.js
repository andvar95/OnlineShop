const Role = require("../models/role");

const haveRole = (...role) => {
  return async (req, res, next) => {
    let error = true;
    try {
      const roleUser = await Role.findById(req.user.roleId);

      if (!role.includes(roleUser.name))
        return res.status(400).send("You need be " + role);

      next();
    } catch (err) {
      res.status(400).send("Error checking role");
    }
  };
};
module.exports = {
  haveRole,
};
