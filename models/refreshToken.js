module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define(
    "RefreshToken",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      token: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "refresh_tokens",
      timestamps: false,
      underscored: true,
    },
  );

  // Association
  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.User, { foreignKey: "userId" });
  };

  return RefreshToken;
};
