const Router = require('koa-express-router')
const info = require('./info');
const { sendData } = require('../utils');
const contract = require('./contract')
const block = require('./block')
const tx = require('./transaction')


exports.default = function route (app) {
  const router = new Router({ prefix: '/api' })
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      err.status = err.statusCode || err.status || 500;
      ctx.body = err.message;
      sendData(ctx, err, 'ERROR', '发生异常', err.status)
    }
  });
  app.use(router.routes())
  router.use('/', info)
  router.use('/contract', contract)
  router.use('/block', block)
  router.use('/transaction', tx)

}