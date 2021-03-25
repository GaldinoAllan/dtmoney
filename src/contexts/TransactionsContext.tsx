import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'

import { api } from '../services/api'

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>

interface TransactionsContextData {
  transactions: Transaction[]
  loading: boolean
  createTrasaction: (transaction: TransactionInput) => void;
}

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionsContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData
)

export function TransactionsProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('transactions')
      .then(response => setTransactions(response.data.transactions))

    setLoading(false)
  }, [])

  function createTrasaction(transaction: TransactionInput) {
    api.post('/transactions', transaction)
    // setTransactions()
  }

  const value = {
    transactions,
    createTrasaction,
    loading
  }

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactions(): TransactionsContextData {
  const context = useContext(TransactionsContext);

  return context;
}