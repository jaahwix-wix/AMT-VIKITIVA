import React, { useState } from 'react';
import {
  FlaskConical,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Printer,
  Sparkles,
  AlertCircle,
  FileText,
  User,
  ShieldCheck,
  Tag,
  Check
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { LabOrder, LabOrderItem } from '../../types';
import { LAB_TEST_CATALOG } from '../../data/mockData';

export const LaboratoryView: React.FC = () => {
  const {
    labOrders,
    patients,
    createLabOrder,
    updateLabResults,
    updateLabOrderStatus,
    openAiAssistant,
    openPrintReport,
    formatMoney,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(labOrders[0]?.id || '');
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState<boolean>(false);
  const [isResultEntryModalOpen, setIsResultEntryModalOpen] = useState<boolean>(false);

  // New Order Form state
  const [orderPatientId, setOrderPatientId] = useState<string>(patients[0]?.id || '');
  const [orderingDoctor, setOrderingDoctor] = useState<string>('Dr. A. Turay');
  const [clinicalNotes, setClinicalNotes] = useState<string>('Acute febrile syndrome, suspect Falciparum Malaria vs Typhoid');
  const [selectedTests, setSelectedTests] = useState<string[]>(['Malaria Parasite (Blood Film)', 'Full Blood Count (FBC)']);

  // Result entry form state
  const [labTech, setLabTech] = useState<string>('M. Kamara (BSc MLS)');
  const [editingItems, setEditingItems] = useState<LabOrderItem[]>([]);

  const filteredOrders = labOrders.filter((o) => {
    if (!searchQuery) return true;
    return (
      o.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const selectedOrder = labOrders.find((o) => o.id === selectedOrderId) || labOrders[0];

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === orderPatientId);
    if (!patient) return;

    const items: LabOrderItem[] = selectedTests.map((tName) => {
      const catalogItem = LAB_TEST_CATALOG.find((c) => c.name === tName);
      return {
        testId: catalogItem?.id || `t-${Date.now()}`,
        testName: tName,
        category: catalogItem?.category || 'Parasitology',
        referenceRange: catalogItem?.normalRange || 'N/A',
        unit: catalogItem?.unit || '',
      };
    });

    createLabOrder({
      patientId: patient.id,
      patientName: patient.name,
      doctor: orderingDoctor,
      clinicalNotes,
      items,
    });

    setIsNewOrderModalOpen(false);
  };

  const handleOpenResultEntry = (order: LabOrder) => {
    setEditingItems(JSON.parse(JSON.stringify(order.items)));
    setIsResultEntryModalOpen(true);
  };

  const handleSaveResults = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    updateLabResults(selectedOrder.id, editingItems, labTech);
    setIsResultEntryModalOpen(false);
  };

  const toggleTestSelection = (testName: string) => {
    if (selectedTests.includes(testName)) {
      setSelectedTests(selectedTests.filter((t) => t !== testName));
    } else {
      setSelectedTests([...selectedTests, testName]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Signboard Service 3 Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-700 text-white font-black text-xl flex items-center justify-center shadow-xs">
            3
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                Diagnostic Laboratory Investigations
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-800">
                Signboard Service #3
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Parasitology (Malaria BF), Hematology (FBC/Hb), Serology (Widal, Hep B/C, HIV), Clinical Chemistry & Urinalysis.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewOrderModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Lab Investigation Order</span>
        </button>
      </div>

      {/* Grid: Lab Queue & Order Results Detail */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Lab Orders List */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-xs uppercase text-slate-700 tracking-wider">
              Investigation Orders ({filteredOrders.length})
            </h3>
            <div className="relative w-36">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter orders..."
                className="w-full pl-7 pr-2 py-1 text-xs bg-slate-50 border rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            {filteredOrders.map((ord) => {
              const isSelected = ord.id === selectedOrderId;
              const isCompleted = ord.status === 'completed';
              return (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrderId(ord.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-300 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{ord.patientName}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-indigo-900 font-mono mt-1 font-semibold">
                    {ord.orderNumber} • {ord.items.length} Tests
                  </div>

                  <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>Dr. {ord.doctor}</span>
                    <span>{ord.orderedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Lab Investigation Result Slip & Actions */}
        <div className="xl:col-span-2 space-y-4">
          {selectedOrder ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-5">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-sm">
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900">{selectedOrder.patientName}</h3>
                      <span className="text-xs text-slate-400 font-mono">({selectedOrder.patientId})</span>
                      <span className="font-mono text-xs text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-bold">
                        {selectedOrder.orderNumber}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Requested by {selectedOrder.doctor} on {selectedOrder.orderedAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openPrintReport('lab', selectedOrder)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Result Slip</span>
                  </button>

                  <button
                    onClick={() =>
                      openAiAssistant(
                        'lab-analysis',
                        `Interpret this laboratory panel for patient ${selectedOrder.patientName}:\n` +
                          selectedOrder.items
                            .map(
                              (i) =>
                                `- ${i.testName}: ${i.result || 'Pending'} (Ref: ${i.referenceRange || 'N/A'})`
                            )
                            .join('\n')
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>AI Interpretation</span>
                  </button>

                  <button
                    onClick={() => handleOpenResultEntry(selectedOrder)}
                    className="px-3.5 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    {selectedOrder.status === 'completed' ? 'Edit Findings' : 'Enter Results'}
                  </button>
                </div>
              </div>

              {/* Clinical Indication */}
              {selectedOrder.clinicalNotes && (
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs">
                  <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                    Clinical Indication / Physician Notes:
                  </span>
                  <p className="text-slate-800 mt-0.5">{selectedOrder.clinicalNotes}</p>
                </div>
              )}

              {/* Results Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                    Test Results & Reference Ranges
                  </h4>
                  {selectedOrder.labTechnician && (
                    <span className="text-xs text-slate-500 font-medium">
                      Analyzed by: <span className="font-bold text-slate-800">{selectedOrder.labTechnician}</span> ({selectedOrder.completedAt})
                    </span>
                  )}
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b">
                      <tr>
                        <th className="p-2.5">Test Name</th>
                        <th className="p-2.5">Sample Type</th>
                        <th className="p-2.5">Result</th>
                        <th className="p-2.5">Reference Range</th>
                        <th className="p-2.5">Flag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedOrder.items.map((it, idx) => (
                        <tr key={idx} className={it.isAbnormal ? 'bg-rose-50/40' : ''}>
                          <td className="p-2.5 font-bold text-slate-900">{it.testName}</td>
                          <td className="p-2.5 text-slate-500">{it.sampleType}</td>
                          <td className="p-2.5 font-mono font-bold text-slate-800">
                            {it.result || <span className="text-amber-600 italic">Pending analysis</span>}
                          </td>
                          <td className="p-2.5 text-slate-500 font-mono text-[11px]">
                            {it.referenceRange || 'N/A'}
                          </td>
                          <td className="p-2.5">
                            {it.result ? (
                              it.isAbnormal ? (
                                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-bold text-[10px]">
                                  ABNORMAL
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-medium text-[10px]">
                                  NORMAL
                                </span>
                              )
                            ) : (
                              <span className="text-slate-400 text-[10px]">In Lab</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border text-center text-slate-400">
              Select an investigation order.
            </div>
          )}
        </div>
      </div>

      {/* Modal: New Lab Order */}
      {isNewOrderModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsNewOrderModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 border space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-slate-900">Request Diagnostic Laboratory Investigation</h3>
            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Patient</label>
                  <select
                    value={orderPatientId}
                    onChange={(e) => setOrderPatientId(e.target.value)}
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
                  <label className="font-semibold text-slate-700 block mb-1">Requesting Doctor</label>
                  <input
                    type="text"
                    value={orderingDoctor}
                    onChange={(e) => setOrderingDoctor(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Clinical Indication / Suspected Diagnosis</label>
                <input
                  type="text"
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50 outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-2">
                  Select Investigations to Run ({selectedTests.length} selected):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto p-1 border border-slate-200 rounded-xl">
                  {LAB_TEST_CATALOG.map((test) => {
                    const isChecked = selectedTests.includes(test.name);
                    return (
                      <div
                        key={test.id}
                        onClick={() => toggleTestSelection(test.name)}
                        className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-start justify-between ${
                          isChecked
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div>
                          <div>{test.name}</div>
                          <div className="text-[10px] text-slate-500 font-normal">
                            {test.category} • {formatMoney(test.priceNLE)}
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center mt-0.5 ${
                            isChecked ? 'bg-indigo-700 text-white' : 'border border-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedTests.length === 0}
                  className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 disabled:opacity-50 text-white rounded-xl font-bold"
                >
                  Submit Lab Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Enter Results */}
      {isResultEntryModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsResultEntryModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 border space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-slate-900">Enter Findings & Results</h3>
            <form onSubmit={handleSaveResults} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Testing Technician</label>
                <input
                  type="text"
                  value={labTech}
                  onChange={(e) => setLabTech(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-slate-50"
                  required
                />
              </div>

              <div className="space-y-3 border-t pt-3">
                {editingItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-800">{item.testName}</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">
                          Result Value
                        </label>
                        <input
                          type="text"
                          value={item.result || ''}
                          onChange={(e) => {
                            const copy = [...editingItems];
                            copy[idx].result = e.target.value;
                            setEditingItems(copy);
                          }}
                          placeholder="e.g. Positive +++, 11.2 g/dL, Negative"
                          className="w-full p-2 border rounded-lg bg-white font-mono"
                          required
                        />
                      </div>
                      <div className="flex items-center gap-4 pt-4">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.isAbnormal || false}
                            onChange={(e) => {
                              const copy = [...editingItems];
                              copy[idx].isAbnormal = e.target.checked;
                              setEditingItems(copy);
                            }}
                            className="rounded text-rose-600"
                          />
                          <span className="font-bold text-rose-700">Flag as Abnormal</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsResultEntryModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold"
                >
                  Save & Validate Lab Results
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
