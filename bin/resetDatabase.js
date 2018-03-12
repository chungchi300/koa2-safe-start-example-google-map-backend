var path = require('path');
require('../src/smartRequire');
async function reloadDatabase() {
  const shelljs = require('shelljs');
  let resetPath = `${global.config.database.extra.dialect}://${global.config
    .database.connection.username}:${global.config.database.connection
    .password}@${global.config.database.extra.host}/${global.config.database
    .connection.database}`;

  shelljs.exec(`node_modules/.bin/sequelize db:drop  --url '${resetPath}'`);

  shelljs.exec(`node_modules/.bin/sequelize db:create  --url '${resetPath}'`);

  await global.sequelize.sync({ force: true });

  await global.orm.Feedback.create({
    content: 'safe start koa2 is easy to use',
  });
  await global.orm.Feedback.create({
    content: 'safe start koa2 help me finish my work eariler',
  });
  process.exit(0);
}
try {
  console.log('dirname', __dirname);
  global.srcRoot = __dirname.replace('bin', 'src');
  // var config = require(path.join(__dirname, '../src/config/default.js'));

  //
  global.config = require(global.srcRoot + '/config');

  //
  require(path.join(__dirname, '../src/init/sequelize.js'));
  reloadDatabase().then(res => console.log('reload done'));
} catch (err) {
  throw new Error(err.message);
  process.exit(1);
}
