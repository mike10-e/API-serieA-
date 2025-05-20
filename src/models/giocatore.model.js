module.exports = (sequelize, DataTypes) => {
    const Giocatore = sequelize.define("Giocatore", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false
      },
      cognome: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nazionalità: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ruolo: {
        type: DataTypes.STRING,
        allowNull: false
      },
      età: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      id_squadra: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      tableName: 'giocatore', // specifichiamo il nome reale della tabella
      timestamps: false       // disattiva createdAt / updatedAt
    });
  
    return Giocatore;
  };
  