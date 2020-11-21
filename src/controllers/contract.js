const { async } = require("rxjs");
const { deploy } = require("../services/api");
const { sendData } = require("../utils");


module.exports = {
  deploy: async (ctx, next) => {
    const { contract, parameters } = ctx.request.body;
    let res = await deploy(contract, parameters)

    return sendData(ctx, res, 'OK', '部署成功', 200)
  }
}