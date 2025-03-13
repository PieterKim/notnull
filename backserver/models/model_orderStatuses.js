const Sequelize = require('sequelize');

class OrderStatuses extends Sequelize.Model {
    static initiate(sequelize) {
        OrderStatuses.init({
            status : {
                type : Sequelize.STRING(50),
                allowNull: false,
            }

        },{
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'OrderStatuses',
            tableName: 'OrderStatuses',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        })
    }
}

module.exports = OrderStatuses;