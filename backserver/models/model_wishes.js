// 250103누리) 다대다의 중복테이블도 모델 정의로 초기화 필요.
    // 관계 설정은 init() 없이도 가능
    // 그러나 각 모델이 정의되어 있어야 관계 설정이 제대로 작동
    // 이는 초기화(init)가 되어야 한다는 뜻
    // 하지만 데이터는 관계 설정만으로 자동으로 중간 테이블에 추가됨. 

const Sequelize = require('sequelize');

class Wishes extends Sequelize.Model {
    static initiate(sequelize){
        Wishes.init({
            product_id : {
                type : Sequelize.INTEGER,
                allowNull: false,
                references : {
                    model : 'Products',
                    key : 'id',
                }
            },
            account_id : {
                type: Sequelize.INTEGER,
                allowNull: false,
                references : {
                    model : 'Accounts',
                    key : 'id',
                }
            },

        },{
            sequelize,
            timestamps: true, // `createdAt`, `updatedAt` 필드를 자동으로 관리
            underscored: false, // true : 스네이크 케이스(snake_case)로 자동변환. userId => user_id
            modelName:'Wishes', // 모델의 자바스크립트 클래스 이름
            tableName: 'Wishes', // DB 내의 테이블 이름
            paranoid : false, // false : 실제 삭제 - DB에서 실제 삭제. , true : 실제 삭제 x, 삭제된 시간만 기록
            charset : 'utf8',
            collate: 'utf8_general_ci',
        })
    }
}

module.exports = Wishes;