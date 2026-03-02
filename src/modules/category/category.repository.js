const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  async create(data) {
    return prisma.category.create({ data });
  },
  async findMany() {
    return prisma.category.findMany();
  },
  async findUnique(where) {
    return prisma.category.findUnique({ where });
  },
  async update(id, data) {
    return prisma.category.update({ where: { id }, data });
  },
  async delete(id) {
    return prisma.category.delete({ where: { id } });
  },
};
