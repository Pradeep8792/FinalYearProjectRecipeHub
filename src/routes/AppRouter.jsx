import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute.jsx'
import AdminRoute from './AdminRoute.jsx'
import HomePage from '../pages/public/HomePage.jsx'
import RecipesPage from '../pages/public/RecipesPage.jsx'
import RecipeDetailsPage from '../pages/public/RecipeDetailsPage.jsx'
import CategoriesPage from '../pages/public/CategoriesPage.jsx'
import NotFoundPage from '../pages/public/NotFoundPage.jsx'
import LoginPage from '../pages/auth/LoginPage.jsx'
import RegisterPage from '../pages/auth/RegisterPage.jsx'
import UserDashboardPage from '../pages/user/UserDashboardPage.jsx'
import FavoritesPage from '../pages/user/FavoritesPage.jsx'
import CreateRecipePage from '../pages/user/CreateRecipePage.jsx'
import MyRecipesPage from '../pages/user/MyRecipesPage.jsx'
import MealPlansPage from '../pages/user/MealPlansPage.jsx'
import ShoppingListsPage from '../pages/user/ShoppingListsPage.jsx'
import ProfilePage from '../pages/user/ProfilePage.jsx'
import EditRecipePage from '../pages/user/EditRecipePage.jsx'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage.jsx'
import AdminUsersPage from '../pages/admin/AdminUsersPage.jsx'
import AdminRecipesPage from '../pages/admin/AdminRecipesPage.jsx'
import AdminReportsPage from '../pages/admin/AdminReportsPage.jsx'
import AnalyticsPage from '../pages/admin/AnalyticsPage.jsx'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/recipes" element={<RecipesPage />} />
      <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<UserDashboardPage />} />
        <Route path="/my-recipes" element={<MyRecipesPage />} />
        <Route path="/recipes/create" element={<CreateRecipePage />} />
        <Route path="/recipes/:id/edit" element={<EditRecipePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/meal-plans" element={<MealPlansPage />} />
        <Route path="/shopping-lists" element={<ShoppingListsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/analytics" element={<AnalyticsPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/recipes" element={<AdminRecipesPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRouter
