import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  FiUser, FiMail, FiEdit3, FiSave, FiCheckCircle,
  FiGlobe, FiAward, FiInfo, FiCamera
} from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { userApi } from '../../api/userApi.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';
import usePageTitle from '../../hooks/usePageTitle.jsx';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  usePageTitle('My Profile | RecipeHub');

  const [form, setForm] = useState({ name: '', email: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [stats, setStats] = useState({ recipes: 0, favorites: 0 });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user?.userId) return;

    setLoading(true);

    // Load profile data and dashboard stats in parallel
    Promise.all([
      userApi.getProfile(user.userId),
      userApi.getDashboard(user.userId).catch(() => null)
    ])
      .then(([profileData, dashboardData]) => {
        setForm({
          name: profileData.name || '',
          email: profileData.email || '',
          bio: profileData.bio || ''
        });
        if (dashboardData) {
          setStats({
            recipes: dashboardData.myRecipesCount || 0,
            favorites: dashboardData.savedRecipesCount || 0
          });
        }
        // Try to load profile photo
        setPhotoUrl(`${import.meta.env.VITE_API_BASE_URL || ''}/users/${user.userId}/profile-photo?t=${Date.now()}`);
      })
      .finally(() => setLoading(false));
  }, [user?.userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // The backend expects a full User object based on User.cs
      await userApi.updateProfile(user.userId, { 
        userId: user.userId, 
        name: form.name, 
        email: form.email, 
        bio: form.bio,
        role: user.role || 'User',
        isActive: true
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);
      await userApi.uploadPhoto(user.userId, formData);

      // Refresh photo URL with cache bust
      setPhotoUrl(
        `${import.meta.env.VITE_API_BASE_URL || ''}/users/${user.userId}/profile-photo?t=${Date.now()}`
      );
      toast.success('Profile photo updated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Photo upload failed');
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-40">
          <Loader variant="primary" />
          <p className="mt-6 text-sm font-bold text-surface-400 uppercase tracking-widest animate-pulse">
            Loading your profile...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-12 pb-24">
        {/* Page Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-surface-100 pb-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-primary-500 mb-2">
              <FiAward size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Account Settings</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-surface-900 tracking-tight">
              Your Profile
            </h1>
            <p className="mt-3 text-surface-500 font-medium leading-relaxed">
              Manage your account details and public chef profile.
            </p>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-50 border border-surface-100 shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-primary-600 shadow-sm">
              <FiGlobe size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-surface-400">Membership</p>
              <p className="text-sm font-bold text-surface-900">Verified Member</p>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-[1fr,340px] gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-white rounded-2xl border border-surface-200 p-8 shadow-sm space-y-8">
                <h3 className="text-lg font-bold text-surface-900 border-b border-surface-100 pb-4">
                  Basic Information
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    placeholder="e.g. Jane Smith"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    icon={<FiUser />}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="chef@recipehub.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    icon={<FiMail />}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-surface-700 ml-1">
                    Bio
                  </label>
                  <div className="relative group">
                    <FiEdit3 className="absolute left-4 top-4 text-surface-300 group-focus-within:text-primary-500 transition-colors" />
                    <textarea
                      className="w-full min-h-[160px] pl-12 pr-4 py-4 rounded-xl bg-white border border-surface-200 text-surface-900 font-medium placeholder:text-surface-300 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:outline-none transition-all resize-none leading-relaxed"
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      placeholder="Share your cooking style and inspirations..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={saving}
                  icon={<FiSave />}
                  className="px-10"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Sidebar: Profile Card */}
          <aside className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 border border-surface-200 shadow-sm text-center relative overflow-hidden"
            >
              {/* Gradient top strip */}
              <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-br from-primary-500/10 to-secondary-500/5" />

              {/* Avatar with upload */}
              <div className="relative mt-4 mb-6 inline-block">
                <div className="mx-auto w-28 h-28 rounded-full ring-4 ring-primary-100 overflow-hidden bg-primary-50 flex items-center justify-center">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Profile"
                      className="h-full w-full object-cover"
                      onError={() => setPhotoUrl(null)}
                    />
                  ) : (
                    <FiUser size={56} className="text-primary-300" />
                  )}
                </div>

                {/* Camera upload button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg hover:bg-primary-600 transition-all disabled:opacity-50"
                  title="Change photo"
                >
                  {uploadingPhoto ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                  ) : (
                    <FiCamera size={16} />
                  )}
                </button>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handlePhotoUpload}
                />
              </div>

              <h3 className="text-xl font-bold text-surface-900 tracking-tight">
                {form.name || 'Anonymous Chef'}
              </h3>
              <p className="text-xs font-bold text-surface-400 uppercase tracking-widest mt-1">
                {form.email}
              </p>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-surface-100 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-surface-400">Recipes</p>
                  <p className="text-2xl font-bold text-surface-900 mt-1">{stats.recipes}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-surface-400">Favorites</p>
                  <p className="text-2xl font-bold text-surface-900 mt-1">{stats.favorites}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2">
                <FiCheckCircle className="text-success" size={16} />
                <span className="text-xs font-bold text-success">Verified Member</span>
              </div>
            </motion.div>

            {/* Tip card */}
            <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100">
              <div className="flex items-center gap-3 mb-3">
                <FiInfo className="text-primary-500" />
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary-600">Profile Tip</h4>
              </div>
              <p className="text-primary-700/80 text-sm leading-relaxed">
                A complete profile with a photo gets 3× more engagement from the community.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
