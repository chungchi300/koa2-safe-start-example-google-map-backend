const uuid = require('uuid/v1');
module.exports = {
  show(ctx, next) {
    // try {
    //   //
    //   // //
    //
    //   let resource =  global.orm.route.findAll({
    //     include: [{ all: true }],
    //     where: {
    //       id: ctx.params.id,
    //     },
    //   });
    //
    //   ctx.body = resource[0];
    // } catch (err) {
    //   console.log('e', err);
    // }
  },
  async create(ctx, next) {
    //
    // //

    let resource = await global.orm.Route.create({
      id: uuid(),
      locations: ctx.request.body,
    });
    ctx.body = { token: resource.id };
  },
};
