const uuid = require('uuid/v1');

let googleMap = smartRequire('lib/geolocation/google');
async function calculateShortestDistance(resource, locations) {
  try {
    resource.calculationResult = await googleMap.calculateShortestDistance(
      locations
    );
    resource.calculationStatus = 'success';
  } catch (err) {
    resource.calculationResult = { message: err.message };
    resource.calculationStatus = 'failure';
  }

  return await resource.save();
}
function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

module.exports = {
  async show(ctx, next) {
    // try {
    //   //
    //   // //
    //

    //   ctx.body = resource[0];
    // } catch (err) {
    //   console.log('e', err);
    // }
    //Find url params in tommorow
    /*
    */
    let result = await global.orm.Route.findOrFail(ctx.params.id);
    switch (result.calculationStatus) {
      case 'success':
        ctx.body = {
          status: result.calculationStatus,
          path: result.calculationResult.path,
          total_distance: result.calculationResult.total_distance,
          total_time: result.calculationResult.total_time,
        };
        break;
      case 'in progress':
        ctx.body = {
          status: result.calculationStatus,
        };
        break;
      case 'failure':
        ctx.body = {
          status: result.calculationStatus,
          error: result.calculationResult.message,
        };
        break;
    }
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
    sleep(3000).then(() => {
      return calculateShortestDistance(resource, locations);
    });

    ctx.body = { token: resource.id };
  },
};
