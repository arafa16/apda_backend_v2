const { nominal: nominalModel } = require("../models/index.js");
const { Op } = require("sequelize");
const CustomHttpError = require("../utils/custom_http_error.js");

const getDatas = async (req, res) => {
  const { uuid, nominal, sort } = req.query;

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

  if (nominal) {
    where.nominal = {
      [Op.like]: `%${nominal}%`,
    };
  }

  if (sequence) {
    where.sequence = sequence;
  }

  if (code) {
    where.code = code;
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = Number(page - 1) * limit;

  const { count, rows } = await nominalModel.findAndCountAll({
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
  const { search, is_active } = req.query;
  let whereClause = {};

  if (search) {
    whereClause = {
      ...whereClause,
      [Op.or]: [{ nominal: { [Op.like]: `%${search}%` } }],
    };
  }

  if (is_active) {
    whereClause.is_active = is_active;
  } else {
    whereClause.is_active = true;
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const offset = (page - 1) * limit;
  const datas = await nominalModel.findAndCountAll({
    where: whereClause,
    limit,
    offset,
  });

  const pages = Math.ceil(datas.count / limit);

  return res.status(200).json({
    success: true,
    message: "Get bank successfully",
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

  const findData = await nominalModel.findOne({
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
  const { nominal } = req.body;

  if (!nominal) {
    throw new CustomHttpError("nominal is required", 400);
  }

  const newData = await nominalModel.create({
    nominal,
    is_active: true,
  });

  return res.status(201).json({
    success: true,
    message: "new data created successfully",
    data: newData,
  });
};

const updateData = async (req, res) => {
  const { uuid } = req.params;
  const { nominal, is_active } = req.body;

  const findData = await nominalModel.findOne({
    where: { uuid },
  });

  if (!findData) {
    throw new CustomHttpError("data not found", 404);
  }

  await findData.update({
    nominal,
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

  const findData = await nominalModel.findOne({
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
