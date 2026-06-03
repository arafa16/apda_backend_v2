"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class investment_account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  investment_account.init(
    {
      uuid: DataTypes.STRING,
      name: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      investment_scame_id: DataTypes.INTEGER,
      stage_id: DataTypes.INTEGER,
      code: DataTypes.DECIMAL,
      number: DataTypes.DECIMAL,
      year: DataTypes.DECIMAL,
      is_active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "investment_account",
      underscored: true,
    },
  );
  return investment_account;
};
