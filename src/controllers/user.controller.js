const {
  user: userModel,
  bank: bankModel,
  company: companyModel,
  status: statusModel,
} = require("../models/index.js");
const { Op } = require("sequelize");
const CustomHttpError = require("../utils/custom_http_error.js");

const getDatas = async (req, res) => {
  const { uuid, name, sequence, code, sort } = req.query;

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

  if (name) {
    where.name = {
      [Op.like]: `%${name}%`,
    };
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = Number(page - 1) * limit;

  const { count, rows } = await userModel.findAndCountAll({
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
      [Op.or]: [{ name: { [Op.like]: `%${search}%` } }],
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
  const datas = await userModel.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: bankModel,
        attributes: ["uuid", "name"],
      },
      {
        model: companyModel,
        attributes: ["uuid", "name"],
      },
      {
        model: statusModel,
        attributes: ["uuid", "name"],
      },
    ],
    limit,
    offset,
  });

  const pages = Math.ceil(datas.count / limit);

  return res.status(200).json({
    success: true,
    message: "Get data successfully",
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

  const findData = await userModel.findOne({
    where: { uuid },
    include: [
      {
        model: bankModel,
        attributes: ["uuid", "name"],
      },
      {
        model: companyModel,
        attributes: ["uuid", "name"],
      },
      {
        model: statusModel,
        attributes: ["uuid", "name"],
      },
    ],
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
    name,
    email,
    password,
    membership_number,
    nik,
    phone_number,
    bank_uuid,
    bank_account_number,
    address,
    registration_date,
    company_uuid,
    status_uuid,
    npwp,
  } = req.body;

  if (!name || !email || !password) {
    throw new CustomHttpError("name, email, and password are required", 400);
  }

  const existingUser = await userModel.findOne({
    where: { email },
  });

  if (existingUser) {
    throw new CustomHttpError("email already exists", 400);
  }

  //bank_uuid is optional, if bank_uuid is provided, check if bank exists
  const bank_id = null;

  if (bank_uuid) {
    const bank = await bankModel.findOne({
      where: { uuid: bank_uuid },
    });
    if (!bank) {
      throw new CustomHttpError("bank not found", 404);
    }
    bank_id = bank.id;
  }

  //company_uuid is optional, if company_uuid is provided, check if company exists
  const company_id = null;

  if (company_uuid) {
    const company = await companyModel.findOne({
      where: { uuid: company_uuid },
    });
    if (!company) {
      throw new CustomHttpError("company not found", 404);
    }
    company_id = company.id;
  }

  //status_uuid is optional, if status_uuid is provided, check if status exists
  const status_id = null;

  if (status_uuid) {
    const status = await statusModel.findOne({
      where: { uuid: status_uuid },
    });
    if (!status) {
      throw new CustomHttpError("status not found", 404);
    }
    status_id = status.id;
  }

  const privilege = await privilegeModel.create({
    name,
    user: true,
    dashboard: false,
    investment: false,
    setting: false,
    is_active: true,
  });

  const newData = await userModel.create({
    name,
    email,
    password,
    membership_number,
    nik,
    phone_number,
    bank_id,
    bank_account_number,
    address,
    registration_date,
    company_id,
    status_id,
    npwp,
    privilege_id: privilege.id,
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
  const {
    name,
    email,
    password,
    membership_number,
    nik,
    phone_number,
    bank_uuid,
    bank_account_number,
    address,
    registration_date,
    company_uuid,
    status_uuid,
    npwp,
  } = req.body;

  const findData = await userModel.findOne({
    where: { uuid },
  });

  if (!findData) {
    throw new CustomHttpError("data not found", 404);
  }

  //bank_uuid is optional, if bank_uuid is provided, check if bank exists
  const bank_id = null;

  if (bank_uuid) {
    const bank = await bankModel.findOne({
      where: { uuid: bank_uuid },
    });
    if (!bank) {
      throw new CustomHttpError("bank not found", 404);
    }
    bank_id = bank.id;
  }

  //company_uuid is optional, if company_uuid is provided, check if company exists
  const company_id = null;

  if (company_uuid) {
    const company = await companyModel.findOne({
      where: { uuid: company_uuid },
    });
    if (!company) {
      throw new CustomHttpError("company not found", 404);
    }
    company_id = company.id;
  }

  //status_uuid is optional, if status_uuid is provided, check if status exists
  const status_id = null;

  if (status_uuid) {
    const status = await statusModel.findOne({
      where: { uuid: status_uuid },
    });
    if (!status) {
      throw new CustomHttpError("status not found", 404);
    }
    status_id = status.id;
  }

  await findData.update({
    name,
    email,
    password,
    membership_number,
    nik,
    phone_number,
    bank_id,
    bank_account_number,
    address,
    registration_date,
    company_id,
    status_id,
    npwp,
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

  const findData = await userModel.findOne({
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
