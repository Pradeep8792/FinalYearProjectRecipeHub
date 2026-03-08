import { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { adminApi } from '../../api/adminApi'

function AdminReportsPage() {
  const [reports, setReports] = useState([])

  useEffect(() => {
    adminApi.getReports().then(setReports)
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
          <p className="mt-2 text-slate-600">Track moderation workflow and reported recipes.</p>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-5 py-4">Recipe</th>
                <th className="px-5 py-4">Reason</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Reporter</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.reportId} className="border-t border-slate-100">
                  <td className="px-5 py-4 font-medium text-slate-900">{report.recipeTitle}</td>
                  <td className="px-5 py-4">{report.reason}</td>
                  <td className="px-5 py-4">{report.status}</td>
                  <td className="px-5 py-4">{report.reporterName || report.reporterUserId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminReportsPage
