import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Filter
} from 'lucide-react';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [stats, setStats] = useState({ total: 0, pending: 0, todayCount: 0, confirmed: 0 });

  useEffect(() => {
    fetchAppointments();
    fetchStats();
  }, [filter, dateFilter]);

  const fetchAppointments = async () => {
    try {
      let url = '/appointments';
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);
      if (dateFilter) params.append('date', dateFilter);
      if (params.toString()) url += `?${params.toString()}`;

      const response = await api.get(url);
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/appointments/stats/overview');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      toast.success(`Appointment ${status}`);
      fetchAppointments();
      fetchStats();
    } catch (error) {
      toast.error('Failed to update appointment');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <DashboardLayout title="Appointments">
      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-2xl font-bold text-gray-800">{stats.todayCount}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:border-medical-teal"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 focus:border-medical-teal"
        />
        {dateFilter && (
          <button
            onClick={() => setDateFilter('')}
            className="text-sm text-medical-teal hover:underline"
          >
            Clear date
          </button>
        )}
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-medical-teal border-t-transparent"></div>
        </div>
      ) : appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="bg-white rounded-xl p-6 border border-gray-100 card-hover">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Patient Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-medical-teal/10 flex items-center justify-center text-medical-teal font-semibold">
                    {appointment.patientName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{appointment.patientName}</h3>
                    <p className="text-sm text-gray-500">
                      {appointment.patientAge} yrs, {appointment.patientGender}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      {appointment.patientPhone}
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="flex flex-wrap gap-4 lg:gap-8">
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium text-gray-800">{formatDate(appointment.appointmentDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-medium text-gray-800">{appointment.appointmentTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Reason</p>
                    <p className="font-medium text-gray-800">{appointment.reason}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {appointment.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(appointment._id, 'confirmed')}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Confirm
                    </button>
                    <button
                      onClick={() => updateStatus(appointment._id, 'cancelled')}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
                {appointment.status === 'confirmed' && (
                  <button
                    onClick={() => updateStatus(appointment._id, 'completed')}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Complete
                  </button>
                )}
              </div>

              {appointment.symptoms && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">Symptoms:</p>
                  <p className="text-gray-700">{appointment.symptoms}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-heading font-bold text-gray-600 mb-2">No appointments found</h3>
          <p className="text-gray-500">
            {filter !== 'all' || dateFilter 
              ? 'Try changing the filters' 
              : 'Appointments will appear here when patients book'}
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Appointments;

