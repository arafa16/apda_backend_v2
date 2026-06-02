"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class nominal_select extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  nominal_select.init(
    {
      uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
      },
      nominal: DataTypes.DECIMAL,
      is_active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "nominal_select",
      underscored: true,
    },
  );
  return nominal_select;
};
