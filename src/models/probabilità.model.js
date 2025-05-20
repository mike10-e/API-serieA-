// models/probabilita.model.js
const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Probabilita = sequelize.define('Probabilita', {
    percentualeVittoria: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    percentualeSconfitta: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    percentualePareggio: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    tableName: 'probabilità', // Specifica il nome della tabella con l'accento  
    timestamps: false,
  });

  return Probabilita;
};
