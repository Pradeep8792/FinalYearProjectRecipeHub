import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { FiAlertTriangle, FiCheck, FiX, FiEye, FiMessageSquare, FiFlag, FiTrash2, FiClock } from 'react-icons/fi'
import AdminLayout from '../../components/layout/AdminLayout'
import Loader from '../../components/common/Loader'
import { adminApi } from '../../api/adminApi.jsx'
import usePageTitle from '../../hooks/usePageTitle.jsx'

function AdminReportsPage() {
  usePageTitle('Admin — Reports')
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('All')

  const loadReports = async () => {
    setLoading(true)
    try {
      const data = await adminApi.getReports()
      setReports(data)
    } catch {
      toast.error('Strategic breach: Could not load reports')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  const filteredReports = reports.filter(r =>
    filterStatus === 'All' ? true : r.status === filterStatus
  )

  const handleAction = async (reportId, action) => {
    try {
      await adminApi.resolveReport(reportId, action)
      toast.success(`Report ${action === 'Dismiss' ? 'Dismissed' : 'Actioned'}`)
      loadReports()
    } catch {
      toast.error('Moderation action failed')
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-10 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-primary-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4 block">Moderation Protocol</span>
              <h1 className="text-5xl font-black text-surface-900 tracking-tighter">
                Active Reports
              </h1>
            </motion.div>
          </div>

          <div className="flex bg-surface-100 p-1.5 rounded-2xl">
            {['All', 'Pending', 'Resolved'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filterStatus === status
                    ? 'bg-white text-surface-900 shadow-soft border border-surface-100'
                    : 'text-surface-400 hover:text-surface-600'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="py-24"><Loader /></div>
        ) : (
          <div className="card-premium overflow-hidden border border-surface-100">
            <table className="w-full text-left">
              <thead className="bg-surface-50 border-b border-surface-100">
                <tr>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-surface-400">Moderation Target</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-surface-400">Intelligence (Reason)</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-surface-400">Reporter Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-surface-400">Current Phase</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-surface-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-50">
                <AnimatePresence mode="popLayout">
                  {filteredReports.map((report, i) => (
                    <motion.tr
                      key={report.reportId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group hover:bg-surface-50/50 transition-all"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500">
                            <FiFlag size={18} />
                          </div>
                          <div>
                            <p className="font-black text-surface-900 text-sm tracking-tight">{report.recipeTitle || 'Recipe ID: ' + report.recipeId}</p>
                            <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mt-0.5">ID: #{report.reportId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-start gap-2">
                          <FiMessageSquare className="mt-1 text-surface-300" />
                          <p className="text-sm font-medium text-surface-600 max-w-[250px] leading-relaxed">
                            {report.reason || 'No detailed intel provided.'}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-surface-100 flex items-center justify-center text-surface-400">
                            <FiCheck size={12} />
                          </div>
                          <span className="text-xs font-bold text-surface-900">{report.reporterName || 'Anonymous Intel'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] ${report.status === 'Pending'
                            ? 'bg-amber-50 text-amber-600 border border-amber-100'
                            : 'bg-green-50 text-green-600 border border-green-100'
                          }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          {report.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleAction(report.reportId, 'Resolve')}
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                title="Resolve & Action"
                              >
                                <FiCheck />
                              </button>
                              <button
                                onClick={() => handleAction(report.reportId, 'Dismiss')}
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-surface-100 text-surface-400 hover:bg-surface-900 hover:text-white transition-all shadow-sm"
                                title="Dismiss Report"
                              >
                                <FiX />
                              </button>
                            </>
                          )}
                          <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white transition-all shadow-sm">
                            <FiEye />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {filteredReports.length === 0 && (
              <div className="py-24 text-center">
                <FiAlertTriangle className="mx-auto text-surface-100 mb-6" size={64} />
                <h3 className="text-2xl font-black text-surface-300">Clean Slate Protocol.</h3>
                <p className="text-surface-400 font-medium mt-2">No active reports require immediate moderation.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminReportsPage
