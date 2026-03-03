/**
 * Page Router
 * -----------
 * Defines page management routes with validation middleware.
 * No business or database logic here.
 */

const { Router } = require('express');
const { validate, createPageSchema, updatePageSchema } = require('./page.validator');

const buildPageRouter = ({ pageController }) => {
  const router = Router();

  router.post('/', validate(createPageSchema), pageController.createPage);
  router.get('/', pageController.getPages);
  router.get('/:id', pageController.getPageById);
  router.put('/:id', validate(updatePageSchema), pageController.updatePage);
  router.delete('/:id', pageController.deletePage);

  return router;
};

module.exports = { buildPageRouter };
