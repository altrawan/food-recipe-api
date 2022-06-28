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
  getAllRecipe: (req, res, next) => {
    redis.get(`getRecipe:${JSON.stringify(req.query)}`, (error, result) => {
      if (!error && result !== null) {
        const newResult = JSON.parse(result);
        return success(res, {
          code: 200,
          message: 'Success get data recipe',
          data: newResult.result,
          pagination: newResult.pagination,
        });
      }
      return next();
    });
  },
  getRecipeById: (req, res, next) => {
    const { id } = req.params;
    redis.get(`getRecipe:${id}`, (error, result) => {
      if (!error && result !== null) {
        const newResult = JSON.parse(result);
        return success(res, {
          code: 200,
          message: 'Success get detail recipe',
          data: newResult,
        });
      }
      return next();
    });
  },
  getLatestRecipe: (req, res, next) => {
    redis.get(
      `getLatestRecipe:${JSON.stringify(req.query)}`,
      (error, result) => {
        if (!error && result !== null) {
          const newResult = JSON.parse(result);
          return success(res, {
            code: 200,
            message: 'Success get latest recipe',
            data: newResult,
          });
        }
        return next();
      }
    );
  },
  clearRecipe: (req, res, next) => {
    redis.keys('getRecipe:*', (error, result) => {
      if (result.length > 0) {
        result.forEach((item) => {
          redis.del(item);
        });
      }
    });
    redis.keys('getLatestRecipe:*', (error, result) => {
      if (result.length > 0) {
        result.forEach((item) => {
          redis.del(item);
        });
      }
    });
    return next();
  },
  // ====================================== COMMENT ======================================
  getAllComment: (req, res, next) => {
    redis.get(`getComment:${JSON.stringify(req.query)}`, (error, result) => {
      if (!error && result !== null) {
        const newResult = JSON.parse(result);
        return success(res, {
          code: 200,
          message: 'Success get data comment',
          data: newResult.result,
          pagination: newResult.pagination,
        });
      }
      return next();
    });
  },
  getCommentById: async (req, res, next) => {
    const { id } = req.params;
    redis.get(`getComment:${id}`, (error, result) => {
      if (!error && result !== null) {
        const newResult = JSON.parse(result);
        return success(res, {
          code: 200,
          message: 'Success get detail comment',
          data: newResult,
        });
      }
      return next();
    });
  },
  clearComment: (req, res, next) => {
    redis.keys('getComment:*', (error, result) => {
      if (result.length > 0) {
        result.forEach((item) => {
          redis.del(item);
        });
      }
    });
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
