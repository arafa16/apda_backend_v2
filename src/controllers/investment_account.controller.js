const {
  investment_account: investmentAccountModel,
  investment_amount: investmentAmountModel,
  stage: stageModel,
  investment_participant: investmentParticipantModel,
  user: userModel,
  investment_scheme: investmentSchemeModel,
} = require("../models/index.js");
const { Op } = require("sequelize");
const CustomHttpError = require("../utils/custom_http_error.js");

const getDatas = async (req, res) => {
  const { uuid, name, sort } = req.query;

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

  const { count, rows } = await investmentAccountModel.findAndCountAll({
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
  const { name, is_active } = req.query;
  let whereClause = {};

  if (name) {
    whereClause.name = {
      [Op.like]: `%${name}%`,
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
  const datas = await investmentAccountModel.findAndCountAll({
    where: whereClause,
    limit,
    offset,
  });

  const pages = Math.ceil(datas.count / limit);

  return res.status(200).json({
    success: true,
    message: "Get investment account successfully",
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

  const findData = await investmentAccountModel.findOne({
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
    stage_uuid,
    investment_amount_data,
  } = req.body;

  console.log("body", req.body);

  if (!user_uuid || !investment_scheme_uuid) {
    throw new CustomHttpError(
      "user_uuid and investment_scheme_uuid are required",
      400,
    );
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
  let number_investment_scheme = null;
  let code = null;
  let number_investment_account = null;
  let year = null;

  if (investment_scheme_uuid) {
    const investmentScheme = await investmentSchemeModel.findOne({
      where: { uuid: investment_scheme_uuid },
    });
    if (investmentScheme) {
      investment_scheme_id = investmentScheme.id;
      code = investmentScheme.code;
      number_investment_scheme = investmentScheme.number;
      year = new Date().getFullYear();
      const lastInvestmentAccount = await investmentAccountModel.findOne({
        where: { investment_scheme_id },
        order: [["created_at", "DESC"]],
      });
      if (lastInvestmentAccount) {
        number_investment_account = Number(lastInvestmentAccount.number) + 1;
      } else {
        number_investment_account = 1;
      }
    } else {
      throw new CustomHttpError("investment scheme not found", 404);
    }
  }

  let stage_id = null;

  if (stage_uuid) {
    const stage = await stageModel.findOne({
      where: { uuid: stage_uuid },
    });
    if (stage) {
      stage_id = stage.id;
    } else {
      const defaultStage = await stageModel.findOne({
        where: { is_default: true },
      });
      if (defaultStage) {
        stage_id = defaultStage.id;
      } else {
        throw new CustomHttpError("stage not found", 404);
      }
    }
  } else {
    const defaultStage = await stageModel.findOne({
      where: { is_default: true },
    });
    if (defaultStage) {
      stage_id = defaultStage.id;
    } else {
      throw new CustomHttpError("stage not found", 404);
    }
  }

  const name = `${code}/${year}/${String(number_investment_scheme).padStart(3, "0")}/${String(number_investment_account).padStart(3, "0")}`;

  const newData = await investmentAccountModel.create({
    user_id,
    investment_scheme_id,
    name,
    stage_id,
    code,
    number: Number(number_investment_account),
    year,
    is_active: true,
  });

  const investmentAmountData = investment_amount_data.map((item) => ({
    investment_account_id: newData.id,
    amount: Number(item),
    is_active: true,
  }));

  await investmentAmountModel.bulkCreate(investmentAmountData);

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
    stage_uuid,
    investment_amount_data,
  } = req.body;

  const findData = await investmentAccountModel.findOne({
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
    } else {
      throw new CustomHttpError("investment scheme not found", 404);
    }
  }

  let stage_id = null;

  if (stage_uuid) {
    const stage = await stageModel.findOne({
      where: { uuid: stage_uuid },
    });
    if (stage) {
      stage_id = stage.id;
    } else {
      const defaultStage = await stageModel.findOne({
        where: { is_default: true },
      });
      if (defaultStage) {
        stage_id = defaultStage.id;
      } else {
        throw new CustomHttpError("stage not found", 404);
      }
    }
  } else {
    const defaultStage = await stageModel.findOne({
      where: { is_default: true },
    });
    if (defaultStage) {
      stage_id = defaultStage.id;
    } else {
      throw new CustomHttpError("stage not found", 404);
    }
  }

  await findData.update({
    user_id,
    investment_scheme_id,
    stage_id,
  });

  const investmentAmountData = investment_amount_data.map((item) => ({
    investment_account_id: findData.id,
    amount: Number(item),
    is_active: true,
  }));

  await investmentAmountModel.destroy({
    where: { investment_account_id: findData.id },
  });

  await investmentAmountModel.bulkCreate(investmentAmountData);

  const updatedData = await investmentAccountModel.findOne({
    where: { uuid },
    attributes: {
      exclude: ["id", "user_id", "investment_scheme_id", "stage_id"],
    },
    include: [
      {
        model: investmentAmountModel,
        as: "investment_amounts",
        attributes: { exclude: ["id", "investment_account_id"] },
      },
    ],
  });

  return res.status(200).json({
    success: true,
    message: "data updated successfully",
    data: updatedData,
  });
};

const deleteData = async (req, res) => {
  const { uuid } = req.params;
  const { permanent } = req.query;

  const findData = await investmentAccountModel.findOne({
    where: { uuid },
  });

  if (!findData) {
    throw new CustomHttpError("data not found", 404);
  }

  if (permanent) {
    if (permanent === "1") {
      await investmentAmountModel.destroy({
        where: { investment_account_id: findData.id },
      });

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
