import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  DollarSign,
  Printer,
  CheckCircle,
  Clock,
  User,
  Calendar,
  CreditCard,
  Building,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Invoice, InvoiceItem } from '../../types';

export const BillingView: React.FC = () => {
  const {
    invoices,
    patients,
    createInvoice,
    payInvoice,
    openPrintReport,
    formatMoney,
    currency,
    setCurrency,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>(invoices[0]?.id || '');
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<Invoice['paymentMethod']>('Cash (NLe)');

  // Form states for new invoice
  const [patientId, setPatientId] = useState<string>(patients[0]?.id || '');
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 'it-1',
      serviceName: 'Inpatient Ward Bed Charge (3 Nights)',
      department: 'Admission',
      quantity: 3,
      unitPriceNLE: 150,
      amountNLE: 450,
    },
    {
      id: 'it-2',
      serviceName: 'Malaria Blood Film & Full Blood Count',
      department: 'Laboratory',
      quantity: 1,
      unitPriceNLE: 180,
      amountNLE: 180,
    },
    {
      id: 'it-3',
      serviceName: 'Artesunate & Coartem Pharmacotherapy',
      department: 'Pharmacy',
      quantity: 1,
      unitPriceNLE: 210,
      amountNLE: 210,
    },
  ]);
  const [discountNLE, setDiscountNLE] = useState<number>(0);
  const [initialPayment, setInitialPayment] = useState<number>(840);
  const [paymentMethod, setPaymentMethod] = useState<Invoice['paymentMethod']>('Cash (NLe)');

  const filteredInvoices = invoices.filter((inv) => {
    if (!searchQuery) return true;
    return (
      inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const selectedInvoice = invoices.find((inv) => inv.id === selectedInvoiceId) || invoices[0];

  const subtotal = items.reduce((sum, it) => sum + it.amountNLE, 0);
  const total = Math.max(0, subtotal - discountNLE);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    createInvoice({
      patientId: patient.id,
      patientName: patient.name,
      items,
      subtotalNLE: subtotal,
      discountNLE,
      totalNLE: total,
      paidAmountNLE: initialPayment,
      status: initialPayment >= total ? 'paid' : initialPayment > 0 ? 'partial' : 'unpaid',
      paymentMethod,
    });

    setIsNewInvoiceModalOpen(false);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    payInvoice(selectedInvoice.id, payAmount, payMethod);
    setIsPaymentModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white font-black text-xl flex items-center justify-center shadow-xs">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                Hospital Cashier, Invoicing & Billing
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                Accounting Hub
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-currency accounting supporting Sierra Leone Leone (NLe) and US Dollar ($) with official printed receipts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsNewInvoiceModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Medical Bill</span>
          </button>
        </div>
      </div>

      {/* Grid: Invoices List & Selected Invoice Sheet */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Bills List */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search invoices..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border rounded-xl outline-none"
            />
          </div>

          <div className="space-y-2">
            {filteredInvoices.map((inv) => {
              const isSelected = inv.id === selectedInvoiceId;
              const isPaid = inv.status === 'paid';
              return (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoiceId(inv.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 border-teal-300 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{inv.patientName}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                        isPaid
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.status === 'partial'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-teal-900 font-mono mt-1 font-bold">
                    {inv.invoiceNumber} • {formatMoney(inv.totalNLE)}
                  </div>

                  <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>{inv.paymentMethod}</span>
                    <span>{inv.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Bill Details */}
        <div className="xl:col-span-2 space-y-4">
          {selectedInvoice ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900">{selectedInvoice.patientName}</h3>
                      <span className="text-xs text-slate-400 font-mono">({selectedInvoice.patientId})</span>
                      <span className="font-mono text-xs text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-bold">
                        {selectedInvoice.invoiceNumber}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Issued on {selectedInvoice.date} • Method: {selectedInvoice.paymentMethod}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openPrintReport('invoice', selectedInvoice)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Official Receipt</span>
                  </button>

                  {selectedInvoice.status !== 'paid' && (
                    <button
                      onClick={() => {
                        setPayAmount(selectedInvoice.totalNLE - selectedInvoice.paidAmountNLE);
                        setIsPaymentModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                    >
                      Receive Payment
                    </button>
                  )}
                </div>
              </div>

              {/* Itemized Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 font-semibold border-b">
                    <tr>
                      <th className="p-2.5">Service Description</th>
                      <th className="p-2.5">Department</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Unit Price</th>
                      <th className="p-2.5 text-right">Amount ({currency})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedInvoice.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-bold text-slate-900">{it.serviceName}</td>
                        <td className="p-2.5 text-slate-500">{it.department}</td>
                        <td className="p-2.5 text-center font-mono font-bold">{it.quantity}</td>
                        <td className="p-2.5 text-right font-mono text-slate-600">
                          {formatMoney(it.unitPriceNLE)}
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                          {formatMoney(it.amountNLE)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Calculation Card */}
              <div className="flex justify-end pt-2">
                <div className="w-72 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono font-semibold">{formatMoney(selectedInvoice.subtotalNLE)}</span>
                  </div>
                  {selectedInvoice.discountNLE > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount:</span>
                      <span className="font-mono">-{formatMoney(selectedInvoice.discountNLE)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-extrabold text-slate-900 border-t pt-2">
                    <span>Total Amount:</span>
                    <span className="font-mono text-teal-800">{formatMoney(selectedInvoice.totalNLE)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-emerald-800">
                    <span>Paid Amount:</span>
                    <span className="font-mono">{formatMoney(selectedInvoice.paidAmountNLE)}</span>
                  </div>
                  {selectedInvoice.totalNLE - selectedInvoice.paidAmountNLE > 0 && (
                    <div className="flex justify-between text-xs font-bold text-rose-700">
                      <span>Balance Outstanding:</span>
                      <span className="font-mono">
                        {formatMoney(selectedInvoice.totalNLE - selectedInvoice.paidAmountNLE)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border text-center text-slate-400">
              Select an invoice.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Receive Payment */}
      {isPaymentModalOpen && selectedInvoice && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsPaymentModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-slate-900">Record Payment</h3>
            <p className="text-xs text-slate-500">
              Receiving cash or digital payment for invoice <span className="font-mono font-bold">{selectedInvoice.invoiceNumber}</span>.
            </p>
            <form onSubmit={handleProcessPayment} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Amount (NLe)</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 font-mono font-bold text-sm"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50"
                >
                  <option value="Cash (NLe)">Cash (Leone NLe)</option>
                  <option value="Cash (USD)">Cash (USD $)</option>
                  <option value="Orange Money">Orange Money</option>
                  <option value="Africell Money">Africell Money</option>
                  <option value="Bank Transfer">Bank Wire Transfer</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  Confirm & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Invoice */}
      {isNewInvoiceModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsNewInvoiceModalOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 border space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-slate-900">Generate Medical Bill</h3>
            <form onSubmit={handleCreateInvoice} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Patient</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id}) — {p.age}yo {p.gender}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-800 block">Itemized Charges</label>
                {items.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border grid grid-cols-4 gap-2">
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={item.serviceName}
                        onChange={(e) => {
                          const copy = [...items];
                          copy[idx].serviceName = e.target.value;
                          setItems(copy);
                        }}
                        className="w-full p-1.5 border rounded bg-white text-xs"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={item.amountNLE}
                        onChange={(e) => {
                          const copy = [...items];
                          copy[idx].amountNLE = Number(e.target.value);
                          copy[idx].unitPriceNLE = Number(e.target.value);
                          setItems(copy);
                        }}
                        className="w-full p-1.5 border rounded bg-white font-mono text-xs"
                      />
                    </div>
                    <div className="text-right flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => setItems(items.filter((_, i) => i !== idx))}
                        className="text-rose-600 font-bold px-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setItems([
                      ...items,
                      {
                        id: `it-${Date.now()}`,
                        serviceName: 'General Clinical Service',
                        department: 'General',
                        quantity: 1,
                        unitPriceNLE: 100,
                        amountNLE: 100,
                      },
                    ])
                  }
                  className="text-teal-700 font-bold text-xs hover:underline block pt-1"
                >
                  + Add Line Item
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t pt-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Discount (NLe)</label>
                  <input
                    type="number"
                    value={discountNLE}
                    onChange={(e) => setDiscountNLE(Number(e.target.value))}
                    className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Initial Payment (NLe)</label>
                  <input
                    type="number"
                    value={initialPayment}
                    onChange={(e) => setInitialPayment(Number(e.target.value))}
                    className="w-full p-2 border rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewInvoiceModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold"
                >
                  Create & Save Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
