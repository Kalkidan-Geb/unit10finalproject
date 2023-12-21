const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Course = sequelize.define("Course", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "A title is required",
        },
        notEmpty: {
          msg: "Please provide a title",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "A description is required",
        },
        notEmpty: {
          msg: "Please provide a description",
        },
      },
    },
    estimatedTime: {
      type: DataTypes.STRING,
    },
    materialsNeeded: {
      type: DataTypes.STRING,
    },
  });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: "userId",
    });
  };

  return Course;
};
