const _ = require('lodash');
function getTotalDistance(route) {
  return _.sum(
    route.legs.map(leg => {
      //meter
      return leg.distance.value;
    })
  );
}
function getTotalDuration(route) {
  return _.sum(
    route.legs.map(leg => {
      //second
      return leg.duration.value;
    })
  );
}
function getLegPointsPath(route) {
  return route.legs.map(leg => {
    //meter
    return [leg.end_location.lat, leg.end_location.lng];
  });
}

async function calculateShortestDistance(locations) {
  var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyCYud1SI_duEuDmwho3GqwJ96dlfzsvxDI',
    Promise,
  });
  var inOneHour = Math.round((new Date().getTime() + 60 * 60 * 1000) / 1000);

  let result = await googleMapsClient
    .directions({
      origin: locations[0],
      destination: locations[locations.length - 1],
      departure_time: inOneHour,
      mode: 'driving',
      waypoints: locations.slice(1, locations.length - 1),
      alternatives: true,
      traffic_model: 'best_guess',
      optimize: true,
    })
    .asPromise();

  if (result.json.status == 'ZERO_RESULTS') {
    throw new Error('ZERO_RESULTS');
  }
  let routeSummarys = result.json.routes.map(route => {
    return {
      total_distance: getTotalDistance(route),
      total_time: getTotalDuration(route),
      path: [[Number(locations[0][0]), Number(locations[0][1])]].concat(
        getLegPointsPath(route)
      ),
    };
  });
  let shortestDrivingDistanceRouteSummary = routeSummarys.sort(
    (routeSummaryA, routeSummaryB) =>
      routeSummaryA.total_distance - routeSummaryB.total_distance
  )[0];
  return shortestDrivingDistanceRouteSummary;
}
module.exports = {
  getTotalDuration,
  getTotalDistance,
  getLegPointsPath,
  calculateShortestDistance,
};
