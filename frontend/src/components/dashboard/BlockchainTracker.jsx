import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Link, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function BlockchainTracker() {
  const [transactions, setTransactions] = useState([
    { id: 1, hash: '0x1a2b3c...', amount: '0.5 ETH', status: 'confirmed', timestamp: '2 min ago', project: 'Amazon Rainforest' },
    { id: 2, hash: '0x4d5e6f...', amount: '1.2 ETH', status: 'pending', timestamp: '5 min ago', project: 'Coral Reef Protection' },
    { id: 3, hash: '0x7g8h9i...', amount: '0.8 ETH', status: 'confirmed', timestamp: '12 min ago', project: 'Wildlife Sanctuary' },
    { id: 4, hash: '0xjk1l2m...', amount: '2.1 ETH', status: 'confirmed', timestamp: '18 min ago', project: 'Ocean Cleanup' }
  ]);

  const [summary, setSummary] = useState({
    totalValue: '125.7 ETH',
    totalTransactions: 856,
    successRate: 98.7,
    avgGasUsed: 45000
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Blockchain Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{summary.totalValue}</div>
              <div className="text-sm text-gray-600">Total Value Locked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{summary.totalTransactions}</div>
              <div className="text-sm text-gray-600">Total Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{summary.successRate}%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{summary.avgGasUsed.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Avg Gas Used</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Recent Transactions</h4>
            {transactions.map(tx => (
              <TransactionRow key={tx.id} transaction={tx} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TransactionRow({ transaction }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        {getStatusIcon(transaction.status)}
        <div>
          <div className="font-mono text-sm text-gray-900">{transaction.hash}</div>
          <div className="text-xs text-gray-500">{transaction.project}</div>
        </div>
      </div>
      
      <div className="text-right">
        <div className="font-semibold text-gray-900">{transaction.amount}</div>
        <div className="text-xs text-gray-500">{transaction.timestamp}</div>
      </div>
      
      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(transaction.status)}`}>
        {transaction.status}
      </span>
    </div>
  );
}