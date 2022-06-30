const userModel = require('../models/user.model');
const recipeModel = require('../models/recipe.model');
const commentModel = require('../models/comment.model');
const likedRecipeModel = require('../models/likedRecipe.model');
const savedRecipeModel = require('../models/savedRecipe.model');
const { failed } = require('../helpers/response');

module.exports = {
  isVerified: async (req, res, next) => {
    try {
      const user = await userModel.findBy('email', req.body.email);

      if (!user.rowCount) {
        next();
      } else if (user.rows[0].is_verified) {
        next();
      } else {
        failed(res, {
          code: 401,
          message: 'Your email is not verified yet',
          error: 'Unauthorized',
        });
      }
    } catch (error) {
      failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  isAdmin: (req, res, next) => {
    try {
      if (req.APP_DATA.tokenDecoded.level === 0) {
        next();
      } else {
        failed(res, {
          code: 403,
          message: "You don't have permission!",
          error: 'Forbidden',
        });
      }
    } catch (error) {
      failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  isUser: (req, res, next) => {
    try {
      if (req.APP_DATA.tokenDecoded.level === 1) {
        next();
      } else {
        failed(res, {
          code: 403,
          message: "You don't have permission!",
          error: 'Forbidden',
        });
      }
    } catch (error) {
      failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  mySelf: async (req, res, next) => {
    try {
      const idUser = req.APP_DATA.tokenDecoded.id;
      const idUpdate = req.params.id;

      if (idUser === idUpdate) {
        next();
      } else {
        failed(res, {
          code: 403,
          message: "You don't have permission!",
          error: 'Forbidden',
        });
      }
    } catch (error) {
      failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  recipeOwner: async (req, res, next) => {
    try {
      const idUser = req.APP_DATA.tokenDecoded.id;
      const recipe = await recipeModel.getRecipeById(req.params.id);

      if (!recipe.rowCount) {
        next();
      } else {
        if (idUser === recipe.rows[0].user_id) {
          next();
        } else {
          failed(res, {
            code: 403,
            message: "You don't have permission!",
            error: 'Forbidden',
          });
        }
      }
    } catch (error) {
      failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  commentOwner: async (req, res, next) => {
    try {
      const idUser = req.APP_DATA.tokenDecoded.id;
      const comment = await commentModel.getCommentById(req.params.id);
      
      if (!comment.rowCount) {
        next();
      } else {
        if (idUser === comment.rows[0].user_id) {
          next();
        } else {
          failed(res, {
            code: 403,
            message: "You don't have permission!",
            error: 'Forbidden',
          });
        }
      }
    } catch (error) {
      failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  likedRecipeOwner: async (req, res, next) => {
    try {
      const idUser = req.APP_DATA.tokenDecoded.id;
      const liked = await likedRecipeModel.findBy(
        'liked_recipes.id',
        req.params.id
      );

      if (!liked.rowCount) {
        next();
      } else {
        if (idUser === liked.rows[0].user_id) {
          next();
        } else {
          failed(res, {
            code: 403,
            message: "You don't have permission!",
            error: 'Forbidden',
          });
        }
      }
    } catch (error) {
      failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
  savedRecipeOwner: async (req, res, next) => {
    try {
      const idUser = req.APP_DATA.tokenDecoded.id;
      const saved = await savedRecipeModel.getSavedRecipeById(req.params.id);

      if (!saved.rowCount) {
        next();
      } else {
        if (idUser === saved.rows[0].user_id) {
          next();
        } else {
          failed(res, {
            code: 403,
            message: "You don't have permission!",
            error: 'Forbidden',
          });
        }
      }
    } catch (error) {
      failed(res, {
        code: 500,
        message: error.message,
        error: 'Internal Server Error',
      });
    }
  },
};
