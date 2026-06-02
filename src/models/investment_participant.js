"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class investment_participant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  investment_participant.init(
    {
      uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: DataTypes.INTEGER,
      investment_scame_id: DataTypes.INTEGER,
      is_form_enabled: DataTypes.BOOLEAN,
      is_eligible: DataTypes.BOOLEAN,
      is_active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "investment_participant",
      underscored: true,
    },
  );
  return investment_participant;
};
