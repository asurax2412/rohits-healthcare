import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  Users, 
  FileText, 
  Calendar, 
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  User
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalPrescriptions: 0,
    todayPrescriptions: 0
  });
  const [recentPrescriptions, setRecentPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, prescriptionsRes] = await Promise.all([
        api.get('/prescriptions/stats/dashboard'),
        api.get('/prescriptions?limit=5')
      ]);
      setStats(statsRes.data);
      setRecentPrescriptions(prescriptionsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
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

  return (
    <DashboardLayout title="Dashboard">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-medical-teal to-medical-navy rounded-2xl p-8 text-white mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-heading font-bold mb-2">Welcome back, {user?.name}! 👋</h2>
            <p className="text-white/80">Here's what's happening with your practice today.</p>
          </div>
          <Link
            to="/prescription/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-medical-navy rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Prescription
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-100 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12%
            </span>
          </div>
          <p className="text-3xl font-heading font-bold text-gray-800 mb-1">{stats.totalPatients}</p>
          <p className="text-gray-500">Total Patients</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +8%
            </span>
          </div>
          <p className="text-3xl font-heading font-bold text-gray-800 mb-1">{stats.totalPrescriptions}</p>
          <p className="text-gray-500">Prescriptions</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-heading font-bold text-gray-800 mb-1">{stats.todayPrescriptions}</p>
          <p className="text-gray-500">Today's Prescriptions</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 card-hover">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-heading font-bold text-gray-800 mb-1">24/7</p>
          <p className="text-gray-500">Available Support</p>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-heading font-bold text-gray-800 mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <Link
              to="/prescription/new"
              className="flex items-center justify-between p-4 rounded-xl bg-medical-teal/5 hover:bg-medical-teal/10 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-medical-teal flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-700">Write Prescription</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-medical-teal transition-colors" />
            </Link>

            <Link
              to="/patients"
              className="flex items-center justify-between p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-700">Manage Patients</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </Link>

            <Link
              to="/prescriptions"
              className="flex items-center justify-between p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-700">View History</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
            </Link>
          </div>
        </div>

        {/* Recent Prescriptions */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-heading font-bold text-gray-800">Recent Prescriptions</h3>
            <Link to="/prescriptions" className="text-sm text-medical-teal font-medium hover:underline">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-medical-teal border-t-transparent"></div>
            </div>
          ) : recentPrescriptions.length > 0 ? (
            <div className="space-y-4">
              {recentPrescriptions.map((prescription) => (
                <Link
                  key={prescription._id}
                  to={`/prescription/${prescription._id}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-medical-teal/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-medical-teal" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{prescription.patient?.name || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">{prescription.chiefComplaints || 'No complaints listed'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-600">{formatDate(prescription.createdAt)}</p>
                    <p className="text-xs text-gray-400">{prescription.medicines?.length || 0} medicines</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No prescriptions yet</p>
              <Link
                to="/prescription/new"
                className="inline-flex items-center gap-2 mt-4 text-medical-teal font-medium hover:underline"
              >
                <Plus className="w-4 h-4" />
                Create your first prescription
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

