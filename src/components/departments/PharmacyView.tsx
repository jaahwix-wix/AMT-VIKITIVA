import React, { useState } from 'react';
import {
  Pill,
  Plus,
  Search,
  CheckCircle,
  AlertTriangle,
  Printer,
  Sparkles,
  Layers,
  ArrowDownRight,
  TrendingDown,
  ShoppingBag,
  Check,
  PackagePlus
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { PharmacyItem, Prescription, PrescriptionItem } from '../../types';

export const PharmacyView: React.FC = () => {
  const {
    pharmacyItems,
    prescriptions,
    patients,
    updatePharmacyStock,
    addPharmacyItem,
    createPrescription,
    dispensePrescription,
    openAiAssistant,
    openPrintReport,
    formatMoney,
  } = useHospital();

  const [activeTab, setActiveTab] = useState<'dispensary' | 'inventory'>('dispensary');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRxId, setSelectedRxId] = useState<string>(prescriptions[0]?.id || '');
  const [isNewRxModalOpen, setIsNewRxModalOpen] = useState<boolean>(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState<boolean>(false);
  const [selectedDrugToRestock, setSelectedDrugToRestock] = useState<PharmacyItem | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(50);

  // New Prescription form state
  const [rxPatientId, setRxPatientId] = useState<string>(patients[0]?.id || '');
  const [rxDoctor, setRxDoctor] = useState<string>('Dr. A. Turay');
  const [rxDiagnosis, setRxDiagnosis] = useState<string>('Acute Falciparum Malaria & Bacterial Enteritis');
  const [rxItems, setRxItems] = useState<
    { itemId: string; itemName: string; dosage: string; frequency: string; duration: string; quantity: number }[]
  >([
    {
      itemId: 'PH-01',
      itemName: 'Artesunate Injection 60mg',
      dosage: '120mg IV stat',
      frequency: 'Stat then 12h, 24h',
      duration: '3 doses',
      quantity: 3,
    },
    {
      itemId: 'PH-02',
      itemName: 'Artemether + Lumefantrine (Coartem) 80/480mg',
      dosage: '1 tablet',
      frequency: 'Twice daily',
      duration: '3 days',
      quantity: 6,
    },
  ]);

  const filteredItems = pharmacyItems.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedRx = prescriptions.find((p) => p.id === selectedRxId) || prescriptions[0];

  const handleCreatePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === rxPatientId);
    if (!patient) return;

    createPrescription({
      patientId: patient.id,
      patientName: patient.name,
      doctor: rxDoctor,
      diagnosis: rxDiagnosis,
      items: rxItems.map((it) => ({ ...it, dispensed: false })),
    });

    setIsNewRxModalOpen(false);
  };

  const handleDispenseAll = (rx: Prescription) => {
    dispensePrescription(rx.id);
  };

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDrugToRestock) return;
    updatePharmacyStock(selectedDrugToRestock.id, restockAmount);
    setIsRestockModalOpen(false);
    setSelectedDrugToRestock(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Signboard Service 4 Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white font-black text-xl flex items-center justify-center shadow-xs">
            4
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                Hospital Pharmacy & Dispensary
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-teal-100 text-teal-800">
                Signboard Service #4
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Essential drug formulary, anti-malarial regimens, intravenous infusions, antibiotics, and strict batch tracking.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsNewRxModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Prescription Order</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher: Dispensary vs Inventory */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('dispensary')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dispensary'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            Prescription Dispensary Queue ({prescriptions.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'inventory'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
            }`}
          >
            Drug Inventory & Stock Catalog ({pharmacyItems.length})
          </button>
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'inventory' ? 'Search medicines...' : 'Search prescriptions...'}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-600 focus:bg-white"
          />
        </div>
      </div>

      {/* View 1: Dispensary Queue */}
      {activeTab === 'dispensary' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Prescriptions List */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-xs uppercase text-slate-700 tracking-wider pb-2 border-b">
              Active Prescriptions
            </h3>
            <div className="space-y-2">
              {prescriptions.map((rx) => {
                const isSelected = rx.id === selectedRxId;
                const isDispensed = rx.status === 'dispensed';
                return (
                  <div
                    key={rx.id}
                    onClick={() => setSelectedRxId(rx.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 border-teal-300 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{rx.patientName}</span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                          isDispensed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}
                      >
                        {rx.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-teal-800 font-mono mt-1 font-semibold">
                      {rx.id} • {rx.items.length} items
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                      <span>{rx.doctor}</span>
                      <span>{rx.prescribedAt}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Prescription View & Dispense Control */}
          <div className="xl:col-span-2 space-y-4">
            {selectedRx ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900">{selectedRx.patientName}</h3>
                        <span className="text-xs text-slate-400 font-mono">({selectedRx.patientId})</span>
                        <span className="font-mono text-xs text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-bold">
                          {selectedRx.id}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Prescribed by {selectedRx.doctor} • {selectedRx.diagnosis}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openPrintReport('prescription', selectedRx)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Slip</span>
                    </button>

                    <button
                      onClick={() =>
                        openAiAssistant(
                          'drug-interaction',
                          `Verify interactions and dosing for patient ${selectedRx.patientName}:\n` +
                            selectedRx.items
                              .map((i) => `- ${i.itemName} (${i.dosage}, ${i.frequency}, ${i.duration})`)
                              .join('\n')
                        )
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-lg text-xs font-bold transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>AI Drug Safety Check</span>
                    </button>

                    {selectedRx.status !== 'dispensed' && (
                      <button
                        onClick={() => handleDispenseAll(selectedRx)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                      >
                        Dispense All Medicines
                      </button>
                    )}
                  </div>
                </div>

                {/* Items list */}
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 font-semibold border-b">
                      <tr>
                        <th className="p-2.5">Medication & Strength</th>
                        <th className="p-2.5">Dosage / Frequency</th>
                        <th className="p-2.5">Duration</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedRx.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-bold text-slate-900">{it.itemName}</td>
                          <td className="p-2.5 text-slate-700">{it.dosage} — {it.frequency}</td>
                          <td className="p-2.5 text-slate-600">{it.duration}</td>
                          <td className="p-2.5 text-center font-mono font-bold">{it.quantity}</td>
                          <td className="p-2.5 text-right">
                            {it.dispensed ? (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                                DISPENSED
                              </span>
                            ) : (
                              <button
                                onClick={() => dispensePrescription(selectedRx.id, [it.itemId])}
                                className="px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded font-bold text-[10px]"
                              >
                                Dispense Item
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl border text-center text-slate-400">
                Select a prescription.
              </div>
            )}
          </div>
        </div>
      )}

      {/* View 2: Drug Inventory */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase text-slate-700 tracking-wider">
              Essential Hospital Medicines & Stock Levels ({filteredItems.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b">
                <tr>
                  <th className="p-3">Drug ID</th>
                  <th className="p-3">Generic Name & Strength</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Stock Qty</th>
                  <th className="p-3">Reorder Alert</th>
                  <th className="p-3">Unit Price (NLe)</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((drug) => {
                  const isLow = drug.stockQuantity <= drug.reorderLevel;
                  return (
                    <tr key={drug.id} className={isLow ? 'bg-rose-50/40' : ''}>
                      <td className="p-3 font-mono font-bold text-slate-500">{drug.id}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{drug.name}</div>
                        <div className="text-[10px] text-slate-400">{drug.strength} • {drug.dosageForm}</div>
                      </td>
                      <td className="p-3 text-slate-600 font-medium">{drug.category}</td>
                      <td className="p-3">
                        <span className={`font-mono font-bold text-sm ${isLow ? 'text-rose-700' : 'text-slate-900'}`}>
                          {drug.stockQuantity} {drug.unit}
                        </span>
                      </td>
                      <td className="p-3">
                        {isLow ? (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-bold text-[10px] flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" />
                            LOW STOCK (≤{drug.reorderLevel})
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Above min ({drug.reorderLevel})</span>
                        )}
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-800">
                        {formatMoney(drug.unitPriceNLE)}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedDrugToRestock(drug);
                            setIsRestockModalOpen(true);
                          }}
                          className="px-3 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-900 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors"
                        >
                          + Restock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Restock Drug */}
      {isRestockModalOpen && selectedDrugToRestock && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsRestockModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 border space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-slate-900">Restock Medicine</h3>
            <p className="text-xs text-slate-500">
              Adding new received units for <span className="font-bold text-slate-800">{selectedDrugToRestock.name}</span>.
            </p>
            <form onSubmit={handleRestockSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Add Quantity (Units)</label>
                <input
                  type="number"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(Number(e.target.value))}
                  min={1}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 font-mono text-sm font-bold"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRestockModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 text-white rounded-xl font-bold"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Prescription */}
      {isNewRxModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsNewRxModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 border space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-slate-900">Create Clinical Prescription</h3>
            <form onSubmit={handleCreatePrescription} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Patient</label>
                  <select
                    value={rxPatientId}
                    onChange={(e) => setRxPatientId(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.id}) — {p.age}yo {p.gender}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Prescribing Clinician</label>
                  <input
                    type="text"
                    value={rxDoctor}
                    onChange={(e) => setRxDoctor(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Diagnosis</label>
                <input
                  type="text"
                  value={rxDiagnosis}
                  onChange={(e) => setRxDiagnosis(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50"
                  required
                />
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <label className="font-bold text-slate-800 block">Prescribed Medicines</label>
                {rxItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-4 gap-2">
                    <div className="col-span-2">
                      <label className="text-[10px] text-slate-500 font-semibold block">Medicine</label>
                      <input
                        type="text"
                        value={item.itemName}
                        onChange={(e) => {
                          const copy = [...rxItems];
                          copy[idx].itemName = e.target.value;
                          setRxItems(copy);
                        }}
                        className="w-full p-1.5 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold block">Dosage</label>
                      <input
                        type="text"
                        value={item.dosage}
                        onChange={(e) => {
                          const copy = [...rxItems];
                          copy[idx].dosage = e.target.value;
                          setRxItems(copy);
                        }}
                        className="w-full p-1.5 border rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-semibold block">Quantity</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const copy = [...rxItems];
                          copy[idx].quantity = Number(e.target.value);
                          setRxItems(copy);
                        }}
                        className="w-full p-1.5 border rounded bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewRxModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold"
                >
                  Submit to Pharmacy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
