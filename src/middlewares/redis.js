const redis = require('../config/redis');
const { success } = require('../helpers/response');

module.exports = {
  // ====================================== USER ======================================
  getAllUser: (req, res, next) => {
    redis.get(`getUser:${JSON.stringify(req.query)}`, (error, result) => {
      if (!error && result !== null) {
        const newResult = JSON.parse(result);
        return success(res, {
          code: 200,
          message: 'Success get data user',
          data: newResult.result,
          pagination: newResult.pagination,
        });
      }
      return next();
    });
  },
  getUserById: (req, res, next) => {
    const { id } = req.params;
    redis.get(`getUser:${id}`, (error, result) => {
      if (!error && result !== null) {
        const newResult = JSON.parse(result);
        return success(res, {
          code: 200,
          message: 'Success get data user by id',
          data: newResult,
        });
      }
      return next();
    });
  },
  getRecipeByUser: (req, res, next) => {
    const { id } = req.params;
    redis.get(`getUserRecipe:${id}`, (error, result) => {
      if (!error && result !== null) {
        const newResult = JSON.parse(result);
        return success(res, {
          code: 200,
          message: 'Success get list recipe user',
          data: newResult,
        });
      }
      return next();
    });
  },
  clearUser: (req, res, next) => {
    redis.keys('getUser:*', (error, result) => {
      if (result.length > 0) {
        result.forEach((item) => {
          redis.del(item);
        });
      }
    });
    redis.keys('getUserRecipe:*', (error, result) => {
      if (result.length > 0) {
        result.forEach((item) => {
          redis.del(item);
        });
      }
    });
    return next();
  },
  // ====================================== RECIPE ======================================
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
  getRecipeActive: async (req, res, next) => {
    const result = await redis.get(
      `getRecipeActive:${JSON.stringify(req.query)}`
    );
    if (result) {
      const newResult = JSON.parse(result);
      return success(
        res,
        200,
        'success',
        `Success get recipe active`,
        newResult.rows
      );
    }
    return next();
  },
  clearRecipe: async (req, res, next) => {
    const result = await redis.keys('getRecipe:*');
    const result2 = await redis.keys('getRecipeByUser:*');

    if (result.length > 0) {
      result.map((e) => redis.del(e));
    }

    if (result2.length > 0) {
      result2.map((e) => redis.del(e));
    }

    return next();
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
