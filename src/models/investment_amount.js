"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class investment_amount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  investment_amount.init(
    {
      uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
      },
      investment_account_id: DataTypes.INTEGER,
      amount: DataTypes.DECIMAL,
      is_active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "investment_amount",
      underscored: true,
    },
  );
  return investment_amount;
};
