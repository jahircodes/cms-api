/**
 * Express Application
 * -------------------
 * Main application setup with dependency injection.
 * Configures middleware, routes, and error handling.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const pinoHttp = require('pino-http');
const { rateLimiter } = require('./middlewares/rateLimit.middleware');
const { errorHandler } = require('./middlewares/error.middleware');
const { authMiddleware } = require('./middlewares/auth.middleware');
const { requestIdMiddleware } = require('./middlewares/requestId.middleware');
const { getPrismaClient } = require('./database/prismaClient');
const { ApiError } = require('./shared/ApiError');
const { logger } = require('./config/logger');
const { sendSuccess } = require('./utils/response');

const { createAuthRepository } = require('./modules/auth/auth.repository');
const { createAuthService } = require('./modules/auth/auth.service');
const { buildAuthController } = require('./modules/auth/auth.controller');
const { buildAuthRouter } = require('./modules/auth/auth.routes');
const { createUserRepository } = require('./modules/user/user.repository');
const { createUserService } = require('./modules/user/user.service');
const { buildUserController } = require('./modules/user/user.controller');
const { buildUserRouter } = require('./modules/user/user.routes');
const { createCategoryRepository } = require('./modules/category/category.repository');
const { createCategoryService } = require('./modules/category/category.service');
const { buildCategoryController } = require('./modules/category/category.controller');
const { buildCategoryRouter } = require('./modules/category/category.routes');

const app = express();

const prisma = getPrismaClient();
const authRepository = createAuthRepository({ prisma });
const authService = createAuthService({ authRepository });
const authController = buildAuthController({ authService });
const authRoutes = buildAuthRouter({ authController });
const userRepository = createUserRepository({ prisma });
const userService = createUserService({ userRepository });
const userController = buildUserController({ userService });
const userRoutes = buildUserRouter({ userController });
const categoryRepository = createCategoryRepository({ prisma });
const categoryService = createCategoryService({ categoryRepository });
const categoryController = buildCategoryController({ categoryService });
const categoryRoutes = buildCategoryRouter({ categoryController });

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  pinoHttp({
    logger,
    customLogLevel: (req, res, err) => {
      if (err || res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
    customSuccessMessage: (req, res, responseTime) =>
      `${req.method} ${req.url} ${res.statusCode} - ${responseTime}ms`,
    customErrorMessage: (req, res, err, responseTime) =>
      `${req.method} ${req.url} ${res.statusCode} - ${err?.message ?? 'Error'} - ${responseTime}ms`,
    serializers: {
      req: () => undefined,
      res: () => undefined,
      err: (err) => ({ message: err.message, statusCode: err.statusCode }),
    },
  })
);
app.use(requestIdMiddleware);

app.use(rateLimiter);

app.get('/api', (req, res) => {
  sendSuccess(res, { status: 'ok' }, 'Welcome to the API');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/categories', authMiddleware, categoryRoutes);

app.use((req, res, next) => {
  next(new ApiError('Route not found', 404));
});

app.use(errorHandler());

module.exports = { app };
