/**
 * Post Scheduler
 * --------------
 * Handles automatic publishing of scheduled posts using cron jobs.
 * Runs every minute to check for posts ready to be published.
 */

const cron = require('node-cron');
const { logger } = require('../config/logger');

let schedulerInstance = null;

/**
 * Start the post publishing scheduler
 * @param {Object} postService - Post service instance with publishScheduledPosts method
 */
const startScheduler = ({ postService }) => {
  if (schedulerInstance) {
    logger.info('Scheduler already running');
    return;
  }

  // Run every minute: '* * * * *'
  schedulerInstance = cron.schedule('* * * * *', async () => {
    try {
      const result = await postService.publishScheduledPosts();

      if (result.count > 0) {
        logger.info(`Published ${result.count} scheduled post(s)`);
      }
    } catch (error) {
      logger.error('Error publishing scheduled posts:', error);
    }
  });

  logger.info('Post scheduler started - checking for scheduled posts every minute');
};

/**
 * Stop the post publishing scheduler
 */
const stopScheduler = () => {
  if (schedulerInstance) {
    schedulerInstance.stop();
    schedulerInstance = null;
    logger.info('Post scheduler stopped');
  }
};

module.exports = { startScheduler, stopScheduler };
