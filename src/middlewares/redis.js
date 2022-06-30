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
  getLikedRecipeByUser: (req, res, next) => {
    const { id } = req.params;
    redis.get(`getLikedRecipeUser:${id}`, (error, result) => {
      if (!error && result !== null) {
        const newResult = JSON.parse(result);
        return success(res, {
          code: 200,
          message: 'Success get list liked recipe user',
          data: newResult,
        });
      }
      return next();
    });
  },
  getSavedRecipeByUser: (req, res, next) => {
    const { id } = req.params;
    redis.get(`getSavedRecipeUser:${id}`, (error, result) => {
      if (!error && result !== null) {
        const newResult = JSON.parse(result);
        return success(res, {
          code: 200,
          message: 'Success get list saved recipe user',
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
    redis.keys('getLikedRecipeUser:*', (error, result) => {
      if (result.length > 0) {
        result.forEach((item) => {
          redis.del(item);
        });
      }
    });
    redis.keys('getSavedRecipeUser:*', (error, result) => {
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
  getCommentByRecipe: (req, res, next) => {
    const { id } = req.params;
    redis.get(`getRecipeComment:${id}`, (error, result) => {
      if (!error && result !== null) {
        const newResult = JSON.parse(result);
        return success(res, {
          code: 200,
          message: 'Success get list comment by recipe',
          data: newResult,
        });
      }
      return next();
    });
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
    redis.keys('getUserRecipe:*', (error, result) => {
      if (result.length > 0) {
        result.forEach((item) => {
          redis.del(item);
        });
      }
    });
    redis.keys('getLikedRecipeUser:*', (error, result) => {
      if (result.length > 0) {
        result.forEach((item) => {
          redis.del(item);
        });
      }
    });
    redis.keys('getSavedRecipeUser:*', (error, result) => {
      if (result.length > 0) {
        result.forEach((item) => {
          redis.del(item);
        });
      }
    });
    redis.keys('getRecipeComment:*', (error, result) => {
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
    redis.keys('getRecipeComment:*', (error, result) => {
      if (result.length > 0) {
        result.forEach((item) => {
          redis.del(item);
        });
      }
    });
    return next();
  },
  // ====================================== LIKED RECIPE ======================================
  getAllLikedRecipe: (req, res, next) => {
    redis.get(
      `getLikedRecipe:${JSON.stringify(req.query)}`,
      (error, result) => {
        if (!error && result !== null) {
          const newResult = JSON.parse(result);
          return success(res, {
            code: 200,
            message: 'Success get data liked recipe',
            data: newResult.result,
            pagination: newResult.pagination,
          });
        }
        return next();
      }
    );
  },
  getLikedRecipeById: (req, res, next) => {
    const { id } = req.params;
    redis.get(`getLikedRecipe:${id}`, (error, result) => {
      if (!error && result !== null) {
        const newResult = JSON.parse(result);
        return success(res, {
          code: 200,
          message: 'Success get detail liked recipe',
          data: newResult,
        });
      }
      return next();
    });
  },
  clearLikedRecipe: (req, res, next) => {
    redis.keys('getLikedRecipe:*', (error, result) => {
      if (result.length > 0) {
        result.forEach((item) => {
          redis.del(item);
        });
      }
    });
    redis.keys('getLikedRecipeUser:*', (error, result) => {
      if (result.length > 0) {
        result.forEach((item) => {
          redis.del(item);
        });
      }
    });
    return next();
  },
  // ====================================== SAVED REDIPE ======================================
  getAllSavedRecipe: (req, res, next) => {
    redis.get(
      `getSavedRecipe:${JSON.stringify(req.query)}`,
      (error, result) => {
        if (!error && result !== null) {
          const newResult = JSON.parse(result);
          return success(res, {
            code: 200,
            message: 'Success get data saved recipe',
            data: newResult.result,
            pagination: newResult.pagination,
          });
        }
        return next();
      }
    );
  },
  getSavedRecipeById: (req, res, next) => {
    const { id } = req.params;
    redis.get(`getSavedRecipe:${id}`, (error, result) => {
      if (!error && result !== null) {
        const newResult = JSON.parse(result);
        return success(res, {
          code: 200,
          message: 'Success get detail saved recipe',
          data: newResult,
        });
      }
      return next();
    });
  },
  clearSavedRecipe: (req, res, next) => {
    redis.keys('getSavedRecipe:*', (error, result) => {
      if (result.length > 0) {
        result.forEach((item) => {
          redis.del(item);
        });
      }
    });
    redis.keys('getSavedRecipeUser:*', (error, result) => {
      if (result.length > 0) {
        result.forEach((item) => {
          redis.del(item);
        });
      }
    });
    return next();
  },
};
