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
      investment_account.belongsTo(models.user, {
        foreignKey: "user_id",
        as: "user",
      });
      investment_account.belongsTo(models.investment_scheme, {
        foreignKey: "investment_scheme_id",
        as: "investment_scheme",
      });
      investment_account.belongsTo(models.stage, {
        foreignKey: "stage_id",
        as: "stage",
      });
      investment_account.hasMany(models.investment_amount, {
        foreignKey: "investment_account_id",
        as: "investment_amounts",
      });
    }
  }
  investment_account.init(
    {
      uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
      },
      name: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      investment_scheme_id: DataTypes.INTEGER,
      stage_id: DataTypes.INTEGER,
      code: DataTypes.STRING,
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
