/**
 * Page Router
 * -----------
 * Defines page management routes with validation middleware.
 * No business or database logic here.
 */

const { Router } = require('express');
const {
  validate,
  validateQuery,
  createPageSchema,
  updatePageSchema,
  searchQuerySchema,
} = require('./page.validator');

const buildPageRouter = ({ pageController }) => {
  const router = Router();

  router.get('/search', validateQuery(searchQuerySchema), pageController.searchPages);
  router.post('/', validate(createPageSchema), pageController.createPage);
  router.get('/', pageController.getPages);
  router.get('/:id', pageController.getPageById);
  router.put('/:id', validate(updatePageSchema), pageController.updatePage);
  router.delete('/:id', pageController.deletePage);

  return router;
};

module.exports = { buildPageRouter };
