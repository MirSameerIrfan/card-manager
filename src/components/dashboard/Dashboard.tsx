import {
  ArrowUpRight,
  Bell,
  CreditCard,
  DollarSign,
  Landmark,
  Receipt,
} from "lucide-react";
import { getRouteApi, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AddPaymentModal,
  type EditablePayment,
  type RecurringFrequency,
} from "./AddPaymentModal";
import { deletePaymentFn } from "@/components/dashboard/dashboard.functions";
import { PaymentCalendarModal } from "./PaymentCalendarModal";
import { DashboardHeader } from "./DashboardHeader";
import { StatsGrid } from "./StatsGrid";
import { PaymentCard } from "./PaymentCard";
import { PaymentsSection } from "./PaymentsSection";
import {
  countDueThisWeekMonday,
  formatCurrency,
  formatDate,
  getFirstName,
  getPaymentStatus,
  getTimeOfDayGreeting,
} from "./dashboard-utils";
import type { StatCardProps } from "./StatCard";

type PaymentType = "credit_card" | "loan" | "recurring_bill";

const routeApi = getRouteApi("/dashboard");

export function Dashboard() {
  const data = routeApi.useLoaderData();
  const router = useRouter();
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState<EditablePayment | null>(
    null,
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const greeting = getTimeOfDayGreeting();
  const displayName = getFirstName(data.user?.name ?? data.user?.email);

  const upcomingPayments = [
    ...data.creditCards.map((card) => ({
      date: new Date(card.dueDate),
      amount: card.amountDue,
      type: "credit_card" as const,
    })),
    ...data.loans.map((loan) => ({
      date: new Date(loan.nextPayment),
      amount: loan.monthlyPayment,
      type: "loan" as const,
    })),
    ...data.recurringBills.map((bill) => ({
      date: new Date(bill.dueDate),
      amount: bill.amount,
      type: "recurring_bill" as const,
    })),
  ];

  const dueThisWeekCount = countDueThisWeekMonday([
    ...data.creditCards.map((card) => ({ date: card.dueDate })),
    ...data.loans.map((loan) => ({ date: loan.nextPayment })),
    ...data.recurringBills.map((bill) => ({ date: bill.dueDate })),
  ]);

  const dueThisWeekText =
    dueThisWeekCount === 0
      ? "No payments due this week."
      : dueThisWeekCount === 1
        ? "You have 1 payment due this week."
        : `You have ${dueThisWeekCount} payments due this week.`;

  const statsItems: StatCardProps[] = [
    {
      label: "Total Upcoming",
      value: formatCurrency(data.stats.totalDue),
      icon: DollarSign,
      tone: "emerald",
    },
    {
      label: "Upcoming Payments",
      value: data.stats.upcomingPaymentsCount.toString(),
      icon: Bell,
      tone: "teal",
    },
    {
      label: "Auto-Pay Active",
      value: data.stats.autoPayCount.toString(),
      icon: ArrowUpRight,
      tone: "cyan",
    },
  ];

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleDelete = async (id: string, type: PaymentType) => {
    if (!confirm("Are you sure you want to delete this payment?")) return;

    setDeletingId(id);
    try {
      const res = await deletePaymentFn({ data: { id, type } });
      if (!res.success) throw new Error(res.error || "Failed");
      await router.invalidate();
    } catch (_error) {
      alert("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-cyan-50 pb-20">
      <AddPaymentModal
        isOpen={isAddPaymentOpen}
        onClose={() => {
          setIsAddPaymentOpen(false);
          setPaymentToEdit(null);
        }}
        paymentToEdit={paymentToEdit}
      />
      <PaymentCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        payments={upcomingPayments}
      />

      <div
        className={`mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-12 transition-all duration-300 sm:px-6 lg:px-8 ${
          isMounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <DashboardHeader
          greeting={greeting}
          displayName={displayName}
          dueText={dueThisWeekText}
          onOpenCalendar={() => setIsCalendarOpen(true)}
          onAddPayment={() => {
            setPaymentToEdit(null);
            setIsAddPaymentOpen(true);
          }}
        />

        <StatsGrid stats={statsItems} />

        <PaymentsSection
          title="Credit Cards"
          count={data.creditCards.length}
          icon={CreditCard}
          iconClassName="bg-emerald-100 text-emerald-600"
        >
          {data.creditCards.map((card) => (
            <PaymentCard
              key={card.id}
              name={card.name}
              provider={card.provider}
              amount={formatCurrency(card.amountDue)}
              date={formatDate(card.dueDate)}
              status={getPaymentStatus(card.dueDate, false)}
              icon={CreditCard}
              onEdit={() => {
                setPaymentToEdit({
                  id: card.id,
                  type: "credit_card",
                  name: card.name,
                  provider: card.provider,
                  amount: card.amountDue,
                  date: new Date(card.dueDate).toISOString(),
                  minimumPayment: card.minimumPayment,
                  status: card.status,
                });
                setIsAddPaymentOpen(true);
              }}
              onDelete={() => void handleDelete(card.id, "credit_card")}
              isDeleting={deletingId === card.id}
            />
          ))}
        </PaymentsSection>

        <PaymentsSection
          title="Loans"
          count={data.loans.length}
          icon={Landmark}
          iconClassName="bg-blue-100 text-blue-600"
        >
          {data.loans.map((loan) => (
            <PaymentCard
              key={loan.id}
              name={loan.name}
              provider={loan.provider}
              amount={formatCurrency(loan.monthlyPayment)}
              date={formatDate(loan.nextPayment)}
              status={getPaymentStatus(loan.nextPayment, loan.autoPay)}
              icon={Landmark}
              onEdit={() => {
                setPaymentToEdit({
                  id: loan.id,
                  type: "loan",
                  name: loan.name,
                  provider: loan.provider,
                  amount: loan.monthlyPayment,
                  date: new Date(loan.nextPayment).toISOString(),
                  remainingBalance: loan.remainingBalance,
                  autoPay: loan.autoPay,
                });
                setIsAddPaymentOpen(true);
              }}
              onDelete={() => void handleDelete(loan.id, "loan")}
              isDeleting={deletingId === loan.id}
            />
          ))}
        </PaymentsSection>

        <PaymentsSection
          title="Recurring Bills"
          count={data.recurringBills.length}
          icon={Receipt}
          iconClassName="bg-purple-100 text-purple-600"
        >
          {data.recurringBills.map((bill) => (
            <PaymentCard
              key={bill.id}
              name={bill.name}
              provider={bill.provider}
              amount={formatCurrency(bill.amount)}
              date={formatDate(bill.dueDate)}
              status={getPaymentStatus(bill.dueDate, bill.autoPay)}
              icon={Receipt}
              frequency={bill.frequency}
              onEdit={() => {
                setPaymentToEdit({
                  id: bill.id,
                  type: "recurring_bill",
                  name: bill.name,
                  provider: bill.provider,
                  amount: bill.amount,
                  date: new Date(bill.dueDate).toISOString(),
                  category: bill.category,
                  autoPay: bill.autoPay,
                  frequency: bill.frequency as RecurringFrequency,
                });
                setIsAddPaymentOpen(true);
              }}
              onDelete={() => void handleDelete(bill.id, "recurring_bill")}
              isDeleting={deletingId === bill.id}
            />
          ))}
        </PaymentsSection>
      </div>
    </main>
  );
}
