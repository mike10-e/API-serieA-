
module.exports = (Sequelize, DataTypes) => {
    const Evento = Sequelize.define("Evento", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
       },
        minuto:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tipo: {
            type:DataTypes.STRING,
            allowNull: false,
        },
        id_partita:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_giocatore:{
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },{
        tableName: 'evento',
        timestamps: false
    });
    return Evento;
}