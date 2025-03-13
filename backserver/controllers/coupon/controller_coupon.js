const coupon = require('../../models/model_coupons');
const Accounts = require('../../models/model_accounts');
const db = require('../../models/model_index');
const HaveCoupons = db.sequelize.models.HaveCoupons;

exports.getSpecificUserCoupons = async (req, res) => {
    try {
  
        const {email} = req.user;
        const user = await Accounts.findOne({where:{email}});
        const result = await HaveCoupons.findAll({
            where: {
                account_id: user.id
            },
            order: [['created_at', 'DESC']],
            include: [{
                model: coupon,
                attributes: ['coupon_name','coupon_discount_rate']
            }]
        });

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}