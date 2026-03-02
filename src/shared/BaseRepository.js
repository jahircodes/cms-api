const createBaseRepository = ({ prisma, model }) => {
  const delegate = prisma[model];

  // --- READ ---
  const findUnique = (where, options = {}) => delegate.findUnique({ where, ...options });
  const findById = (id, options = {}) => findUnique({ id }, options);
  const findFirst = (where = {}, options = {}) => delegate.findFirst({ where, ...options });
  const findMany = (where = {}, options = {}) => delegate.findMany({ where, ...options });

  // --- CREATE ---
  const create = (data, options = {}) => delegate.create({ data, ...options });
  const bulkCreate = (dataArray, options = {}) =>
    delegate.createMany({ data: dataArray, ...options });

  // --- UPDATE ---
  const update = (where, data, options = {}) => delegate.update({ where, data, ...options });
  const bulkUpdate = (where, data, options = {}) =>
    delegate.updateMany({ where, data, ...options });

  // --- DELETE ---
  const remove = (where, options = {}) => delegate.delete({ where, ...options });
  const bulkDelete = (where, options = {}) => delegate.deleteMany({ where, ...options });

  // --- UPSERT ---
  const upsert = (where, createData, updateData, options = {}) =>
    delegate.upsert({ where, create: createData, update: updateData, ...options });

  // --- AGGREGATION ---
  const count = (where = {}, options = {}) => delegate.count({ where, ...options });
  const aggregate = (args = {}) => delegate.aggregate(args);
  const groupBy = (args = {}) => delegate.groupBy(args);

  return {
    // READ
    findUnique,
    findById,
    findFirst,
    findMany,

    // CREATE
    create,
    bulkCreate,

    // UPDATE
    update,
    bulkUpdate,

    // DELETE
    delete: remove,
    bulkDelete,

    // UPSERT
    upsert,

    // AGGREGATION
    count,
    aggregate,
    groupBy,
  };
};

module.exports = { createBaseRepository };
