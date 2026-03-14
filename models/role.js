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
        // Example: 'Admin', 'Editor', etc.
      },

      roleKey: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        // Example: 'ADMIN', 'EDITOR', etc.
      },

      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
