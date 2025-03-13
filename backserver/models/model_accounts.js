const Sequelize = require('sequelize');

class Accounts extends Sequelize.Model {
  static initiate(sequelize) {
    Accounts.init({
        email:{
            type: Sequelize.STRING(100),
            allowNull: false,
        },
        password:{
            type: Sequelize.STRING(200),
            allowNull: true,
        },
        name:{
            type: Sequelize.STRING(20),
            allowNull: true,
        },
        birth:{
            type: Sequelize.DATEONLY,
            allowNull: true,
        },
        nickname:{
            type: Sequelize.STRING(25),
            allowNull: true,
        },
        phone_number:{
            type: Sequelize.STRING(15),
            allowNull: true,
        },
        address:{
            type: Sequelize.STRING(100),
            allowNull: true,
        },
        addressNumber:{
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        addressDetail:{
            type: Sequelize.STRING(100),
            allowNull: true,
        },
        delete_time:{
            type: Sequelize.DATE,
            allowNull: true,
        },
        ratingPoint:{
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        savedMoney:{
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        created_at:{
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
        },
        updated_at:{
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.NOW,
        },
        recently_product_1:{
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        recently_product_2:{
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        recently_product_3:{
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        recently_product_4:{
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        recently_product_5:{
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        super_admin:{
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },{
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: 'Accounts',
        tableName: 'Accounts',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
    })
  }
}
//관계 설정은 index에서 한번에 진행.
module.exports = Accounts;