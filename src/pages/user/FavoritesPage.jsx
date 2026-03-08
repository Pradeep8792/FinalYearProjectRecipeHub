import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Loader from '../../components/common/Loader'
import RecipeGrid from '../../components/recipe/RecipeGrid'
import { favoriteApi } from '../../api/favoriteApi.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import usePageTitle from '../../hooks/usePageTitle.jsx'

function FavoritesPage() {
  const { user, loading: authLoading } = useAuth()
  usePageTitle('Favorites')
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  const loadFavorites = async () => {
    if (!user?.userId) return
    setLoading(true)
    try {
      const data = await favoriteApi.getByUser(user.userId)
      setFavorites(data)
    } catch {
      toast.error('Could not load favorites')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user?.userId) return
    loadFavorites()
  }, [user?.userId])

  if (authLoading) return <DashboardLayout><div className="flex justify-center py-20"><Loader /></div></DashboardLayout>

  return (
    <DashboardLayout>
      <div>
        <p className="section-badge">Favorites</p>
        <h1 className="mt-3 text-4xl font-extrabold text-slate-900">Saved recipes</h1>
        <div className="mt-6">
          {loading ? <Loader /> : <RecipeGrid recipes={favorites} />}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default FavoritesPage
