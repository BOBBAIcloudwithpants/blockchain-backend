const { getTransactionByHash, getTransactionByBlockHashAndIndex } = require('../services/api')
const { sendData } = require('../utils/index')

module.exports = {
  getTransactionByHash: async (ctx, next) => {
    const { transactionHash } = ctx.request.query
    const res = await getTransactionByHash(transactionHash)
    return sendData(ctx, res, 'OK', '根据交易哈希查询交易信息', 200)
  },
  getTransactionByBlockHashAndIndex: async (ctx, next) => {
    const { blockHash, transactionIndex } = ctx.request.query
    const res = await getTransactionByBlockHashAndIndex(blockHash, transactionIndex)
    return sendData(ctx, res, 'OK', '根据区块哈希和交易序号查询的交易信息', 200)
  }
}