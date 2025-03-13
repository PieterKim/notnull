const { Products } = require('../../models/model_index.js');  
const { Op } = require('sequelize');

// 상품 조회 (전체 목록)
exports.getProducts = async (req, res,next) => {
  try {
    const results = await Products.findAll({
      where: { product_kind: 'drink' },  
    });
    res.json(results); 
  } catch (err) {
    console.error('상품 목록 조회 실패:', err);
    next(err);
  }
};

// 품목별 상품 조회 (주류 게시판)
exports.getDrinkTpye = async (req, res, next) => {
  const { drink_type } = req.params; 
  try {
    const results = await Products.findAll({where: { drink_type }});
    res.json(results); 
  } catch (err) {
    console.error('상품 목록 조회 실패:', err);
    next(err);
  }
};

// 품목별 상품 조회 (etc상품)
exports.getProductKind =  async (req, res, next) => {
    const { product_kind } = req.params;
    console.log('요청까지?')
    try {
      let whereCondition = {
        product_kind: {
          [Op.in]: ['wineglass', 'ontherock']  // 'wineglass' 또는 'ontherock'만 포함
        }
      };

    // product_kind가 'wineglass'일 경우, 'wineglass'에 해당하는 상품을 조회
    if (product_kind === 'wineglass') {
      whereCondition.product_kind = 'wineglass';
    } 
    // product_kind가 'ontherock'일 경우, 'ontherock'에 해당하는 상품을 조회
    else if (product_kind != 'wineglass') {
      whereCondition.product_kind = 'ontherock';
    } 
    const results = await Products.findAll({
      where: whereCondition
    });

    console.log('필터링된 결과:', results); 
    res.json(results); 

  } catch (err) {
    console.error('상품 목록 조회 실패:', err);
    next(err);
  }
  };

  exports.searchProducts = async (req, res, next) => {
    console.log('검색 쿼리 파라미터:', req.query);
    const { product_name, product_description, drink_type, product_kind } = req.query;

    // 필터링 조건 설정
    const searchConditions = {};

    if (product_name) {
        searchConditions.product_name = {
            [Op.like]: `%${product_name}%`,  // LIKE 쿼리로 이름 검색
        };
    }

    if (product_description) {
        searchConditions.product_description = {
            [Op.like]: `%${product_description}%`,  // LIKE 쿼리로 설명 검색
        };
    }

    if (drink_type) {
        searchConditions.drink_type = {
            [Op.like]: `%${drink_type}%`,  // LIKE 쿼리로 drink_type 검색
        };
    }

    // product_kind 필터링, 'wineglass' 또는 'ontherock'만 허용
    if (product_kind) {
        searchConditions.product_kind = product_kind;  // 정확히 일치하는 값만 검색
    }

    try {
        const results = await Products.findAll({
            where: searchConditions,
        });

        if (results.length === 0) {
            return res.status(404).json({ message: '검색 내용이 없습니다.' });
        }

        res.json(results);
    } catch (err) {
        console.error('상품 검색 실패:', err);
        next(err);
    }
};