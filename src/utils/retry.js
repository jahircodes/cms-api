const retry = async (fn, { retries = 3, delayMs = 200, factor = 2 } = {}) => {
  let attempt = 0;
  let lastError;

  while (attempt <= retries) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt === retries) break;
      const wait = delayMs * Math.pow(factor, attempt);
      await new Promise((resolve) => setTimeout(resolve, wait));
      attempt += 1;
    }
  }

  throw lastError;
};

module.exports = { retry };
