import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CreditBalanceCard({ balance }: { balance: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">${balance.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
}
