"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { formatTZSCompact } from "@/lib/utils/currency";

interface StripeData {
  balance: {
    available: { amount: number; currency: string }[];
    pending: { amount: number; currency: string }[];
  };
  charges: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    description: string;
    customerEmail: string;
    created: string;
    paid: boolean;
    refunded: boolean;
  }[];
  paymentIntents: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    description: string;
    created: string;
  }[];
  checkoutSessions: {
    id: string;
    amountTotal: number;
    currency: string;
    status: string | null;
    paymentStatus: string;
    customerEmail: string;
    created: string;
  }[];
}

interface StripePaymentsClientProps {
  data: StripeData | null;
}

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
    succeeded: { variant: "default", icon: <CheckCircle2 className="h-3 w-3 mr-1" /> },
    complete: { variant: "default", icon: <CheckCircle2 className="h-3 w-3 mr-1" /> },
    paid: { variant: "default", icon: <CheckCircle2 className="h-3 w-3 mr-1" /> },
    pending: { variant: "secondary", icon: <Clock className="h-3 w-3 mr-1" /> },
    processing: { variant: "secondary", icon: <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> },
    requires_payment_method: { variant: "outline", icon: <AlertCircle className="h-3 w-3 mr-1" /> },
    requires_confirmation: { variant: "outline", icon: <AlertCircle className="h-3 w-3 mr-1" /> },
    canceled: { variant: "destructive", icon: <XCircle className="h-3 w-3 mr-1" /> },
    failed: { variant: "destructive", icon: <XCircle className="h-3 w-3 mr-1" /> },
    expired: { variant: "destructive", icon: <XCircle className="h-3 w-3 mr-1" /> },
    unpaid: { variant: "destructive", icon: <XCircle className="h-3 w-3 mr-1" /> },
  };

  const config = statusConfig[status] || { variant: "outline" as const, icon: null };

  return (
    <Badge variant={config.variant} className="flex items-center w-fit">
      {config.icon}
      {status.replace(/_/g, " ")}
    </Badge>
  );
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatAmount = (amount: number, currency: string) => {
  if (currency === "TZS") {
    return formatTZSCompact(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export default function StripePaymentsClient({ data }: StripePaymentsClientProps) {
  const router = useRouter();

  if (!data) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6 px-6 py-6 bg-gradient-to-r from-[#635BFF]/10 to-[#00D4FF]/10 border border-[#635BFF]/30 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#635BFF]/20 rounded-lg">
              <CreditCard className="h-6 w-6 text-[#635BFF]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Stripe Payments Dashboard</h1>
              <p className="text-gray-600">View and manage your Stripe payments</p>
            </div>
          </div>
        </div>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <h3 className="font-semibold text-red-800">Failed to load Stripe data</h3>
                <p className="text-red-600">Please check your Stripe API key configuration in the .env file.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalAvailable = data.balance.available.reduce((sum, b) => sum + b.amount, 0);
  const totalPending = data.balance.pending.reduce((sum, b) => sum + b.amount, 0);
  const successfulCharges = data.charges.filter(c => c.paid && !c.refunded).length;
  const totalChargeAmount = data.charges.filter(c => c.paid).reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="px-6 py-6 bg-gradient-to-r from-[#635BFF]/10 to-[#00D4FF]/10 border border-[#635BFF]/30 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#635BFF]/20 rounded-lg">
              <CreditCard className="h-6 w-6 text-[#635BFF]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Stripe Payments Dashboard</h1>
              <p className="text-gray-600">View and manage your Stripe payments</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.refresh()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              size="sm"
              onClick={() => window.open("https://dashboard.stripe.com", "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Stripe
            </Button>
          </div>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalAvailable.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Ready to withdraw</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Balance</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ${totalPending.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Being processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Recent Charges</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successfulCharges}</div>
            <p className="text-xs text-muted-foreground">Successful payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Charged</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalChargeAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From recent charges</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different data views */}
      <Tabs defaultValue="checkout" className="space-y-4">
        <TabsList>
          <TabsTrigger value="checkout">Checkout Sessions</TabsTrigger>
          <TabsTrigger value="charges">Charges</TabsTrigger>
          <TabsTrigger value="intents">Payment Intents</TabsTrigger>
        </TabsList>

        {/* Checkout Sessions Tab */}
        <TabsContent value="checkout">
          <Card>
            <CardHeader>
              <CardTitle>Recent Checkout Sessions</CardTitle>
              <CardDescription>Last 10 checkout sessions from Stripe</CardDescription>
            </CardHeader>
            <CardContent>
              {data.checkoutSessions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No checkout sessions found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Session ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.checkoutSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-mono text-xs">
                          {session.id.slice(0, 20)}...
                        </TableCell>
                        <TableCell>{session.customerEmail}</TableCell>
                        <TableCell>
                          {formatAmount(session.amountTotal, session.currency)}
                        </TableCell>
                        <TableCell>{getStatusBadge(session.status || "unknown")}</TableCell>
                        <TableCell>{getStatusBadge(session.paymentStatus)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(session.created)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Charges Tab */}
        <TabsContent value="charges">
          <Card>
            <CardHeader>
              <CardTitle>Recent Charges</CardTitle>
              <CardDescription>Last 10 charges from Stripe</CardDescription>
            </CardHeader>
            <CardContent>
              {data.charges.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No charges found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Charge ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.charges.map((charge) => (
                      <TableRow key={charge.id}>
                        <TableCell className="font-mono text-xs">
                          {charge.id.slice(0, 20)}...
                        </TableCell>
                        <TableCell>{charge.customerEmail}</TableCell>
                        <TableCell>
                          {formatAmount(charge.amount, charge.currency)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {getStatusBadge(charge.status)}
                            {charge.refunded && (
                              <Badge variant="outline" className="text-orange-600 w-fit">
                                Refunded
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {charge.description}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(charge.created)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Intents Tab */}
        <TabsContent value="intents">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payment Intents</CardTitle>
              <CardDescription>Last 10 payment intents from Stripe</CardDescription>
            </CardHeader>
            <CardContent>
              {data.paymentIntents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No payment intents found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Intent ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.paymentIntents.map((intent) => (
                      <TableRow key={intent.id}>
                        <TableCell className="font-mono text-xs">
                          {intent.id.slice(0, 20)}...
                        </TableCell>
                        <TableCell>
                          {formatAmount(intent.amount, intent.currency)}
                        </TableCell>
                        <TableCell>{getStatusBadge(intent.status)}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {intent.description}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(intent.created)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>Access Stripe Dashboard sections directly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Payments", url: "https://dashboard.stripe.com/payments" },
              { name: "Customers", url: "https://dashboard.stripe.com/customers" },
              { name: "Balances", url: "https://dashboard.stripe.com/balance/overview" },
              { name: "Webhooks", url: "https://dashboard.stripe.com/webhooks" },
            ].map((link) => (
              <Button
                key={link.name}
                variant="outline"
                className="justify-start"
                onClick={() => window.open(link.url, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {link.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
