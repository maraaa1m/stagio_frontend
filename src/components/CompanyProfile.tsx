import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  ClipboardList,
  Briefcase,
  User,
  LogOut,
  Bell,
  Camera,
  Globe,
  Phone,
  MapPin,
  Save,
  Loader2,
  FileText,
  Building2,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'sonner';
import { ALGERIA_WILAYAS } from '../constants';

interface CompanyProfileData {
  companyName: string;
  email: string;
  description: string;
  logo: string | null;
  location: string;
  website: string;
  phoneNumber: string;
  isApproved: boolean;
}

const CompanyProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile]     = useState<CompanyProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving]   = useState(false);
  const [formData, setFormData]   = useState({
    companyName: '',
    description: '',
    location:    '',
    website:     '',
    phoneNumber: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('access_token');
      if (!token) { navigate('/login'); return; }

      try {
        const res = await axios.get('/api/company/profile/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const p: CompanyProfileData = res.data;
        setProfile(p);
        setFormData({
          companyName: p.companyName || '',
          description: p.description || '',
          location:    p.location    || '',
          website:     p.website     || '',
          phoneNumber: p.phoneNumber || '',
        });
      } catch (err) {
        toast.error('Failed to load company profile.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    setIsSaving(true);
    const token = localStorage.getItem('access_token');
    try {
      await axios.put('/api/company/update/', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Profile updated successfully!');
      setProfile(prev => prev ? { ...prev, ...formData } : prev);
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const formDataObj = new FormData();
    formDataObj.append('logo', e.target.files[0]);
    const token = localStorage.getItem('access_token');
    try {
      const res = await axios.post('/api/company/logo/upload/', formDataObj, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Logo updated!');
      setProfile(prev => prev ? { ...prev, logo: res.data.url } : prev);
    } catch {
      toast.error('Failed to upload logo.');
    }
  };

  const handleSignOut = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-navy-900">
      <Toaster position="top-right" richColors />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-[#060D1F] text-white flex flex-col z-50 border-r border-white/5">
        <div className="p-10">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-3 h-3 rounded-full bg-blue-600 group-hover:scale-125 transition-transform duration-500" />
            <span className="font-bold text-2xl tracking-tighter">Stag<span className="text-blue-600">.io</span></span>
          </Link>
        </div>
        <nav className="flex-1 px-6 space-y-1.5">
          <div className="pb-4 px-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Main Menu</p>
          </div>
          <Link to="/company/dashboard" className="flex items-center gap-4 px-4 py-3.5 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl text-[13px] font-bold tracking-wide transition-all group">
            <LayoutDashboard size={18} className="group-hover:scale-110 transition-transform" />
            Dashboard
          </Link>
          <Link to="/company/applications" className="flex items-center gap-4 px-4 py-3.5 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl text-[13px] font-bold tracking-wide transition-all group">
            <ClipboardList size={18} className="group-hover:scale-110 transition-transform" />
            Applications
          </Link>
          <Link to="/company/offers" className="flex items-center gap-4 px-4 py-3.5 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl text-[13px] font-bold tracking-wide transition-all group">
            <Briefcase size={18} className="group-hover:scale-110 transition-transform" />
            Manage Offers
          </Link>
          <div className="pt-8 pb-4 px-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">Account</p>
          </div>
          <Link to="/company/profile" className="flex items-center gap-4 px-4 py-3.5 bg-blue-600 rounded-2xl text-[13px] font-bold tracking-wide transition-all shadow-lg shadow-blue-600/20 group">
            <User size={18} className="group-hover:scale-110 transition-transform" />
            Company Profile
          </Link>
        </nav>
        <div className="p-8 border-t border-white/5">
          <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-3 py-3.5 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border border-white/5">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 min-h-screen">
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-12 sticky top-0 z-40">
          <div>
            <h2 className="text-2xl font-display font-bold text-navy-900 tracking-tight">Company Profile</h2>
            <p className="text-[11px] font-bold uppercase tracking-widest text-navy-900/30 mt-1">Manage your company identity</p>
          </div>
          <button className="relative p-3 bg-paper rounded-2xl text-navy-900/40 hover:text-blue-600 hover:bg-blue-50 transition-all border border-gray-100">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white" />
          </button>
        </header>

        <div className="p-12 space-y-12 max-w-5xl mx-auto">

          {/* Approval banner */}
          {profile && !profile.isApproved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-orange-500 text-white p-8 rounded-[3rem] flex items-center gap-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <FileText size={28} />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl mb-1">Awaiting Admin Approval</h3>
                <p className="text-white/80 font-medium text-sm">Your account is under review. You can update your profile now — offers will be unlocked once approved.</p>
              </div>
            </motion.div>
          )}

          {/* Hero card */}
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-premium flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-600/5 to-transparent pointer-events-none" />

            <div className="relative group">
              <div className="w-32 h-32 rounded-[2.5rem] bg-navy-900 text-white flex items-center justify-center font-bold text-4xl shadow-2xl shadow-navy-900/20 overflow-hidden">
                {profile?.logo
                  ? <img src={profile.logo} alt="Logo" className="w-full h-full object-cover" />
                  : <Building2 size={48} className="opacity-40" />
                }
              </div>
              <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center cursor-pointer hover:bg-navy-900 transition-all shadow-lg shadow-blue-600/20 border-2 border-white">
                <Camera size={18} />
                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
              </label>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-display font-bold text-navy-900 tracking-tight">{profile?.companyName}</h1>
              <p className="text-navy-900/40 font-bold uppercase tracking-widest text-[11px] mt-1">{profile?.email}</p>
              <div className="mt-4 flex items-center gap-2">
                <div className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border ${profile?.isApproved ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                  {profile?.isApproved ? 'Approved' : 'Pending Approval'}
                </div>
              </div>
            </div>
          </div>

          {/* Form grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
              <h3 className="text-xl font-display font-bold text-navy-900 tracking-tight">Company Details</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-navy-900/30 ml-4">Company Name</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-navy-900/30 group-focus-within:text-blue-600 transition-colors"><Building2 size={16} /></div>
                    <input type="text" value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full bg-paper border border-gray-100 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-blue-600/30 focus:ring-4 focus:ring-blue-600/5 transition-all font-medium text-navy-900" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-navy-900/30 ml-4">Phone Number</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-navy-900/30 group-focus-within:text-blue-600 transition-colors"><Phone size={16} /></div>
                    <input type="text" value={formData.phoneNumber} onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} placeholder="021 00 00 00"
                      className="w-full bg-paper border border-gray-100 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-blue-600/30 focus:ring-4 focus:ring-blue-600/5 transition-all font-medium text-navy-900" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-navy-900/30 ml-4">Location (Wilaya)</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-navy-900/30 group-focus-within:text-blue-600 transition-colors"><MapPin size={16} /></div>
                    <select value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-paper border border-gray-100 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-blue-600/30 focus:ring-4 focus:ring-blue-600/5 transition-all font-medium text-navy-900 appearance-none cursor-pointer">
                      <option value="">Select Wilaya</option>
                      {ALGERIA_WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-navy-900/30 ml-4">Website</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-navy-900/30 group-focus-within:text-blue-600 transition-colors"><Globe size={16} /></div>
                    <input type="text" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} placeholder="https://company.com"
                      className="w-full bg-paper border border-gray-100 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-blue-600/30 focus:ring-4 focus:ring-blue-600/5 transition-all font-medium text-navy-900" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
              <h3 className="text-xl font-display font-bold text-navy-900 tracking-tight">About</h3>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-navy-900/30 ml-4">Company Description</label>
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your company, mission, and culture..."
                  rows={10}
                  className="w-full bg-paper border border-gray-100 rounded-3xl py-6 px-8 outline-none focus:border-blue-600/30 focus:ring-4 focus:ring-blue-600/5 transition-all font-medium text-navy-900 resize-none" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button onClick={handleSave} disabled={isSaving}
              className="px-12 py-4 bg-[#060D1F] text-white rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-navy-900/10 flex items-center gap-3 active:scale-95">
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyProfile;