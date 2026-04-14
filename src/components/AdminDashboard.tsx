import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  BarChart3,
  LogOut,
  Bell,
  Users,
  Briefcase,
  CheckCircle2,
  X,
  Loader2,
  AlertCircle,
  MapPin,
  TrendingUp,
  FileText,
  User,
  Calendar,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'sonner';

interface AdminStats {
  totalStudents: number;
  placedStudents: number;
  unplacedStudents: number;
  totalCompanies: number;
  totalOffers: number;
  pendingApplications: number;
  acceptedApplications: number;
}

interface PendingCompany {
  id: number;
  companyName: string;
  email: string;
  location: string;
  description: string;
  website: string;
}

interface PendingValidation {
  id: number;           // application ID
  student: string;      // "firstName lastName"
  company: string;
  offer: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingCompanies, setPendingCompanies] = useState<PendingCompany[]>([]);
  const [pendingValidations, setPendingValidations] = useState<PendingValidation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState<number | null>(null);

  const [validationModal, setValidationModal] = useState<{
    isOpen: boolean;
    validation: PendingValidation | null;
  }>({ isOpen: false, validation: null });

  const fetchData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('access_token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [statsRes, companiesRes, validationsRes] = await Promise.all([
        axios.get('/api/admin/statistics/', { headers }),
        axios.get('/api/admin/companies/pending/', { headers }),
        // Correct endpoint: pending-validations = ACCEPTED applications awaiting admin
        axios.get('/api/admin/pending-validations/', { headers }),
      ]);

      const s = statsRes.data;
      setStats({
        totalStudents: s.total_students || 0,
        placedStudents: s.placed_students || 0,
        unplacedStudents: s.unplaced_students || 0,
        totalCompanies: s.total_companies || 0,
        totalOffers: s.total_offers || 0,
        pendingApplications: s.pending_applications || 0,
        acceptedApplications: s.accepted_applications || 0,
      });

      setPendingCompanies(
        Array.isArray(companiesRes.data) ? companiesRes.data : (companiesRes.data?.companies || [])
      );

      // Backend returns: [{ id, student, company, offer }]
      setPendingValidations(
        Array.isArray(validationsRes.data) ? validationsRes.data : (validationsRes.data?.applications || [])
      );
    } catch (err) {
      console.error('Error fetching admin data:', err);
      toast.error('Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveCompany = async (id: number) => {
    setIsActionLoading(id);
    const token = localStorage.getItem('access_token');
    try {
      await axios.put(`/api/admin/companies/${id}/approve/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Company approved!');
      setPendingCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      toast.error('Failed to approve company.');
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleRefuseCompany = async (id: number) => {
    setIsActionLoading(id);
    const token = localStorage.getItem('access_token');
    try {
      await axios.put(`/api/admin/companies/${id}/refuse/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Company refused.');
      setPendingCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      toast.error('Failed to refuse company.');
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleValidateInternship = async (applicationId: number) => {
    setIsActionLoading(applicationId);
    const token = localStorage.getItem('access_token');
    try {
      // Correct endpoint: /api/admin/validate/<application_id>/
      await axios.post(
        `/api/admin/validate/${applicationId}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Internship validated and PDF generated!');
      setPendingValidations((prev) => prev.filter((v) => v.id !== applicationId));
      setValidationModal({ isOpen: false, validation: null });
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to validate internship.');
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-navy-900 selection:bg-blue-600/10 selection:text-blue-600">
      <Toaster position="top-right" richColors />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-[#060D1F] text-white flex flex-col z-50 border-r border-white/5">
        <div className="p-10">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-3 h-3 rounded-full bg-blue-600 group-hover:scale-125 transition-transform duration-500"></div>
            <span className="font-bold text-2xl tracking-tighter">Stag<span className="text-blue-600">.io</span></span>
          </Link>
        </div>
        <nav className="flex-1 px-6 space-y-1.5">
          <div className="pb-4 px-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Main Menu</p>
          </div>
          <Link to="/admin/dashboard" className="flex items-center gap-4 px-4 py-3.5 bg-blue-600 rounded-2xl text-[13px] font-bold tracking-wide transition-all shadow-lg shadow-blue-600/20 group">
            <LayoutDashboard size={18} className="group-hover:scale-110 transition-transform" />
            Dashboard
          </Link>
          <Link to="/admin/companies" className="flex items-center gap-4 px-4 py-3.5 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl text-[13px] font-bold tracking-wide transition-all group">
            <Building2 size={18} className="group-hover:scale-110 transition-transform" />
            Companies
          </Link>
          <Link to="/admin/agreements" className="flex items-center gap-4 px-4 py-3.5 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl text-[13px] font-bold tracking-wide transition-all group">
            <ClipboardList size={18} className="group-hover:scale-110 transition-transform" />
            Agreements
          </Link>
          <Link to="/admin/statistics" className="flex items-center gap-4 px-4 py-3.5 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl text-[13px] font-bold tracking-wide transition-all group">
            <BarChart3 size={18} className="group-hover:scale-110 transition-transform" />
            Statistics
          </Link>
        </nav>
        <div className="p-8 border-t border-white/5">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border border-white/5"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 min-h-screen">
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-12 sticky top-0 z-40">
          <div>
            <h2 className="text-2xl font-display font-bold text-navy-900 tracking-tight">University Admin</h2>
            <p className="text-[11px] font-bold uppercase tracking-widest text-navy-900/30 mt-1">Platform management and validation</p>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-3 bg-paper rounded-2xl text-navy-900/40 hover:text-blue-600 hover:bg-blue-50 transition-all border border-gray-100">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        <div className="p-12 space-y-12 max-w-7xl mx-auto">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {[
              { label: 'Total Students', value: stats?.totalStudents ?? 0, icon: <Users size={18} />, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Placed', value: stats?.placedStudents ?? 0, icon: <CheckCircle2 size={18} />, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Unplaced', value: stats?.unplacedStudents ?? 0, icon: <AlertCircle size={18} />, color: 'text-orange-500', bg: 'bg-orange-50' },
              { label: 'Companies', value: stats?.totalCompanies ?? 0, icon: <Building2 size={18} />, color: 'text-purple-500', bg: 'bg-purple-50' },
              { label: 'Total Offers', value: stats?.totalOffers ?? 0, icon: <Briefcase size={18} />, color: 'text-navy-900', bg: 'bg-paper' },
              { label: 'Accepted Apps', value: stats?.acceptedApplications ?? 0, icon: <ClipboardList size={18} />, color: 'text-red-500', bg: 'bg-red-50' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm"
              >
                <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-navy-900/30 mb-1">{stat.label}</p>
                  <h4 className="text-xl font-display font-bold text-navy-900 tracking-tight">{stat.value}</h4>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Pending Companies */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-display font-bold text-navy-900 tracking-tight">Awaiting Approval</h3>
                <p className="text-[11px] font-bold uppercase tracking-widest text-navy-900/30 mt-1">New company registrations</p>
              </div>
              <div className="space-y-4">
                {isLoading ? (
                  Array(2).fill(0).map((_, i) => (
                    <div key={i} className="h-32 bg-white rounded-[2.5rem] border border-gray-100 animate-pulse" />
                  ))
                ) : pendingCompanies.length === 0 ? (
                  <div className="bg-white p-12 rounded-[3rem] border border-gray-100 text-center border-dashed">
                    <p className="text-navy-900/30 font-bold uppercase tracking-widest text-[11px]">No pending companies</p>
                  </div>
                ) : (
                  pendingCompanies.map((company, i) => (
                    <motion.div
                      key={company.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-premium transition-all group"
                    >
                      <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-paper text-navy-900 flex items-center justify-center font-bold text-xl">
                            {company.companyName[0]}
                          </div>
                          <div>
                            <h4 className="text-lg font-display font-bold text-navy-900 leading-tight mb-1">{company.companyName}</h4>
                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-navy-900/30">
                              <span className="flex items-center gap-1.5"><MapPin size={12} /> {company.location}</span>
                              <span className="w-1 h-1 rounded-full bg-gray-200" />
                              <span>{company.email}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApproveCompany(company.id)}
                            disabled={isActionLoading === company.id}
                            className="w-10 h-10 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all flex items-center justify-center disabled:opacity-50"
                          >
                            {isActionLoading === company.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={18} />}
                          </button>
                          <button
                            onClick={() => handleRefuseCompany(company.id)}
                            disabled={isActionLoading === company.id}
                            className="w-10 h-10 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center disabled:opacity-50"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Pending Validations */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-display font-bold text-navy-900 tracking-tight">Pending Validations</h3>
                <p className="text-[11px] font-bold uppercase tracking-widest text-navy-900/30 mt-1">Accepted internships awaiting PDF generation</p>
              </div>
              <div className="space-y-4">
                {isLoading ? (
                  Array(2).fill(0).map((_, i) => (
                    <div key={i} className="h-40 bg-white rounded-[2.5rem] border border-gray-100 animate-pulse" />
                  ))
                ) : pendingValidations.length === 0 ? (
                  <div className="bg-white p-12 rounded-[3rem] border border-gray-100 text-center border-dashed">
                    <p className="text-navy-900/30 font-bold uppercase tracking-widest text-[11px]">No pending validations</p>
                  </div>
                ) : (
                  pendingValidations.map((v, i) => (
                    <motion.div
                      key={v.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-premium transition-all"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                            {(v.student || '?')[0].toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-navy-900">{v.student}</h4>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-navy-900/30">Application #{v.id}</p>
                          </div>
                        </div>

                        <div className="p-4 bg-paper rounded-2xl space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-navy-900/30">Internship at</p>
                          <p className="text-sm font-bold text-navy-900">{v.company}</p>
                          <p className="text-xs font-medium text-navy-900/60">{v.offer}</p>
                        </div>

                        <button
                          onClick={() => setValidationModal({ isOpen: true, validation: v })}
                          className="w-full py-3 bg-blue-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-navy-900 transition-all shadow-lg shadow-blue-600/10 flex items-center justify-center gap-2"
                        >
                          <FileText size={16} />
                          Validate & Generate PDF
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Validation Confirm Modal */}
      <AnimatePresence>
        {validationModal.isOpen && validationModal.validation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setValidationModal({ isOpen: false, validation: null })}
              className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <FileText size={32} />
              </div>
              <h3 className="text-2xl font-display font-bold text-navy-900 mb-2">Confirm Validation</h3>
              <p className="text-navy-900/50 font-medium mb-6">
                Validate internship for <span className="font-bold text-navy-900">{validationModal.validation.student}</span> at{' '}
                <span className="font-bold text-navy-900">{validationModal.validation.company}</span>?
                <br /><br />
                This will generate the internship agreement PDF and notify the student.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setValidationModal({ isOpen: false, validation: null })}
                  className="flex-1 py-4 bg-paper text-navy-900 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleValidateInternship(validationModal.validation!.id)}
                  disabled={isActionLoading !== null}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-navy-900 transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  {isActionLoading !== null ? <Loader2 size={18} className="animate-spin" /> : <FileText size={18} />}
                  Validate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
