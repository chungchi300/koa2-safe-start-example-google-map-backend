const Router = require('koa-router');
const indexCtrl = smartRequire('controllers/indexCtrl');
const routeCtrl = smartRequire('controllers/routeCtrl');

const router = Router();

router.get('/', indexCtrl);
router.post('/route', routeCtrl.create);
router.get('/route/:id', routeCtrl.show);

module.exports = router;
