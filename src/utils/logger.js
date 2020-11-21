const { timer } = require("rxjs");

const logger = async function (ctx, next) {
  let res = ctx.res;
  let url = ctx.url
  // // 拦截操作请求 request
  // console.log(`请求: ${ctx.method} ${ctx.url}`);

  await next();

  // 拦截操作响应 request
  res.on('finish', () => {
    console.log(`${ctx.response.body.time} \t ${ctx.method} ${url} \t ${ctx.response.status} \t ${ctx.response.body.msg}`);
  });
};

module.exports = logger