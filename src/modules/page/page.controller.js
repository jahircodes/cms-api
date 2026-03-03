/**
 * Page Controller
 * ---------------
 * Handles HTTP logic for page management endpoints.
 * Uses dependency injection for testability and decoupling.
 */

const { sendSuccess } = require('../../utils/response');

const buildPageController = ({ pageService }) => {
  const createPage = async (req, res, next) => {
    try {
      const data = { ...req.body, userId: req.user.sub };
      const result = await pageService.createPage(data);
      return sendSuccess(res, result, 'Page created');
    } catch (err) {
      next(err);
    }
  };

  const getPages = async (req, res, next) => {
    try {
      const result = await pageService.getPages();
      return sendSuccess(res, result, 'Pages retrieved');
    } catch (err) {
      next(err);
    }
  };

  const getPageById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await pageService.getPageById(+id);
      return sendSuccess(res, result, 'Page retrieved');
    } catch (err) {
      next(err);
    }
  };

  const updatePage = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const result = await pageService.updatePage(+id, data);
      return sendSuccess(res, result, 'Page updated');
    } catch (err) {
      next(err);
    }
  };

  const deletePage = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await pageService.deletePage(+id);
      return sendSuccess(res, result, 'Page deleted');
    } catch (err) {
      next(err);
    }
  };

  return {
    createPage,
    getPages,
    getPageById,
    updatePage,
    deletePage,
  };
};

module.exports = { buildPageController };
