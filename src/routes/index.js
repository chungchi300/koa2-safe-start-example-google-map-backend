const Router = require('koa-router');
const indexCtrl = smartRequire('controllers/indexCtrl');

const router = Router();

router.get('/', indexCtrl);

module.exports = router;
