const Sequelize = require('sequelize');

class Likes extends Sequelize.Model {
    static initiate(sequelize){
        Likes.init({
            who_liked:{//unique속성 뺐음. 중복 가능해야 함.
                type: Sequelize.STRING(100),//100바이트로 늘림. 좋아요 누른사람 email 넣을 예정.
                allowNull: false,
            }
        },{
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Likes',
            tableName: 'Likes',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        })
    }
}

module.exports = Likes;