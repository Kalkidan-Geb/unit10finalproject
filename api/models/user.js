const { DataTypes } = require("sequelize");
const bcryptjs = require("bcryptjs");

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "A first name is required",
        },
        notEmpty: {
          msg: "Please provide a first name",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "A last name is required",
        },
        notEmpty: {
          msg: "Please provide a last name",
        },
      },
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Valid email is required",
        },
        notNull: {
          msg: "An email is required",
        },
        notEmpty: {
          msg: "Please provide an email",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "A password is required",
        },
        notEmpty: {
          msg: "Please provide a password",
        },
      },

    set(value) {
         if (value) {
        const hashedPassword = bcryptjs.hashSync(value, 10);
        this.setDataValue("password", hashedPassword);
         }
      },
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: "userId",
    });
  };

  return User;
};
