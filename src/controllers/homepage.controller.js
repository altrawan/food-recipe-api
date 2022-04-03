const homepageModel = require('../models/homepage.model');
const { success, failed } = require('../helpers/response');
const redis = require('../config/redis');

module.exports = {
  getLatestRecipe: async (req, res) => {
    try {
      let { limit } = req.query;
      limit = Number(limit) || 5;

      const result = await homepageModel.getLatestRecipe(limit);

      redis.setEx(
        `getLatestRecipe:${JSON.stringify(req.query)}`,
        3600,
        JSON.stringify(result)
      );

      return success(
        res,
        200,
        'success',
        `Success get latest recipe`,
        result.rows
      );
    } catch (error) {
      return failed(res, 400, 'failed', `Bad Request : ${error.message}`);
    }
  },
  getPopularRecipe: async (req, res) => {
    
  },
};
