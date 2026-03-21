module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    'Category',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(180),
        allowNull: false,
        unique: true,
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'parent_id',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: 'categories',
      underscored: true,
      timestamps: true,
      paranoid: true,
    },
  );

  Category.associate = function (models) {
    Category.hasMany(models.Category, {
      as: 'children',
      foreignKey: 'parentId',
    });
    Category.belongsTo(models.Category, {
      as: 'parent',
      foreignKey: 'parentId',
    });
  };

  return Category;
};
