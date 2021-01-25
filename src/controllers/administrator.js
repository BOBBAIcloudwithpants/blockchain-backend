const { sendData } = require("../utils");
const { deploy, call, getAllContract } = require("../services/api");

module.exports = {
  /**
   *
   * @api {post} /administrator/regist 注册管理员
   * @apiName 管理员注册
   * @apiGroup Administrator
   * @apiParam {String} addr 管理员地址，一串哈希值，0x开头，总长度(包含0x)为42，例如(0x27a28f09ec7accce2eecc27ebcd9453226ed3e52)
   * @apiSuccess {String} msg 结果描述
   * @apiSuccess {Number} code 状态码
   * @apiSuccess {Object[]} data
   */
  // 注册管理员，提供一个哈希值，会同时部署合约
  register: async (ctx, next) => {
    const { addr } = ctx.request.body
    let res = await deploy('SupplyContract', [addr])
    return sendData(ctx, res, 'OK', '注册管理员成功', 200)
  },

  /**
   *
   * @api {get} /administrator 获取管理员信息
   * @apiName 获取管理员信息
   * @apiGroup Administrator
   * @apiSuccess {Object[]} data  管理员信息数组(实际只有全局唯一的管理员)
   * @apiSuccess {String} data.addr   地址
   * @apiSuccess {String} data.out_credit    管理员发放的信用点总和
   *
   */
  // 获取当前管理员信息
  getAdmins: async (ctx, next) => {

  },

  /**
   * 
   */
  // 发放信用点
  sendCreditPointToBank: async (ctx, next) => {

  },


}