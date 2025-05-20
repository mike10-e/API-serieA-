// src/models/gionata.model.js
module.exports = (sequelize, DataTypes) => {
    const Partita = sequelize.define('Partita', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      giornata: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      golCasa: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      golTrasferta: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_squadra_casa: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_squadra_trasferta: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      tableName: 'partita',
      timestamps: false,
    });
  
    return Partita;
  };
  