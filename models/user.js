module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      mobileNumber: {
        type: DataTypes.STRING,
        unique: true,
      },

      status: {
        type: DataTypes.ENUM("active", "inactive"),
        allowNull: false,
        defaultValue: "active",
      },

      lastLoginAt: {
        type: DataTypes.DATE,
      },

      createdBy: {
        type: DataTypes.INTEGER,
      },

      updatedBy: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      underscored: true,
      paranoid: true,
    },
  );

  // Association: Each User belongsTo one Role
  User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: "roleId" });
  };

  return User;
};
