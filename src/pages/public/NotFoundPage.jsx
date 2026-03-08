import { Link } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import usePageTitle from '../../hooks/usePageTitle.jsx'

function NotFoundPage() {
  usePageTitle('Not Found')
  return (
    <AppLayout>
      <div className="container-app flex min-h-[70vh] flex-col items-center justify-center text-center">
        <h1 className="text-7xl font-extrabold text-slate-900">404</h1>
        <p className="mt-4 text-lg text-slate-600">The page you are looking for does not exist.</p>
        <Link to="/" className="btn-primary mt-6">Back to Home</Link>
      </div>
    </AppLayout>
  )
}

export default NotFoundPage
