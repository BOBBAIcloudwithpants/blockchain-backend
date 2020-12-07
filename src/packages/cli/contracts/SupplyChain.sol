pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

contract SupplyChain {
    /** struct defination **/
    struct Company {
        // 公司名
        string name;
        // 公司地址，哈希值(在后端通过 get_account.sh 生成)
        address _addr;
    }

    struct Bank {
        // 银行名
        string name;
        // 银行地址，哈希值
        address _addr;
    }

    // 一笔应收账款单
    struct Bill {
        // 账单id
        uint256 bill_id;
        // 申请借钱的公司
        address borrow_company;
        // 借出钱的公司
        address lend_company;
        // 应收金额
        uint256 money;
        // 借款日期
        uint256 start_date;
        // 还款日期
        uint256 end_date;
        // 是否通过审核
        bool is_pass;
        // 是否还款
        bool is_finish;
        // 是否是核心企业的账单
        bool is_from_upstream;
        // 收款公司的信用评级变动
        uint256 credit_growth;
    }

    // 一笔向银行的融资
    struct Loan {
        // 融资账单id
        uint256 loan_id;
        // 申请融资的公司
        address request_company;
        // 银行地址
        address bank_address;
        // 发起日期
        uint256 start_date;
        // 是否通过审核
        bool is_pass;
        // 是否还款
        bool is_finish;
        // 融资金额
        uint256 money;
    }

    // 由公司地址到公司资产的映射
    mapping(address => uint256) assets;

    // 由公司地址到公司信用评级的映射
    mapping(address => uint256) credit_level;

    // 由公司地址到公司级别的映射, 表明该公司是否是核心企业
    mapping(address => bool) is_upstream;

    /** ----------------- **/

    /** global variables defination **/

    // 全部银行的集合
    Bank[] banks;

    // 全部公司的集合
    Company[] companies;

    // 所有账单的集合
    Bill[] bills;
    uint256 bill_id;

    // 所有融资的合集
    Loan[] loans;
    uint256 loan_id;

    /** ----------------- **/

    constructor() public {
        bill_id = 1;
        loan_id = 1;
    }

    /** methods defination **/
    // 根据银行地址获取银行的信息
    function getBank(address bankAddress) public view returns (Bank memory) {
        Bank memory bank;

        for (uint256 i = 0; i < banks.length; i++) {
            if (bankAddress == banks[i]._addr) {
                Bank storage temp = banks[i];
                bank = temp;
                break;
            }
        }
        return bank;
    }

    // 根据公司地址获取公司信息
    function getCompany(address companyAddress)
        public
        view
        returns (Company memory)
    {
        Company memory comp;
        for (uint256 i = 0; i < companies.length; i++) {
            if (companyAddress == companies[i]._addr) {
                Company storage temp = companies[i];
                comp = temp;
                break;
            }
        }
        return comp;
    }

    // 注册一家银行
    function registerBank(address bankAddress, string name)
        public
        returns (bool success)
    {
        banks.push(Bank(name, bankAddress));
        return true;
    }

    // 注册一家公司
    function registerCompany(address companyAddress, string name)
        public
        returns (bool success)
    {
        companies.push(Company(name, companyAddress));
        return true;
    }

    // 获取所有银行
    function getAllBanks() public view returns (Bank[] memory) {
        Bank[] memory ret = new Bank[](banks.length);
        for (uint256 i = 0; i < companies.length; i++) {
            Bank storage temp = banks[i];
            ret[i] = temp;
        }
        return ret;
    }

    // 获取所有公司
    function getAllCompanies() public view returns (Company[] memory) {
        Company[] memory ret = new Company[](companies.length);
        for (uint256 i = 0; i < companies.length; i++) {
            Company storage temp = companies[i];
            ret[i] = temp;
        }
        return ret;
    }

    // 获取所有的融资
    function getAllLoans() public view returns (Loan[] memory) {
        Loan[] memory ret = new Loan[](loans.length);
        for (uint256 i = 0; i < loans.length; i++) {
            Loan storage temp = loans[i];
            ret[i] = temp;
        }
        return ret;
    }

    function getAllBills() public view returns (Bill[] memory) {
        Bill[] memory ret = new Bill[](bills.length);
        for (uint256 i = 0; i < bills.length; i++) {
            Bill storage temp = bills[i];
            ret[i] = temp;
        }
        return ret;
    }

    // 根据地址获取某个公司所有的作为lend_company的账单
    function getLendBillsByCompanyAddress(address companyAddress)
        public
        view
        returns (Bill[] memory)
    {
        uint256 len = bills.length;
        Bill[] memory ret = new Bill[](len);
        uint256 k = 0;
        for (uint256 i = 0; i < len; i++) {
            if (companyAddress == bills[i].lend_company) {
                ret[k++] = bills[i];
            }
        }
        return ret;
    }

    // 根据地址获取某个公司所有的作为borrow_company的账单
    function getBorrowBillsByComanyAddress(address companyAddress)
        public
        view
        returns (Bill[] memory)
    {
        uint256 len = bills.length;
        Bill[] memory ret = new Bill[](len);
        uint256 k = 0;
        for (uint256 i = 0; i < len; i++) {
            if (companyAddress == bills[i].borrow_company) {
                ret[k++] = bills[i];
            }
        }
        return ret;
    }

    // 根据地址获取某个公司的所有融资
    function getLoansByCompanyAddress(address companyAddress)
        public
        view
        returns (Loan[] memory)
    {
        uint256 len = loans.length;
        Loan[] memory ret = new Loan[](len);
        uint256 k = 0;
        for (uint256 i = 0; i < len; i++) {
            if (companyAddress == loans[i].request_company) {
                ret[k++] = loans[i];
            }
        }
        return ret;
    }

    function addBill(
        address borrow_company,
        address lend_company,
        uint256 money,
        uint256 start_date,
        uint256 end_date,
        bool is_pass,
        bool is_finish,
        bool is_from_upstream,
        uint256 credit_growth
    ) public returns (bool success) {
        bills.push(
            Bill(
                bill_id,
                borrow_company,
                lend_company,
                money,
                start_date,
                end_date,
                is_pass,
                is_finish,
                is_from_upstream,
                credit_growth
            )
        );
        bill_id++;
        return true;
    }

    function addLoan(
        address request_company,
        address bank_address,
        uint256 start_date,
        bool is_pass,
        bool is_finish,
        uint256 money
    ) public returns (bool success) {
        loans.push(
            Loan(
                loan_id,
                request_company,
                bank_address,
                start_date,
                is_pass,
                is_finish,
                money
            )
        );
        loan_id++;
        return true;
    }

    /** --------------- **/
}
