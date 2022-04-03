const redis = require('../config/redis');
const { success } = require('../helpers/response');

module.exports = {
  // ====================================== HOMEPAGE ======================================
  getLatestRecipe: async (req, res, next) => {
    const result = await redis.get(
      `getLatestRecipe:${JSON.stringify(req.query)}`
    );
    if (result) {
      const newResult = JSON.parse(result);
      return success(
        res,
        200,
        'success',
        `Success get latest recipe`,
        newResult.rows
      );
    }
    return next();
  },
  // ====================================== USER ======================================
  getAllUsers: async (req, res, next) => {
    const result = await redis.get(`getUser:${JSON.stringify(req.query)}`);
    if (result) {
      const newResult = JSON.parse(result);
      return success(
        res,
        200,
        'success',
        'Success get all data users',
        newResult.result.rows,
        newResult.pageInfo
      );
    }
    return next();
  },
  getUserById: async (req, res, next) => {
    const { id } = req.params;
    const result = await redis.get(`getUser:${id}`);
    if (result) {
      const newResult = JSON.parse(result);
      return success(
        res,
        200,
        'success',
        `Success get user by id ${id}`,
        newResult.result.rows[0]
      );
    }
    return next();
  },
  clearUser: async (req, res, next) => {
    const result = await redis.keys('getUser:*');
    if (result.length > 0) {
      result.map((e) => redis.del(e));
    }
    next();
  },
  // ====================================== RECIPE ======================================
  getAllRecipes: async (req, res, next) => {
    const result = await redis.get(`getRecipe:${JSON.stringify(req.query)}`);
    if (result) {
      const newResult = JSON.parse(result);
      return success(
        res,
        200,
        'success',
        'Success get all data recipes',
        newResult.result.rows,
        newResult.pageInfo
      );
    }
    return next();
  },
  getRecipeById: async (req, res, next) => {
    const { id } = req.params;
    const result = await redis.get(`getRecipe:${id}`);
    if (result) {
      const newResult = JSON.parse(result);
      return success(
        res,
        200,
        'success',
        `Success get recipe by id ${id}`,
        newResult.result.rows[0]
      );
    }
    return next();
  },
  getRecipeByUser: async (req, res, next) => {
    const { id } = req.params;
    const result = await redis.get(`getRecipeByUser:${id}`);
    if (result) {
      const newResult = JSON.parse(result);
      return success(
        res,
        200,
        'success',
        `Success get recipe by user id ${id}`
      );
    }
    return next();
  },
  clearRecipe: async (req, res, next) => {
    const result = await redis.keys('getRecipe:*');
    const result2 = await redis.keys('getRecipeByUser:*')

    if (result.length > 0) {
      result.map((e) => redis.del(e));
    }

    if (result2.length > 0) {
      result2.map((e) => redis.del(e));
    }
    
    next();
  },
  // ====================================== COMMENT ======================================
  getAllComments: async (req, res, next) => {
    const result = await redis.get(`getComment:${JSON.stringify(req.query)}`);
    if (result) {
      const newResult = JSON.parse(result);
      return success(
        res,
        200,
        'success',
        'Success get all data comments',
        newResult.result.rows,
        newResult.pageInfo
      );
    }
    return next();
  },
  getCommentById: async (req, res, next) => {
    const { id } = req.params;
    const result = await redis.get(`getComment:${id}`);
    if (result) {
      const newResult = JSON.parse(result);
      return success(
        res,
        200,
        'success',
        `Success get comment by id ${id}`,
        newResult.rows[0]
      );
    }
    return next();
  },
  getCommentByRecipe: async (req, res, next) => {
    const { id } = req.params;
    const result = await redis.get(`getCommentByRecipe:${id}`);
    if (result) {
      const newResult = JSON.parse(result);
      return success(
        res,
        200,
        'success',
        `Success get liked recipe by id ${id}`,
        newResult.rows[0]
      );
    }
    return next();
  },
  clearComment: async (req, res, next) => {
    const result = await redis.keys('getComment:*');
    const result2 = await redis.keys('getCommentByRecipe:*');

    if (result.length > 0) {
      result.map((e) => redis.del(e));
    }

    if (result2.length > 0) {
      result2.map((e) => redis.del(e));
    }
    return next();
  },
  // ====================================== LIKED RECIPE ======================================
  getAllLikedRecipe: async (req, res, next) => {
    const result = await redis.get(
      `getLikedRecipe:${JSON.stringify(req.query)}`
    );
    if (result) {
      const newResult = JSON.parse(result);
      return success(
        res,
        200,
        'success',
        'Success get all data liked recipes',
        newResult.result.rows,
        newResult.pageInfo
      );
    }
    return next();
  },
  getLikedRecipeById: async (req, res, next) => {
    const { id } = req.params;
    const result = await redis.get(`getLikedRecipe:${id}`);
    if (result) {
      const newResult = JSON.parse(result);
      return success(
        res,
        200,
        'success',
        `Success get liked recipe by id ${id}`,
        newResult.result.rows[0]
      );
    }
    return next();
  },
  getLikedRecipeByUser: async (req, res, next) => {
    const { id } = req.params;
    const result = await redis.get(`getLikedRecipeByUser:${id}`);
    if (result) {
      const newResult = JSON.parse(result);
      return success(
        res,
        200,
        'success',
        `Success get liked recipe by user id ${id}`,
        newResult.result.rows[0]
      );
    }
    return next();
  },
  clearLikedRecipe: async (req, res, next) => {
    const result = await redis.keys('getLikedRecipe:*');
    const result2 = await redis.keys('getLikedRecipeByUser:*');
    if (result.length > 0) {
      result.map((e) => redis.del(e));
    }

    if (result2.length > 0) {
      result2.map((e) => redis.del(e));
    }
    return next();
  },
  // ====================================== SAVED REDIPE ======================================
  getAllSavedRecipe: async (req, res, next) => {
    const result = await redis.get(
      `getSavedRecipe:${JSON.stringify(req.query)}`
    );
    if (result) {
      const newResult = JSON.parse(result);
      return success(
        res,
        200,
        'success',
        'Success get all data saved recipes',
        newResult.result.rows,
        newResult.pageInfo
      );
    }
    return next();
  },
  getSavedRecipeById: async (req, res, next) => {
    const { id } = req.params;
    const result = await redis.get(`getSavedRecipe:${id}`);
    if (result) {
      const newResult = JSON.parse(result);
      return success(
        res,
        200,
        'success',
        `Success get saved recipe by id ${id}`,
        newResult.rows[0]
      );
    }
    return next();
  },
  getSavedRecipeByUser: async (req, res, next) => {
    const { id } = req.params;
    const result = await redis.get(`getSavedRecipeByUser:${id}`);
    if (result) {
      const newResult = JSON.parse(result);
      return success(
        res,
        200,
        'success',
        `Success get saved recipe by user id ${id}`,
        newResult.result.rows[0]
      );
    }
    return next();
  },
  clearSavedRecipe: async (req, res, next) => {
    const result = await redis.keys('getSavedRecipe:*');
    const result2 = await redis.keys('getSavedRecipeByUser:*');
    if (result.length > 0) {
      result.map((e) => redis.del(e));
    }

    if (result2.length > 0) {
      result2.map((e) => redis.del(e));
    }
    return next();
  },
};
