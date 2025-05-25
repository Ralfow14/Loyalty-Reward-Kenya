
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  amount: number;
  points_awarded: number;
  mpesa_transaction_id: string | null;
  status: string | null;
  created_at: string;
  customer?: {
    name: string;
    phone: string;
  };
}

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  showCustomer?: boolean;
}

const TransactionTable = ({ transactions, isLoading, showCustomer = true }: TransactionTableProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Points</TableHead>
                {showCustomer && <TableHead>Customer</TableHead>}
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Transaction ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={showCustomer ? 6 : 5} 
                    className="text-center text-gray-500 py-8"
                  >
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {format(new Date(transaction.created_at), 'MMM dd, yyyy')}
                      <div className="text-sm text-gray-500 sm:hidden">
                        {format(new Date(transaction.created_at), 'HH:mm')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">KES {transaction.amount.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        +{transaction.points_awarded} pts
                      </Badge>
                    </TableCell>
                    {showCustomer && (
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.customer?.name}</div>
                          <div className="text-sm text-gray-500">{transaction.customer?.phone}</div>
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <Badge 
                        variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                      >
                        {transaction.status || 'Completed'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-gray-500">
                      {transaction.mpesa_transaction_id || 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionTable;
