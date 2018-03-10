const uuid = require('uuid/v1');

let googleMap = smartRequire('lib/geolocation/google');
module.exports = {
  show(ctx, next) {
    // try {
    //   //
    //   // //
    //
    //   let resource =  global.orm.route.findAll({
    //     include: [{ all: true }],
    //   });
    //
    //   ctx.body = resource[0];
    // } catch (err) {
    //   console.log('e', err);
    // }
    //Find url params in tommorow
    Project.findOne({ where: {title: 'aProject'} }).then(project => {
          where: {
            id: ctx.params.id,
          },

});

  },
  async create(ctx, next) {
    //
    // //
    let locations = ctx.request.body;
    let resource = await global.orm.Route.create({
      id: uuid(),
      locations: locations,
      calculationStatus: 'in progress',
    });
    resource.calculationResult = await googleMap.calculateShortestDistance(
      locations
    );
    resource.calculationStatus = 'success';
    await resource.save();
    ctx.body = { token: resource.id };
  },
};
