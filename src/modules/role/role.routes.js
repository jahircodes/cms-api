/**
 * Role Router
 * -----------
 * Defines role management routes with validation middleware.
 * No business or database logic here.
 */

const { Router } = require('express');
const { validate, createRoleSchema, updateRoleSchema } = require('./role.validator');

const buildRoleRouter = ({ roleController }) => {
  const router = Router();

  router.post('/', validate(createRoleSchema), roleController.createRole);
  router.get('/', roleController.getRoles);
  router.get('/:id', roleController.getRoleById);
  router.put('/:id', validate(updateRoleSchema), roleController.updateRole);
  router.delete('/:id', roleController.deleteRole);

  return router;
};

module.exports = { buildRoleRouter };
