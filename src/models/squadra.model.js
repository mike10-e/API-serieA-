module.exports = (sequelize, DataTypes) => {
    const Squadra = sequelize.define('Squadra', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      tableName: 'squadra',
      timestamps: false,
    });
  
    return Squadra;
  };
  