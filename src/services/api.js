const {
  Web3jService, Configuration, ConsensusService,
  SystemConfigService,
  CompileService,
} = require('../packages/api/index')

const path = require('path');
const fs = require('fs');

const configFile = path.join(process.cwd(), 'src/packages/cli/conf/config.json');
const config = new Configuration(configFile);
const web3jService = new Web3jService(config);
const consensusService = new ConsensusService(config);
const systemConfigService = new SystemConfigService(config);
const compileService = new CompileService(config);


module.exports = {
  // 获取块高
  getBlockNumber: async () => {
    return web3jService.getBlockNumber();
  },
  // 获取观察者节点列表
  getObserverList: async () => {
    return web3jService.getObserverList();
  },
  // 获取共识节点列表
  getSealerList: async () => {
    return web3jService.getSealerList();
  },
  // 获取区块链节点共识标识
  getConsensusStatus: async () => {
    return web3jService.getConsensusStatus();
  },
  // 获取区块列节点同步状态
  getSyncStatus: async () => {
    return web3jService.getSyncStatus();
  },
  // 获取区块链版本信息
  getClientVersion: async () => {
    return web3jService.getPeers()
  },
  // 获取节点及其连接节点的列表
  getNodeIDList: async () => {
    return web3jService.getNodeIDList()
  },
  // 获取指定群组的共识节点和观察节点列表
  getGroupPeers: async () => {
    return web3jService.getGroupPeers()
  },
  // 获取节点所属群组的群组ID列表
  getGroupList: async () => {
    return web3jService.getGroupList()
  },

  // 获取根据区块哈希查询得到的区块信息
  getBlockByHash: async (hash, includeTransactions) => {
    return web3jService.getBlockByHash(hash, includeTransactions)
  },

  // 返回根据区块高度查询的区块信息
  getBlockByNumber: async (blockNumber, includeTransactions) => {
    return web3jService.getBlockByNumber(blockNumber, includeTransactions)
  },

  // 根据区块高度查询区块哈希
  getBlockHashByNumber: async (blockNumber) => {
    return web3jService.getBlockHashByNumber(blockNumber)
  },

  // 根据交易哈希查询交易信息
  getTransactionByHash: async (transactionHash) => {
    return web3jService.getTransactionByHash(transactionHash)
  },

  // 返回根据区块哈希和交易序号查询的交易信息
  getTransactionByBlockHashAndIndex: async (blockHash, transactionIndex) => {
    return web3jService.getTransactionByBlockHashAndIndex(blockHash, transactionIndex)
  },

  deploy: async (contrast, parameters) => {
    let contractName = contrast;

    if (!contractName.endsWith('.sol')) {
      contractName += '.sol';
    }

    let contractPath = path.join(web3jService.config.contractDir, contractName);
    console.log(contractPath)

    if (!fs.existsSync(contractPath)) {
      throw new Error(`${contractName} doesn't exist`);
    }
    let ContractsOutputDir = web3jService.config.contractOutputDir
    console.log(ContractsOutputDir)

    let contractClass = compileService.compile(contractPath);
    if (!fs.existsSync(ContractsOutputDir)) {
      fs.mkdirSync(ContractsOutputDir);
    }

    contractName = path.basename(contractName);
    contractName = contractName.substring(0, contractName.indexOf('.'));
    let abiPath = path.join(ContractsOutputDir, `${path.basename(contractName)}.abi`);
    let binPath = path.join(ContractsOutputDir, `${path.basename(contractName)}.bin`);
    console.log(abiPath)
    console.log(binPath)

    try {
      fs.writeFileSync(abiPath, JSON.stringify(contractClass.abi));
      fs.writeFileSync(binPath, contractClass.bin);
    } catch (error) { }
    return web3jService.deploy(contractClass.abi, contractClass.bin, parameters).then((result) => {
      if (result.status === '0x0') {
        let contractAddress = result.contractAddress;
        let addressPath = path.join(ContractsOutputDir, `.${path.basename(contractName, '.sol')}.address`);

        try {
          fs.appendFileSync(addressPath, contractAddress + '\n');
        } catch (error) { }

        return {
          status: result.status,
          contractAddress,
          transactionHash: result.transactionHash
        };
      }

      return {
        status: result.status,
        transactionHash: result.transactionHash
      };
    });
  }
}
