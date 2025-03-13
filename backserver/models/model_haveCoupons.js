const Sequelize = require('sequelize');

class HaveCoupons extends Sequelize.Model {
    static initiate(sequelize) {
        HaveCoupons.init({
            coupon_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            account_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: true,
            modelName: 'HaveCoupons',
            tableName: 'have_coupons',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
}

module.exports = HaveCoupons;