const Sequelize = require('sequelize');
const Accounts = require('./model_accounts.js');
const Buckets = require('./model_buckets.js');
const Coupons = require('./model_coupons.js');
const Likes = require('./model_likes.js');
const Orders = require('./model_orders.js');
const Postes = require('./model_postes.js');
const ProductLocations = require('./model_productLocations.js');
const Products = require('./model_products.js');
const Ratings = require('./model_ratings.js');
const RecommendTags = require('./model_recommendTags.js');
const Replies = require('./model_replies.js');
const Searched = require('./model_searched.js');
const SupplyFactory = require('./model_supplyFactory.js');
const Wishes = require ('./model_wishes.js');
const OrderStatuses = require ('./model_orderStatuses.js'); //250112 누리 추가
const HaveCoupons = require('./model_haveCoupons.js');


//환경변수 설정
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

//db 연결
const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;

//테이블 생성
db.Accounts = Accounts;
Accounts.initiate(sequelize);

db.Buckets = Buckets;
Buckets.initiate(sequelize);

db.Coupons = Coupons;
Coupons.initiate(sequelize);

db.Likes = Likes;
Likes.initiate(sequelize);

db.Orders = Orders;
Orders.initiate(sequelize);

db.Postes = Postes;
Postes.initiate(sequelize);

db.ProductLocations = ProductLocations;
ProductLocations.initiate(sequelize);

db.Products = Products;
Products.initiate(sequelize);

db.Ratings = Ratings;
Ratings.initiate(sequelize);

db.RecommendTags = RecommendTags;
RecommendTags.initiate(sequelize);

db.Replies = Replies;
Replies.initiate(sequelize);

db.Searched = Searched;
Searched.initiate(sequelize);

db.SupplyFactory = SupplyFactory;
SupplyFactory.initiate(sequelize);

//!!지우지마셈!! 
// 250103누리) 다대다로 인해 생성되는 중간테이블 정의하기.
db.Wishes = Wishes; // 정의된 sequelize wish를 db에 넣기. 
Wishes.initiate(sequelize); 
    // init 메서드는 테이블을 생성도 하지만, 기존 테이블과 Sequelize 모델을 연결하는 작업이기도 함. 
    // DB와 Sequelize 모델을 연결하고 모델의 정의와 DB 테이블의 구조를 일치시킴.
    // 테이블을 새로 만들지 않더라도 sequelize에서 이 db테이블을 모델로 다룰 수 있도록 초기화해줘야함.

db.HaveCoupons = HaveCoupons;
HaveCoupons.initiate(sequelize);
//250112 누리) orderStatus 테이블 추가
db.OrderStatuses = OrderStatuses;
OrderStatuses.initiate(sequelize);




//테이블 관계 설정
//Products
db.Products.belongsTo(db.ProductLocations,{foreignKey: { name: 'product_location_id', allowNull: true }, targetKey:'id'});
db.ProductLocations.hasMany(db.Products,{foreignKey: { name: 'product_location_id', allowNull: true }, sourceKey:'id'});
db.Products.belongsTo(db.SupplyFactory,{foreignKey: { name: 'supply_factory_id', allowNull: true }, targetKey:'id'});
db.SupplyFactory.hasMany(db.Products,{foreignKey: { name: 'supply_factory_id', allowNull: true }, sourceKey:'id'});
// N:M 다대다, 중간테이블로 연결.
db.Products.belongsToMany(db.RecommendTags, { through: 'ProductsRecommendTags', foreignKey: 'product_id' });
db.RecommendTags.belongsToMany(db.Products, { through: 'ProductsRecommendTags', foreignKey: 'recommend_tag_id' });


/// (250103누리) through : 'wishes' 에서, Wishes를 import 하여 실제 db.Wishes로 변경.
db.Products.belongsToMany(db.Accounts, { through: db.Wishes, foreignKey: 'product_id' }); //Wishes -> 찜 테이블 명
db.Accounts.belongsToMany(db.Products, { through: db.Wishes, foreignKey: 'account_id' });



//orders
db.Orders.belongsTo(db.Accounts,{foreignKey: { name: 'account_id'}, targetKey:'id'});
db.Accounts.hasMany(db.Orders,{foreignKey: { name: 'account_id'}, sourceKey:'id'});
db.Orders.belongsTo(db.Products,{foreignKey: { name: 'product_id',allowNull: true}, targetKey:'id'});
db.Products.hasMany(db.Orders,{foreignKey: { name: 'product_id',allowNull: true}, sourceKey:'id'});
//250112 누리)) 주문상태 테이블 추가 
db.Orders.belongsTo(db.OrderStatuses, {foreignKey : {name : 'status_id', defaultValue : 1}, targetKey : 'id'});
db.OrderStatuses.hasMany(db.Orders, {foreignKey : {name : 'status_id', defaultValue : 1}, targetKey : 'id'})

//Buckets
db.Buckets.belongsTo(db.Accounts,{foreignKey: { name: 'account_id'}, targetKey:'id'});
db.Accounts.hasMany(db.Buckets,{foreignKey: { name: 'account_id'}, sourceKey:'id'});
db.Buckets.belongsTo(db.Products,{foreignKey: { name: 'product_id',allowNull: true}, targetKey:'id'});
db.Products.hasMany(db.Buckets,{foreignKey: { name: 'product_id',allowNull: true}, sourceKey:'id'});

//HaveCoupons
db.Coupons.belongsToMany(db.Accounts, { through: db.HaveCoupons, foreignKey: 'coupon_id' });
db.Accounts.belongsToMany(db.Coupons, { through: db.HaveCoupons, foreignKey: 'account_id' });

//Postes
db.Postes.belongsTo(db.Accounts,{foreignKey: { name: 'account_id'}, targetKey:'id'});
db.Accounts.hasMany(db.Postes,{foreignKey: { name: 'account_id'}, sourceKey:'id'});

//Likes
db.Likes.belongsTo(db.Postes,{foreignKey: { name: 'post_id'}, targetKey:'id',onDelete: 'CASCADE'});
db.Postes.hasMany(db.Likes,{foreignKey: { name: 'post_id'}, sourceKey:'id'});
db.Likes.belongsTo(db.Replies,{foreignKey: { name: 'reply_id'}, targetKey:'id',onDelete: 'CASCADE'});
db.Replies.hasMany(db.Likes,{foreignKey: { name: 'reply_id'}, sourceKey:'id'});

//Replies
db.Replies.belongsTo(db.Postes,{foreignKey: { name: 'post_id'}, targetKey:'id',onDelete: 'CASCADE'}); //post_id 삭제시 댓글도 삭제 추가
db.Postes.hasMany(db.Replies,{foreignKey: { name: 'post_id'}, sourceKey:'id'});
db.Replies.belongsTo(db.Accounts,{foreignKey: { name: 'account_id'}, targetKey:'id',onDelete: 'CASCADE'}); //account_id 삭제시 댓글도 삭제 추가
db.Accounts.hasMany(db.Replies,{foreignKey: { name: 'account_id'}, sourceKey:'id'});
db.Replies.belongsTo(db.Products,{foreignKey: { name: 'product_id'}, targetKey:'id',onDelete: 'SET NULL'}); //product_id 삭제시 댓글의 product_id 를 NULL로 설정 추가
db.Products.hasMany(db.Replies,{foreignKey: { name: 'product_id'}, sourceKey:'id'});

//account
db.Accounts.belongsTo(db.Ratings,{foreignKey: { name: 'rating_id',defaultValue:1}, targetKey:'id'});
db.Ratings.hasMany(db.Accounts,{foreignKey: { name: 'rating_id',defaultValue:1}, sourceKey:'id'});

//250103 누리) wishes
db.Wishes.belongsTo(db.Accounts, { foreignKey: 'account_id', targetKey: 'id'});
db.Wishes.belongsTo(db.Products, { foreignKey : 'product_id', targetKey : 'id'});

db.HaveCoupons.belongsTo(db.Coupons, { foreignKey: 'coupon_id', targetKey: 'id'});
db.HaveCoupons.belongsTo(db.Accounts, { foreignKey: 'account_id', targetKey: 'id'});


module.exports = db;
