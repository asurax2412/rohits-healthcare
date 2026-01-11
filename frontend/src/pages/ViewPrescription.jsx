import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  Printer, 
  ArrowLeft, 
  Calendar,
  Phone,
  MapPin,
  User,
  Stethoscope,
  Pill,
  FileText,
  Activity
} from 'lucide-react';

const ViewPrescription = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const printRef = useRef();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescription();
  }, [id]);

  const fetchPrescription = async () => {
    try {
      const response = await api.get(`/prescriptions/${id}`);
      setPrescription(response.data);
    } catch (error) {
      console.error('Failed to fetch prescription');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <DashboardLayout title="View Prescription">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-medical-teal border-t-transparent"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!prescription) {
    return (
      <DashboardLayout title="View Prescription">
        <div className="text-center py-20">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-heading font-bold text-gray-600 mb-2">Prescription not found</h3>
          <Link to="/prescriptions" className="text-medical-teal font-medium hover:underline">
            Back to prescriptions
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const doctor = prescription.doctor || user;
  const patient = prescription.patient;

  return (
    <DashboardLayout title="View Prescription">
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6 no-print">
        <Link
          to="/prescriptions"
          className="flex items-center gap-2 text-gray-600 hover:text-medical-teal transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Prescriptions
        </Link>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-medical-teal text-white rounded-xl font-semibold hover:bg-opacity-90 transition-all"
        >
          <Printer className="w-5 h-5" />
          Print Prescription
        </button>
      </div>

      {/* Prescription Card */}
      <div ref={printRef} className="bg-white rounded-xl border border-gray-200 overflow-hidden prescription-print max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-medical-teal to-medical-navy p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
                <Stethoscope className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold">{doctor.clinicName || "Dr. Rohit's Healthcare"}</h1>
                <p className="text-white/80">{doctor.name} - {doctor.specialization || 'General Physician'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80">Registration No.</p>
              <p className="font-semibold">{doctor.registrationNo || 'MCI-XXXXXX'}</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap gap-6 text-sm">
            {doctor.clinicAddress && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{doctor.clinicAddress}</span>
              </div>
            )}
            {doctor.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{doctor.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Patient Info & Date */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-medical-teal/10 flex items-center justify-center">
                <User className="w-7 h-7 text-medical-teal" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Patient</p>
                <p className="text-xl font-heading font-bold text-gray-800">{patient?.name}</p>
                <p className="text-gray-600">{patient?.age} years, {patient?.gender}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-gray-500 justify-end mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Date</span>
              </div>
              <p className="text-lg font-semibold text-gray-800">{formatDate(prescription.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Vitals */}
        {Object.values(prescription.vitals || {}).some(v => v) && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-medical-teal" />
              <h3 className="font-semibold text-gray-800">Vitals</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {prescription.vitals.temperature && (
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs text-gray-500">Temperature</p>
                  <p className="font-semibold text-gray-800">{prescription.vitals.temperature}</p>
                </div>
              )}
              {prescription.vitals.bloodPressure && (
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs text-gray-500">Blood Pressure</p>
                  <p className="font-semibold text-gray-800">{prescription.vitals.bloodPressure}</p>
                </div>
              )}
              {prescription.vitals.pulse && (
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs text-gray-500">Pulse</p>
                  <p className="font-semibold text-gray-800">{prescription.vitals.pulse}</p>
                </div>
              )}
              {prescription.vitals.weight && (
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs text-gray-500">Weight</p>
                  <p className="font-semibold text-gray-800">{prescription.vitals.weight}</p>
                </div>
              )}
              {prescription.vitals.spo2 && (
                <div className="bg-white p-3 rounded-lg border">
                  <p className="text-xs text-gray-500">SpO2</p>
                  <p className="font-semibold text-gray-800">{prescription.vitals.spo2}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chief Complaints */}
        {prescription.chiefComplaints && (
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Chief Complaints (C/O)</h3>
            <p className="text-gray-700">{prescription.chiefComplaints}</p>
          </div>
        )}

        {/* History */}
        {prescription.history && (
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">History (H/O)</h3>
            <p className="text-gray-700">{prescription.history}</p>
          </div>
        )}

        {/* Diagnosis */}
        {prescription.diagnosis && (
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Diagnosis</h3>
            <p className="text-gray-700">{prescription.diagnosis}</p>
          </div>
        )}

        {/* Medicines (Rx) */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Pill className="w-5 h-5 text-medical-teal" />
            <h3 className="text-lg font-heading font-bold text-gray-800">Rx (Prescription)</h3>
          </div>
          
          <div className="space-y-3">
            {prescription.medicines?.map((medicine, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-medical-teal flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <p className="font-semibold text-gray-800">{medicine.name}</p>
                    <span className="px-2 py-0.5 bg-medical-teal/10 text-medical-teal rounded text-sm font-medium">
                      {medicine.frequency}
                    </span>
                    {medicine.duration && (
                      <span className="text-gray-600 text-sm">× {medicine.duration}</span>
                    )}
                  </div>
                  {medicine.instructions && (
                    <p className="text-sm text-gray-500 mt-1">{medicine.instructions}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tests */}
        {prescription.tests?.length > 0 && prescription.tests.some(t => t) && (
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Investigations / Tests</h3>
            <div className="flex flex-wrap gap-2">
              {prescription.tests.filter(t => t).map((test, index) => (
                <span key={index} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                  {test}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Advice */}
        {prescription.advice && (
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Advice</h3>
            <p className="text-gray-700 whitespace-pre-line">{prescription.advice}</p>
          </div>
        )}

        {/* Follow-up */}
        {prescription.followUpDate && (
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Follow-up</h3>
            <div className="flex items-center gap-2 text-medical-teal">
              <Calendar className="w-5 h-5" />
              <p className="font-medium">{formatDate(prescription.followUpDate)}</p>
            </div>
          </div>
        )}

        {/* Footer / Signature */}
        <div className="p-6 bg-gray-50">
          <div className="flex justify-end">
            <div className="text-center">
              <div className="w-48 border-b-2 border-gray-400 mb-2 pb-12"></div>
              <p className="font-semibold text-gray-800">{doctor.name}</p>
              <p className="text-sm text-gray-500">{doctor.specialization || 'General Physician'}</p>
              {doctor.registrationNo && (
                <p className="text-xs text-gray-400">Reg. No: {doctor.registrationNo}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .prescription-print, .prescription-print * {
            visibility: visible;
          }
          .prescription-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default ViewPrescription;

