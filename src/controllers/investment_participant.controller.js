const {
  investment_participant: investmentParticipantModel,
  user: userModel,
  investment_scheme: investmentSchemeModel,
} = require("../models/index.js");
const { Op } = require("sequelize");
const CustomHttpError = require("../utils/custom_http_error.js");

const getDatas = async (req, res) => {
  const { uuid, sort } = req.query;

  const where = {};
  let order = [];

  if (sort) {
    const direction = sort.startsWith("-") ? "DESC" : "ASC";
    const columnName = sort.replace(/^-/, "");
    order.push([columnName, direction]);
  }

  if (uuid) {
    where.uuid = uuid;
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = Number(page - 1) * limit;

  const { count, rows } = await investmentParticipantModel.findAndCountAll({
    where,
    limit,
    offset,
    order,
  });

  return res.status(200).json({
    success: true,
    message: "success",
    data: {
      count,
      rows,
    },
  });
};

const getDataTable = async (req, res) => {
  const { is_active } = req.query;
  let whereClause = {};

  if (is_active) {
    whereClause.is_active = is_active;
  } else {
    whereClause.is_active = true;
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const offset = (page - 1) * limit;
  const datas = await investmentParticipantModel.findAndCountAll({
    where: whereClause,
    limit,
    offset,
  });

  const pages = Math.ceil(datas.count / limit);

  return res.status(200).json({
    success: true,
    message: "Get investment participant successfully",
    data: datas.rows,
    meta: {
      total: datas.count,
      page,
      limit,
      pages,
    },
  });
};

const getDataById = async (req, res) => {
  const { uuid } = req.params;

  const findData = await investmentParticipantModel.findOne({
    where: { uuid },
  });

  if (!findData) {
    throw new CustomHttpError("data not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "success",
    data: findData,
  });
};

const createData = async (req, res) => {
  const {
    user_uuid,
    investment_scheme_uuid,
    is_form_enabled,
    is_eligible,
    is_active,
  } = req.body;

  if (!user_uuid || !investment_scheme_uuid) {
    throw new CustomHttpError(
      "user_uuid and investment_scheme_uuid are required",
      400,
    );
  }

  let user_id = null;

  console.log("body", req.body);

  if (user_uuid) {
    const user = await userModel.findOne({
      where: { uuid: user_uuid },
    });

    if (user) {
      user_id = user.id;
    } else {
      throw new CustomHttpError("user not found", 404);
    }
  }

  let investment_scheme_id = null;

  if (investment_scheme_uuid) {
    const investmentScheme = await investmentSchemeModel.findOne({
      where: { uuid: investment_scheme_uuid },
    });
    if (investmentScheme) {
      investment_scheme_id = investmentScheme.id;
    }
  }

  const newData = await investmentParticipantModel.create({
    user_id,
    investment_scheme_id,
    is_form_enabled,
    is_eligible,
    is_active,
  });

  return res.status(201).json({
    success: true,
    message: "new data created successfully",
    data: newData,
  });
};

const updateData = async (req, res) => {
  const { uuid } = req.params;
  const {
    user_uuid,
    investment_scheme_uuid,
    is_form_enabled,
    is_eligible,
    is_active,
  } = req.body;

  const findData = await investmentParticipantModel.findOne({
    where: { uuid },
  });

  if (!findData) {
    throw new CustomHttpError("data not found", 404);
  }

  let user_id = null;

  if (user_uuid) {
    const user = await userModel.findOne({
      where: { uuid: user_uuid },
    });
    if (user) {
      user_id = user.id;
    }
  }

  let investment_scheme_id = null;

  if (investment_scheme_uuid) {
    const investmentScheme = await investmentSchemeModel.findOne({
      where: { uuid: investment_scheme_uuid },
    });
    if (investmentScheme) {
      investment_scheme_id = investmentScheme.id;
    }
  }

  await findData.update({
    user_id,
    investment_scheme_id,
    is_form_enabled,
    is_eligible,
    is_active,
  });

  return res.status(200).json({
    success: true,
    message: "data updated successfully",
    data: findData,
  });
};

const deleteData = async (req, res) => {
  const { uuid } = req.params;
  const { permanent } = req.query;

  const findData = await investmentParticipantModel.findOne({
    where: { uuid },
  });

  if (!findData) {
    throw new CustomHttpError("data not found", 404);
  }

  if (permanent) {
    if (permanent === "1") {
      await findData.destroy();

      return res.status(200).json({
        success: true,
        message: "data deleted permanent successfully",
      });
    } else {
      await findData.update({
        is_active: false,
      });

      return res.status(200).json({
        success: true,
        message: "data deleted successfully",
        data: findData,
      });
    }
  }

  await findData.update({
    is_active: false,
  });

  return res.status(200).json({
    success: true,
    message: "data deleted successfully",
  });
};

module.exports = {
  getDatas,
  getDataTable,
  getDataById,
  createData,
  updateData,
  deleteData,
};
