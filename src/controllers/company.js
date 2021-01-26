const { sendData } = require("../utils");
const { call } = require("../services/api");
const AccountServ = require("../services/account")


module.exports = {
  /**
   * @api {post} /companies 注册普通企业
   * @apiName 企业注册(当前用户必须是监管机构)
   * @apiGroup Company
   * @apiParam {String} company_address
   * @apiParam {String} company_name
   * @apiSuccess {String} msg 结果描述
   * @apiSuccess {Number} code 状态码 200是成功，403是无权限
   * @apiSuccess {Object[]} data 数据
   */
  createCompany: async (ctx, next) => {
    const type = ctx.cookies.get('type')
    const { company_address, company_name } = ctx.request.body
    if (type != "certifier") {
      sendData(ctx, {}, 'UNAUTHORIZED', '您没有监管机构权限', 403)
    }
    const res = await call({
      // TODO: finish the storage of contract
      contractAddress: AccountServ.getContractAddress(),
      contractName: AccountServ.getContractName(),
      function: "registerCompany",
      parameters: [company_address, company_name]
    })
    sendData(ctx, res, 'OK', "注册企业成功", 200)
  },

  /**
   * @api {patch} /companies 注册核心企业
   * @apiName 普通企业提升为核心企业
   * @apiGroup Company
   * @apiParam {String} company_address
   * @apiParam {String} company_name
   * @apiSuccess {String} msg 结果描述
   * @apiSuccess {Number} code 状态码 200是成功，403是无权限
   * @apiSuccess {Object[]} data 数据
   */
  registerCoreCompany: async (ctx, next) => {
    const type = ctx.cookies.get('type')
    const { company_address, company_name } = ctx.request.body
    if (type != "certifier") {
      sendData(ctx, {}, 'UNAUTHORIZED', '您没有监管机构权限', 403)
    }
    const res = await call({
      // TODO: finish the storage of contract
      contractAddress: AccountServ.getContractAddress(),
      contractName: AccountServ.getContractName(),
      function: "registerCoreCompany",
      parameters: [company_address, company_name]
    })
    sendData(ctx, res, 'OK', "注册企业成功", 200)
  },

  /**
   * @api {get} /companies/core 获取全部核心企业
   * @apiGroup Company
   * @apiSuccess {Object[]} data  核心企业数组
   * @apiSuccess {String} data.addr   企业地址
   * @apiSuccess {String} data.name   企业名称
   * @apiSuccess {Number} data.cType  企业类型
   * @apiSuccess {Number} data.inCredit   该企业分配得到的信用点
   * @apiSuccess {Number} data.outCredit  该企业发放的信用点
   * @apiSuccess {Number} code 状态码
   * @apiSuccess {Object[]} data 数据
   */
  getAllCoreCompanies: async (ctx, next) => {

  }

}