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
function getPath(query) {
  let waypoints = query.waypoints.split('|');
  let waypointsArr = waypoints.map(waypoint => {
    return [waypoint.split(',')[0], waypoint.split(',')[1]];
  });

  return [
    [query.origin.split(',')[0], query.origin.split(',')[1]],
    ...waypointsArr,
    [query.destination.split(',')[0], query.destination.split(',')[1]],
  ];
}
function getShortestRoutes(routes, query) {
  let routeSummarys = routes.map(route => {
    return {
      total_distance: getTotalDistance(route),
      total_time: getTotalDuration(route),
      path: getPath(query),
    };
  });

  let shortestDrivingDistanceRouteSummary = routeSummarys.sort(
    (routeSummaryA, routeSummaryB) =>
      -(routeSummaryA.total_distance - routeSummaryB.total_distance)
  )[0];

  return shortestDrivingDistanceRouteSummary;
}
function permute(permutation) {
  var length = permutation.length,
    result = [permutation.slice()],
    c = new Array(length).fill(0),
    i = 1,
    k,
    p;

  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = permutation[i];
      permutation[i] = permutation[k];
      permutation[k] = p;
      ++c[i];
      i = 1;
      result.push(permutation.slice());
    } else {
      c[i] = 0;
      ++i;
    }
  }
  return result;
}

async function calculateShortestDistance(locations) {
  var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyCYud1SI_duEuDmwho3GqwJ96dlfzsvxDI',
    Promise,
  });
  var inOneHour = Math.round((new Date().getTime() + 60 * 60 * 1000) / 1000);
  let wayPointAndDestinationPermutation = permute(
    locations.slice(1, locations.length)
  );
  let results = await Promise.all(
    wayPointAndDestinationPermutation.map(wayPointAndDestinationPath =>
      googleMapsClient
        .directions({
          origin: locations[0],
          destination: _.last(wayPointAndDestinationPath),

          mode: 'driving',
          waypoints: wayPointAndDestinationPath.slice(
            0,
            wayPointAndDestinationPath.length - 1
          ),
          alternatives: true,
        })
        .asPromise()
    )
  );

  let routeSummarys = results.map(result => {
    //find every group shortest
    if (result.json.status == 'ZERO_RESULTS') {
      return {
        total_distance: -1,
        total_time: -1,
        path: [],
      };
    }
    return getShortestRoutes(result.json.routes, result.query);
  });

  //find every shortest on groups
  let shortestRouteSummary = routeSummarys.reduce(
    (shortestRouteSummary, routeSummary) => {
      if (shortestRouteSummary == 0) {
        return routeSummary;
      }
      if (routeSummary.total_distance < shortestRouteSummary.total_distance) {
        return routeSummary;
      }
      return shortestRouteSummary;
    },
    0
  );

  if (shortestRouteSummary.total_distance <= 0) {
    throw new Error('ZERO_RESULTS');
  }
  return shortestRouteSummary;
}
module.exports = {
  getTotalDuration,
  getTotalDistance,
  getShortestRoutes,
  getPath,
  calculateShortestDistance,
};
