const jwt = require("jsonwebtoken");
const {
  user: userModel,
  status: statusModel,
  privilege: privilegeModel,
} = require("../models");
const CustomHttpError = require("../utils/custom_http_error.js");

const verifyToken = async (req, res, next) => {
  const token = req.session.token;

  if (!token) {
    throw new CustomHttpError("access denied, no token provided", 403);
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      throw new CustomHttpError("access expired, please login again", 401);
    }

    try {
      const user = await userModel.findOne({
        where: {
          uuid: decoded.uuid,
        },
        include: [
          {
            model: statusModel,
            attributes: ["name", "code"],
          },
          {
            model: privilegeModel,
            attributes: {
              exclude: ["id"],
            },
          },
        ],
      });

      if (!user) {
        throw new CustomHttpError(
          "login failed, user not found or deleted",
          404,
        );
      }

      if (user.status.code !== "2") {
        throw new CustomHttpError(
          `you don't have access, status account is ${user.status.name}`,
          401,
        );
      }

      req.user = user;

      next();
    } catch (error) {
      throw new CustomHttpError("internal server error", 500);
    }
  });
};

module.exports = {
  verifyToken,
};
