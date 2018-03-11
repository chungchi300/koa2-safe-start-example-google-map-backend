class CustomSequelizeError extends Error {
  constructor(message) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message);

    // Custom debugging information
    this.name = 'CustomSequelizeError';
    this.message = message;
  }
}
module.exports = {
  last: function() {
    return this.findOne({
      limit: 1,
      where: {
        //your where conditions, or without them if you need ANY entry
      },
      order: [['createdAt', 'DESC']],
    });
  },
  findOrFail: async function(id) {
    let result = await this.findOne({
      include: [{ all: true }],
      where: {
        id: id,
      },
    });

    if (result == null) {
      throw new CustomSequelizeError('Resource Not Found');
    } else {
      return result;
    }
  },
};
