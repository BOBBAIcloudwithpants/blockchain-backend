const { sendData } = require("../utils");
const { init } = require('../services/init')
const { getAllAccounts } = require("../services/account");
const { async } = require("rxjs");

module.exports = {
  // getAccounts: async (ctx, next) => {
  //   const res = await getAllAccounts();
  //   return sendData(ctx, res, 'OK', '获取全部账户成功', 200);
  // },
  // register: async (ctx, next) => {
  //   const { contractName, contractAddress } = ctx.request.body
  //   await init(contractName, contractAddress);
  //   return sendData(ctx, {}, 'OK', '注册成功', 200);
  // },


  /**
   *
   * @api {post} /accounts/login 登录
   * @apiName 登录
   * @apiGroup Account
   * @apiParam {String} addr 地址，一串哈希值，0x开头，总长度(包含0x)为42，例如(0x27a28f09ec7accce2eecc27ebcd9453226ed3e52)
   * @apiParam {String} type 类型，(bank/administrator/core_company/company/certifier)
   * @apiSuccess {String} msg 结果描述
   * @apiSuccess {Number} code 状态码
   * @apiSuccess {Object[]} data
   */
  login: async (ctx, next) => {
    const { addr, type } = ctx.request.body
    ctx.cookies.set('addr', addr, { expires: new Date('2022-02-15') })
    ctx.cookies.set('type', type, { expires: new Date('2022-02-15') })
    return sendData(ctx, {}, 'OK', '登录成功', 200)
  },

  /**
   * @api {get} /accounts 获取当前用户的信息
   * @apiGroup Account
   * @apiSuccess {String} msg 结果描述
   * @apiSuccess {Number} code 状态码
   * @apiSuccess {Object[]} data
   * @apiSuccess {String} data.addr 当前用户地址
   * @apiSuccess {String} data.name 当前用户的名字
   * @apiSuccess {String} data.type 当前用户的用户类型(administrator/certifier/bank/company/core_company)
   * @apiSuccess {Number} data.inCredit 获得的尚未返还的信用凭证总量(certifier和admin没有这个属性)
   * @apiSuccess {Number} data.outCredit 签发的尚未收回的信用凭证总量(certifier和admin没有这个属性)
   *  
   */
  getAccountInfo: async (ctx, next) => {

  }
}