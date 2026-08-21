import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Activity,
  FileText,
  FlaskConical,
  Pill,
  BedDouble,
  Receipt,
  Plus,
  Clock,
  Sparkles
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext';
import { Patient } from '../../types';

export const PatientRegistryView: React.FC = () => {
  const {
    patients,
    selectedPatientId,
    setSelectedPatientId,
    addPatient,
    setActiveTab,
    openAiAssistant,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);

  // New Patient Form
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [phone, setPhone] = useState<string>('+232 77-');
  const [address, setAddress] = useState<string>('Bo City, Sierra Leone');
  const [bloodGroup, setBloodGroup] = useState<string>('O+');
  const [genotype, setGenotype] = useState<string>('AA');
  const [allergies, setAllergies] = useState<string>('None known');
  const [nextOfKin, setNextOfKin] = useState<string>('');
  const [kinPhone, setKinPhone] = useState<string>('+232 ');

  const filteredPatients = patients.filter((p) => {
    if (!searchQuery) return true;
    return (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newP = addPatient({
      name,
      age,
      gender,
      phone,
      address,
      bloodGroup,
      genotype,
      allergies: allergies ? allergies.split(',').map((a) => a.trim()) : [],
      status: 'Outpatient',
      emergencyContact: {
        name: nextOfKin || 'Family Member',
        relationship: 'Next of Kin',
        phone: kinPhone || phone,
      },
    });

    setIsRegisterModalOpen(false);
    // Reset
    setName('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white font-black text-xl flex items-center justify-center shadow-xs">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                Electronic Health Records (EHR) Patient Directory
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-teal-100 text-teal-800">
                {patients.length} Registered Patients
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive medical history, blood phenotypes, allergy registers, ward assignments, and direct clinical orders.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Main Grid: Directory & EHR Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Search & Patient List */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, phone..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-600 focus:bg-white"
            />
          </div>

          <div className="space-y-2">
            {filteredPatients.map((p) => {
              const isSelected = p.id === selectedPatientId;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatientId(p.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 border-teal-300 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{p.name}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                        p.status === 'Inpatient'
                          ? 'bg-amber-100 text-amber-800'
                          : p.status === 'Emergency'
                          ? 'bg-red-100 text-red-800 font-bold'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 mt-1">
                    {p.id} • {p.age}yo {p.gender} • Blood: {p.bloodGroup}
                  </div>

                  <div className="text-[10px] text-slate-400 mt-1 truncate">
                    {p.address} • {p.phone}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Comprehensive Patient EHR Profile */}
        <div className="xl:col-span-2 space-y-4">
          {selectedPatient ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-5">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white font-bold text-lg flex items-center justify-center shadow-xs">
                    {selectedPatient.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-slate-900">{selectedPatient.name}</h3>
                      <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {selectedPatient.id}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                      <span>{selectedPatient.age} years old</span>
                      <span>•</span>
                      <span>{selectedPatient.gender}</span>
                      <span>•</span>
                      <span>Registered: {selectedPatient.registeredAt}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Clinical Order Hub */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setActiveTab('laboratory')}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-lg text-xs font-bold transition-colors"
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>Order Lab</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('pharmacy')}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Pill className="w-3.5 h-3.5" />
                    <span>Prescribe</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('admission')}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold transition-colors"
                  >
                    <BedDouble className="w-3.5 h-3.5" />
                    <span>Admit</span>
                  </button>
                  <button
                    onClick={() => openAiAssistant('differential-diagnosis')}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>AI Dx</span>
                  </button>
                </div>
              </div>

              {/* Demographics & Clinical Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Phone Contact</span>
                  <span className="font-bold text-slate-900">{selectedPatient.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Blood Group & Genotype</span>
                  <span className="font-bold text-teal-800">{selectedPatient.bloodGroup} / {selectedPatient.genotype}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Location / Bed</span>
                  <span className="font-bold text-slate-900">{selectedPatient.currentWardBed || 'Outpatient'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Next of Kin</span>
                  <span className="font-bold text-slate-900">{selectedPatient.emergencyContact.name} ({selectedPatient.emergencyContact.phone})</span>
                </div>
              </div>

              {/* Known Allergies */}
              <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-xl text-xs">
                <span className="text-[10px] text-rose-800 font-bold uppercase block mb-1">
                  Documented Drug & Food Allergies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPatient.allergies.length > 0 ? (
                    selectedPatient.allergies.map((alg, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 bg-white border border-rose-300 text-rose-900 rounded-md font-bold text-xs shadow-2xs"
                      >
                        ⚠️ {alg}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 italic">No known drug allergies reported (NKDA).</span>
                  )}
                </div>
              </div>

              {/* Address and Residential Details */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
                <span><span className="font-bold">Residential Address:</span> {selectedPatient.address}</span>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border text-center text-slate-400">
              Select a patient from the directory.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Register Patient */}
      {isRegisterModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsRegisterModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 border space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-teal-700" />
              Register Patient into Hospital EHR
            </h3>
            <form onSubmit={handleRegisterPatient} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sahr Thomas"
                  className="w-full p-2.5 border rounded-xl bg-slate-50 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Address / Section (Bo City)</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 font-bold"
                  >
                    <option value="O+">O Positive (O+)</option>
                    <option value="O-">O Negative (O-)</option>
                    <option value="A+">A Positive (A+)</option>
                    <option value="A-">A Negative (A-)</option>
                    <option value="B+">B Positive (B+)</option>
                    <option value="B-">B Negative (B-)</option>
                    <option value="AB+">AB Positive (AB+)</option>
                    <option value="AB-">AB Negative (AB-)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Genotype</label>
                  <select
                    value={genotype}
                    onChange={(e) => setGenotype(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-slate-50 font-bold"
                  >
                    <option value="AA">AA (Normal)</option>
                    <option value="AS">AS (Sickle Trait)</option>
                    <option value="SS">SS (Sickle Cell Disease)</option>
                    <option value="AC">AC</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Known Allergies (Comma-separated)</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, Sulfa drugs, Aspirin"
                  className="w-full p-2.5 border rounded-xl bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 border-t pt-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Next of Kin Name</label>
                  <input
                    type="text"
                    value={nextOfKin}
                    onChange={(e) => setNextOfKin(e.target.value)}
                    placeholder="e.g. Aminata Conteh"
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kin Phone</label>
                  <input
                    type="text"
                    value={kinPhone}
                    onChange={(e) => setKinPhone(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold"
                >
                  Save & Register Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
