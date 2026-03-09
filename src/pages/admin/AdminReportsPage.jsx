import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiAlertTriangle, 
  FiCheck, 
  FiX, 
  FiEye, 
  FiMessageSquare, 
  FiFlag, 
  FiTrash2, 
  FiClock,
  FiShield,
  FiFilter,
  FiChevronRight,
  FiUser
} from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { adminApi } from '../../api/adminApi.jsx';
import usePageTitle from '../../hooks/usePageTitle.jsx';

const AdminReportsPage = () => {
  usePageTitle('Incident Management | Executive Console');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getReports();
      setReports(data);
    } catch {
      toast.error('Strategic breach: Could not load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const filteredReports = reports.filter(r =>
    filterStatus === 'All' ? true : r.status === filterStatus
  );

  const handleAction = async (reportId, action) => {
    try {
      await adminApi.resolveReport(reportId, action);
      toast.success(`Consensus Reached: Report ${action === 'Dismiss' ? 'Dismissed' : 'Actioned'}`);
      loadReports();
    } catch {
      toast.error('Moderation protocol failure: Resolution failed');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Pending: 'bg-warning/10 text-warning border-warning/20',
      Resolved: 'bg-success/10 text-success border-success/20'
    };
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[9px] font-bold uppercase tracking-widest ${styles[status]}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${status === 'Pending' ? 'bg-warning animate-pulse' : 'bg-success'}`} />
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-40">
          <Loader variant="primary" />
          <p className="mt-6 text-sm font-bold text-surface-400 uppercase tracking-widest animate-pulse">Scanning Incident Queue...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-16 pb-20">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-primary-500 mb-2">
              <FiShield size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Moderation Protocol</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-surface-900 tracking-tight leading-tight">Active Reports</h1>
            <p className="mt-3 text-surface-500 text-lg font-medium leading-relaxed">
              Managing community friction and content integrity via the global incident response queue.
            </p>
          </div>

          <div className="flex bg-white p-2 rounded-[2rem] border border-surface-200 shadow-sm relative z-10">
            {['All', 'Pending', 'Resolved'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest transition-all ${filterStatus === status
                    ? 'bg-surface-950 text-white shadow-xl'
                    : 'text-surface-400 hover:text-surface-600'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </header>

        <div className="bg-white rounded-[3.5rem] border border-surface-200 shadow-premium overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full divide-y divide-surface-100 text-left">
              <thead className="bg-surface-50/50">
                <tr>
                  <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.2em] text-surface-400">Moderation Target</th>
                  <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.2em] text-surface-400">Intel Brief</th>
                  <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.2em] text-surface-400">Originating Source</th>
                  <th className="px-10 py-8 text-[10px] font-bold uppercase tracking-[0.2em] text-surface-400">Response Phase</th>
                  <th className="px-10 py-8 text-right text-[10px] font-bold uppercase tracking-[0.2em] text-surface-400">Tactical Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-50">
                <AnimatePresence mode="popLayout">
                  {filteredReports.map((report, i) => (
                    <motion.tr
                      key={report.reportId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ delay: i * 0.03 }}
                      className="group hover:bg-red-50/10 transition-all"
                    >
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                          <div className="h-12 w-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-500 border border-primary-100 overflow-hidden group-hover:bg-primary-500 group-hover:text-white transition-all duration-500">
                            <FiFlag size={20} className="group-hover:rotate-12 transition-transform" />
                          </div>
                          <div>
                            <p className="font-serif font-bold text-lg text-surface-900 group-hover:text-primary-600 transition-colors tracking-tight leading-tight">
                              {report.recipeTitle || `Node ID: ${report.recipeId}`}
                            </p>
                            <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mt-1">Incident Token: #{report.reportId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-start gap-3">
                          <FiMessageSquare className="mt-1 text-primary-400 flex-shrink-0" size={14} />
                          <p className="text-sm font-medium text-surface-600 max-w-[280px] leading-relaxed">
                            {report.reason || 'No detailed intel provided in this transmission.'}
                          </p>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-xl bg-surface-50 border border-surface-100 flex items-center justify-center text-surface-400">
                              <FiUser size={16} />
                           </div>
                           <div>
                              <span className="text-xs font-bold text-surface-900 block truncate max-w-[120px]">
                                {report.reporterName || 'External Intel'}
                              </span>
                              <span className="text-[9px] font-bold text-surface-400 uppercase tracking-widest">Source Verified</span>
                           </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        {getStatusBadge(report.status)}
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center justify-end gap-3">
                          {report.status === 'Pending' && (
                            <>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleAction(report.reportId, 'Resolve')}
                                icon={<FiCheck />}
                                className="h-10 w-10 !p-0 bg-success border-success text-white"
                              />
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleAction(report.reportId, 'Dismiss')}
                                icon={<FiX />}
                                className="h-10 w-10 !p-0 bg-surface-50 hover:bg-surface-900 hover:text-white"
                              />
                            </>
                          )}
                          <Button 
                            variant="secondary"
                            size="sm"
                            icon={<FiEye />}
                            className="h-10 w-10 !p-0 border-surface-200"
                          />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            <AnimatePresence>
              {filteredReports.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-40 text-center grayscale opacity-40"
                >
                  <FiShield className="mx-auto text-surface-100 mb-6" size={80} />
                  <h3 className="text-3xl font-serif font-bold text-surface-900 tracking-tight">System Secure</h3>
                  <p className="text-surface-400 font-medium max-w-xs mx-auto mt-2 leading-relaxed">
                    The moderation queue is currently empty. No active threats or community reports require intervention.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReportsPage;
