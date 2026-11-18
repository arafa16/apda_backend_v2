"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class investment_scheme extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  investment_scheme.init(
    {
      uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
      },
      name: DataTypes.STRING,
      code: DataTypes.STRING,
      number: DataTypes.DECIMAL,
      year: DataTypes.STRING,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      target_amount: DataTypes.DECIMAL,
      max_investment_amount: DataTypes.DECIMAL,
      is_target_reached: DataTypes.BOOLEAN,
      fund_received_date: DataTypes.DATE,
      signer_name: DataTypes.STRING,
      profit_share: DataTypes.STRING,
      payment_term: DataTypes.STRING,
      first_payment_date: DataTypes.DATE,
      last_payment_date: DataTypes.DATE,
      contract_name: DataTypes.STRING,
      contract_start_date: DataTypes.DATE,
      contract_end_date: DataTypes.DATE,
      auto_deactivate_after_submit: DataTypes.BOOLEAN,
      is_active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "investment_scheme",
      underscored: true,
    },
  );
  return investment_scheme;
};
