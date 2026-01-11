import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';
import { 
  Search, 
  FileText, 
  Calendar,
  User,
  Eye,
  Pill,
  Plus
} from 'lucide-react';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await api.get('/prescriptions');
      setPrescriptions(response.data);
    } catch (error) {
      console.error('Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredPrescriptions = prescriptions.filter(p =>
    p.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.chiefComplaints?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout title="Prescriptions">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient, complaints, diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-medical-teal focus:ring-2 focus:ring-medical-teal/20"
          />
        </div>
        <Link
          to="/prescription/new"
          className="flex items-center gap-2 px-6 py-3 bg-medical-teal text-white rounded-xl font-semibold hover:bg-opacity-90 transition-all"
        >
          <Plus className="w-5 h-5" />
          New Prescription
        </Link>
      </div>

      {/* Prescriptions List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-medical-teal border-t-transparent"></div>
        </div>
      ) : filteredPrescriptions.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Patient</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Complaints</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Medicines</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPrescriptions.map((prescription) => (
                  <tr key={prescription._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-medical-teal/10 flex items-center justify-center text-medical-teal font-semibold">
                          {prescription.patient?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{prescription.patient?.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">
                            {prescription.patient?.age} yrs, {prescription.patient?.gender}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700 max-w-xs truncate">
                        {prescription.chiefComplaints || 'No complaints listed'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{prescription.medicines?.length || 0} medicines</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(prescription.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/prescription/${prescription._id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-medical-teal/10 text-medical-teal font-medium hover:bg-medical-teal/20 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-heading font-bold text-gray-600 mb-2">No prescriptions found</h3>
          <p className="text-gray-500 mb-6">Create your first prescription to get started</p>
          <Link
            to="/prescription/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-medical-teal text-white rounded-xl font-semibold hover:bg-opacity-90 transition-all"
          >
            <Plus className="w-5 h-5" />
            New Prescription
          </Link>
        </div>
      )}

      {/* Mobile Cards View */}
      {!loading && filteredPrescriptions.length > 0 && (
        <div className="md:hidden space-y-4 mt-6">
          {filteredPrescriptions.map((prescription) => (
            <Link
              key={prescription._id}
              to={`/prescription/${prescription._id}`}
              className="block bg-white rounded-xl p-4 border border-gray-100 card-hover"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-medical-teal/10 flex items-center justify-center text-medical-teal font-semibold">
                    {prescription.patient?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{prescription.patient?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">
                      {prescription.patient?.age} yrs, {prescription.patient?.gender}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{formatDate(prescription.createdAt)}</span>
              </div>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {prescription.chiefComplaints || 'No complaints listed'}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Pill className="w-4 h-4" />
                {prescription.medicines?.length || 0} medicines
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Prescriptions;

