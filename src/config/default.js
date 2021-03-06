/**
 * Created at 16/4/11.
 * @Author Ling.
 * @Email i@zeroling.com
 */

module.exports = {
  database: {
    // port: 3000,
    connection: {
      database: 'lalamove',
      username: 'lalamove',
      password: 'lalamove',
    },
    extra: {
      host: process.env.dbhost,
      port: process.env.dbport,
      //default sqlite but suggest mysql in production
      dialect: 'mysql',
      pool: {
        max: 150,
        min: 20,
        acquire: 300000000,
        idle: 0,
      },
      storage: global.srcRoot + '/../database.sqlite',
      define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: true,
      },
    },
  },
  mail: {
    sparkpost: {
      api: 'sparpost api',
      options: {
        sandbox: false,
      },
    },
    from: 'sender email name',
  },
};
