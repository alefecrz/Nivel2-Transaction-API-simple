import Transaction from '../models/Transaction';

interface CreateTransactionTDO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface TransactionAndBalance {
  transactions: Transaction[];
  balance: Balance;
}
interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): TransactionAndBalance {
    const { transactions } = this;
    const balance = this.getBalance();
    return { transactions, balance };
  }

  public getBalance(): Balance {
    const outcome = this.transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((accumlator: number, current: Transaction) => {
        return accumlator + current.value;
      }, 0);

    const income = this.transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((accumlator: number, current: Transaction) => {
        return accumlator + current.value;
      }, 0);

    return { outcome, income, total: income - outcome };
  }

  public create({ title, type, value }: CreateTransactionTDO): Transaction {
    const transaction = new Transaction({ title, type, value });

    this.transactions.push(transaction);
    const balance = this.getBalance();

    if (balance.total < 0) throw Error('Balance invalid.');

    return transaction;
  }
}

export default TransactionsRepository;
