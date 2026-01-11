import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Trash2, 
  User, 
  Search,
  Pill,
  Stethoscope,
  Activity,
  Calendar,
  FileText,
  Save,
  X
} from 'lucide-react';

const NewPrescription = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPatientId = searchParams.get('patient');

  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const [prescription, setPrescription] = useState({
    patient: null,
    chiefComplaints: '',
    symptoms: [''],
    vitals: {
      temperature: '',
      bloodPressure: '',
      pulse: '',
      weight: '',
      spo2: ''
    },
    diagnosis: '',
    history: '',
    medicines: [{
      name: '',
      dosage: '',
      frequency: 'OD',
      duration: '',
      instructions: ''
    }],
    tests: [''],
    advice: '',
    followUpDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (preselectedPatientId && patients.length > 0) {
      const patient = patients.find(p => p._id === preselectedPatientId);
      if (patient) {
        setPrescription(prev => ({ ...prev, patient }));
      }
    }
  }, [preselectedPatientId, patients]);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Failed to fetch patients');
    }
  };

  const handlePatientSelect = (patient) => {
    setPrescription(prev => ({ ...prev, patient }));
    setSearchTerm('');
    setShowPatientDropdown(false);
  };

  const addMedicine = () => {
    setPrescription(prev => ({
      ...prev,
      medicines: [...prev.medicines, { name: '', dosage: '', frequency: 'OD', duration: '', instructions: '' }]
    }));
  };

  const removeMedicine = (index) => {
    setPrescription(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index)
    }));
  };

  const updateMedicine = (index, field, value) => {
    setPrescription(prev => ({
      ...prev,
      medicines: prev.medicines.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const addSymptom = () => {
    setPrescription(prev => ({
      ...prev,
      symptoms: [...prev.symptoms, '']
    }));
  };

  const updateSymptom = (index, value) => {
    setPrescription(prev => ({
      ...prev,
      symptoms: prev.symptoms.map((s, i) => i === index ? value : s)
    }));
  };

  const removeSymptom = (index) => {
    setPrescription(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter((_, i) => i !== index)
    }));
  };

  const addTest = () => {
    setPrescription(prev => ({
      ...prev,
      tests: [...prev.tests, '']
    }));
  };

  const updateTest = (index, value) => {
    setPrescription(prev => ({
      ...prev,
      tests: prev.tests.map((t, i) => i === index ? value : t)
    }));
  };

  const removeTest = (index) => {
    setPrescription(prev => ({
      ...prev,
      tests: prev.tests.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prescription.patient) {
      toast.error('Please select a patient');
      return;
    }

    if (!prescription.medicines.some(m => m.name.trim())) {
      toast.error('Please add at least one medicine');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        patient: prescription.patient._id,
        chiefComplaints: prescription.chiefComplaints,
        symptoms: prescription.symptoms.filter(s => s.trim()),
        vitals: prescription.vitals,
        diagnosis: prescription.diagnosis,
        history: prescription.history,
        medicines: prescription.medicines.filter(m => m.name.trim()),
        tests: prescription.tests.filter(t => t.trim()),
        advice: prescription.advice,
        followUpDate: prescription.followUpDate || undefined,
        notes: prescription.notes
      };

      const response = await api.post('/prescriptions', payload);
      toast.success('Prescription created successfully');
      navigate(`/prescription/${response.data.prescription._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone?.includes(searchTerm)
  );

  const frequencyOptions = [
    { value: 'OD', label: 'OD (Once Daily)' },
    { value: 'BD', label: 'BD (Twice Daily)' },
    { value: 'TDS', label: 'TDS (Thrice Daily)' },
    { value: 'QID', label: 'QID (Four Times)' },
    { value: 'SOS', label: 'SOS (As Needed)' },
    { value: 'HS', label: 'HS (At Bedtime)' },
    { value: 'AC', label: 'AC (Before Meals)' },
    { value: 'PC', label: 'PC (After Meals)' },
  ];

  return (
    <DashboardLayout title="New Prescription">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8">
        
        {/* Patient Selection */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-heading font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-medical-teal" />
            Patient Information
          </h3>

          {prescription.patient ? (
            <div className="flex items-center justify-between p-4 bg-medical-teal/5 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-medical-teal to-medical-navy flex items-center justify-center text-white font-bold text-xl">
                  {prescription.patient.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{prescription.patient.name}</p>
                  <p className="text-sm text-gray-500">
                    {prescription.patient.age} yrs, {prescription.patient.gender}
                    {prescription.patient.phone && ` • ${prescription.patient.phone}`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPrescription(prev => ({ ...prev, patient: null }))}
                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search patient by name or phone..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowPatientDropdown(true);
                }}
                onFocus={() => setShowPatientDropdown(true)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-medical-teal"
              />
              
              {showPatientDropdown && searchTerm && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border shadow-lg max-h-60 overflow-y-auto z-10">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map(patient => (
                      <button
                        key={patient._id}
                        type="button"
                        onClick={() => handlePatientSelect(patient)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-medical-teal/10 flex items-center justify-center text-medical-teal font-semibold">
                          {patient.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{patient.name}</p>
                          <p className="text-sm text-gray-500">{patient.age} yrs, {patient.gender}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="p-4 text-center text-gray-500">No patients found</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chief Complaints & Symptoms */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-heading font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-medical-teal" />
            Chief Complaints
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chief Complaints (C/O)</label>
              <textarea
                value={prescription.chiefComplaints}
                onChange={(e) => setPrescription(prev => ({ ...prev, chiefComplaints: e.target.value }))}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-medical-teal resize-none"
                placeholder="e.g., Fever - 102°, Sore throat, Headaches"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
              <div className="space-y-3">
                {prescription.symptoms.map((symptom, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={symptom}
                      onChange={(e) => updateSymptom(index, e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:border-medical-teal"
                      placeholder="Enter symptom"
                    />
                    {prescription.symptoms.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSymptom(index)}
                        className="p-2.5 rounded-lg text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSymptom}
                  className="inline-flex items-center gap-2 text-sm text-medical-teal font-medium hover:underline"
                >
                  <Plus className="w-4 h-4" /> Add symptom
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">History (H/O)</label>
              <textarea
                value={prescription.history}
                onChange={(e) => setPrescription(prev => ({ ...prev, history: e.target.value }))}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-medical-teal resize-none"
                placeholder="e.g., Body pain from past 3 days, Recurrent fever"
              />
            </div>
          </div>
        </div>

        {/* Vitals */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-heading font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-medical-teal" />
            Vitals
          </h3>

          <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Temperature</label>
              <input
                type="text"
                value={prescription.vitals.temperature}
                onChange={(e) => setPrescription(prev => ({ 
                  ...prev, 
                  vitals: { ...prev.vitals, temperature: e.target.value } 
                }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-medical-teal"
                placeholder="e.g., 102°F"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blood Pressure</label>
              <input
                type="text"
                value={prescription.vitals.bloodPressure}
                onChange={(e) => setPrescription(prev => ({ 
                  ...prev, 
                  vitals: { ...prev.vitals, bloodPressure: e.target.value } 
                }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-medical-teal"
                placeholder="e.g., 120/80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pulse</label>
              <input
                type="text"
                value={prescription.vitals.pulse}
                onChange={(e) => setPrescription(prev => ({ 
                  ...prev, 
                  vitals: { ...prev.vitals, pulse: e.target.value } 
                }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-medical-teal"
                placeholder="e.g., 72 bpm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
              <input
                type="text"
                value={prescription.vitals.weight}
                onChange={(e) => setPrescription(prev => ({ 
                  ...prev, 
                  vitals: { ...prev.vitals, weight: e.target.value } 
                }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-medical-teal"
                placeholder="e.g., 70 kg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SpO2</label>
              <input
                type="text"
                value={prescription.vitals.spo2}
                onChange={(e) => setPrescription(prev => ({ 
                  ...prev, 
                  vitals: { ...prev.vitals, spo2: e.target.value } 
                }))}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-medical-teal"
                placeholder="e.g., 98%"
              />
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-heading font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-medical-teal" />
            Diagnosis
          </h3>
          <textarea
            value={prescription.diagnosis}
            onChange={(e) => setPrescription(prev => ({ ...prev, diagnosis: e.target.value }))}
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-medical-teal resize-none"
            placeholder="Enter diagnosis..."
          />
        </div>

        {/* Medicines (Rx) */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-heading font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Pill className="w-5 h-5 text-medical-teal" />
            Prescription (Rx)
          </h3>

          <div className="space-y-4">
            {prescription.medicines.map((medicine, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-500">Medicine #{index + 1}</span>
                  {prescription.medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedicine(index)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      value={medicine.name}
                      onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-medical-teal"
                      placeholder="Medicine name (e.g., Calpol 500mg)"
                    />
                  </div>
                  <div>
                    <select
                      value={medicine.frequency}
                      onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-medical-teal"
                    >
                      {frequencyOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={medicine.duration}
                      onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-medical-teal"
                      placeholder="Duration (e.g., 5 days)"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <input
                    type="text"
                    value={medicine.instructions}
                    onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-medical-teal"
                    placeholder="Special instructions (e.g., Take after meals)"
                  />
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addMedicine}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-gray-300 text-gray-600 hover:border-medical-teal hover:text-medical-teal transition-colors w-full justify-center"
            >
              <Plus className="w-5 h-5" />
              Add Medicine
            </button>
          </div>
        </div>

        {/* Tests & Investigations */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-heading font-bold text-gray-800 mb-4">Tests & Investigations</h3>
          <div className="space-y-3">
            {prescription.tests.map((test, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={test}
                  onChange={(e) => updateTest(index, e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:border-medical-teal"
                  placeholder="e.g., CBC, Blood Sugar, X-ray Chest"
                />
                {prescription.tests.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTest(index)}
                    className="p-2.5 rounded-lg text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addTest}
              className="inline-flex items-center gap-2 text-sm text-medical-teal font-medium hover:underline"
            >
              <Plus className="w-4 h-4" /> Add test
            </button>
          </div>
        </div>

        {/* Advice & Follow-up */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-heading font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-medical-teal" />
            Advice & Follow-up
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Advice</label>
              <textarea
                value={prescription.advice}
                onChange={(e) => setPrescription(prev => ({ ...prev, advice: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-medical-teal resize-none"
                placeholder="e.g., Rest for a week, Drink plenty of fluids, Avoid spicy food"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date</label>
                <input
                  type="date"
                  value={prescription.followUpDate}
                  onChange={(e) => setPrescription(prev => ({ ...prev, followUpDate: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-medical-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <input
                  type="text"
                  value={prescription.notes}
                  onChange={(e) => setPrescription(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-medical-teal"
                  placeholder="Any additional notes"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-4 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-medical-teal text-white font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                Create Prescription
              </>
            )}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default NewPrescription;

