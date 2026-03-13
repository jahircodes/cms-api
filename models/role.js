module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      status: {
        type: DataTypes.ENUM("active", "inactive"),
        allowNull: false,
        defaultValue: "active",
      },

      createdBy: {
        type: DataTypes.INTEGER,
      },

      updatedBy: {
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "roles",
      timestamps: true,
      underscored: true,
      paranoid: true,
    },
  );

  // Association: One Role hasMany Users
  Role.associate = (models) => {
    Role.hasMany(models.User, { foreignKey: "roleId" });
  };

  return Role;
};
