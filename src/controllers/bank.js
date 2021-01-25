const { sendData } = require("../utils");
const { async } = require("rxjs");
const { Addr } = require("../packages/api/common/typeCheck");
const { AddressZero } = require("ethers/constants");
const { call } = require("../services/api");

module.exports = {
  /**
     * @api {post} /banks 注册银行
     * @apiName 银行注册(当前用户必须是管理员)
     * @apiGroup Bank 
     * @apiParam {String} addr 银行地址，一串哈希值，0x开头，总长度(包含0x)为42，例如(0x27a28f09ec7accce2eecc27ebcd9453226ed3e52)
     * @apiParam {String} name 银行名称
     * @apiSuccess {String} msg 结果描述
     * @apiSuccess {Number} code 状态码 200是成功，403是无权限
     * @apiSuccess {Object[]} data 数据
     */
  createBank: async (ctx, next) => {
    const address = ctx.cookies.get('address')
    const type = ctx.cookies.get('type')
    const { addr, name } = ctx.request.body
    if (type != "administrator") {
      sendData(ctx, {}, 'UNAUTHORIZED', '您没有管理员权限', 403)
    }
    // const res = await call({
    //   // TODO: finish the storage of contract
    //   contractAddress: "",
    //   contractName: "",
    //   function: "registerBank",
    //   parameters: [addr, name]
    // })
    sendData(ctx, {}, 'OK', "注册银行成功", 200)
  },
}