import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFileText, 
  FiSearch, 
  FiEdit3, 
  FiTrash2, 
  FiEye, 
  FiCheckCircle, 
  FiClock, 
  FiArchive, 
  FiFilter,
  FiMoreVertical,
  FiChevronRight
} from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminApi } from '../../api/adminApi.jsx';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';
import usePageTitle from '../../hooks/usePageTitle.jsx';

const AdminRecipesPage = () => {
  usePageTitle('Recipe Governance | Executive Console');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadRecipes = async () => {
    try {
      const data = await adminApi.getRecipes();
      setRecipes(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const updateStatus = async (recipeId, status) => {
    try {
      await adminApi.updateRecipeStatus(recipeId, status);
      toast.success(`Protocol Update: Recipe status changed to ${status}`);
      loadRecipes();
    } catch {
      toast.error('Protocol Error: Could not synchronize status');
    }
  };

  const filteredRecipes = recipes.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.userName || r.authorName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const styles = {
      Published: 'bg-success/10 text-success border-success/20',
      PendingApproval: 'bg-warning/10 text-warning border-warning/20',
      Archived: 'bg-surface-100 text-surface-500 border-surface-200',
      Draft: 'bg-primary-50 text-primary-500 border-primary-100'
    };
    
    const icons = {
      Published: <FiCheckCircle size={10} />,
      PendingApproval: <FiClock size={10} />,
      Archived: <FiArchive size={10} />,
      Draft: <FiEdit3 size={10} />
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[9px] font-bold uppercase tracking-widest ${styles[status] || styles.Draft}`}>
        {icons[status] || icons.Draft}
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-40">
          <Loader variant="primary" />
          <p className="mt-6 text-sm font-bold text-surface-400 uppercase tracking-widest animate-pulse">Retrieving Global Archive...</p>
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
              <FiFileText size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Archive Management</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-surface-900 tracking-tight leading-tight">Recipe Library</h1>
            <p className="mt-3 text-surface-500 text-lg font-medium leading-relaxed">
              Global governance of published masterpieces, ensuring content quality and community alignment.
            </p>
          </div>

          <div className="relative group max-w-md w-full">
            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-primary-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search archive: Title or Author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-surface-200 rounded-[2rem] py-5 pl-16 pr-8 font-bold text-surface-900 focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all shadow-premium text-sm placeholder:text-surface-300"
            />
          </div>
        </header>

        <div className="bg-white rounded-[3.5rem] border border-surface-200 shadow-premium overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full divide-y divide-surface-100">
              <thead>
                <tr className="bg-surface-50/50">
                  <th className="px-10 py-8 text-left text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em]">Masterpiece Identifier</th>
                  <th className="px-10 py-8 text-left text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em]">Classification</th>
                  <th className="px-10 py-8 text-left text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em]">Governance Status</th>
                  <th className="px-10 py-8 text-right text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em]">Strategic Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-50">
                <AnimatePresence>
                  {filteredRecipes.map((recipe, i) => (
                    <motion.tr
                      key={recipe.recipeId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ delay: i * 0.03 }}
                      className="group transition-colors hover:bg-primary-50/20"
                    >
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="h-16 w-24 rounded-2xl border border-surface-100 overflow-hidden shadow-sm flex-shrink-0 group-hover:shadow-md transition-shadow">
                            <img 
                              src={recipe.imageUrl || 'https://images.unsplash.com/photo-1495195129352-aec325b55b65?auto=format&fit=crop&w=200&q=80'} 
                              className="h-full w-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" 
                              alt="" 
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-serif font-bold text-lg text-surface-900 group-hover:text-primary-600 transition-colors truncate">{recipe.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                               <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest leading-none">by {recipe.userName || recipe.authorName || 'Chef ID: Null'}</p>
                               <FiChevronRight size={10} className="text-surface-200" />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className="inline-flex px-4 py-2 rounded-xl bg-surface-50 text-surface-600 text-[9px] font-bold uppercase tracking-widest border border-surface-100 group-hover:border-primary-100 transition-colors">
                          {recipe.categoryName || 'General Core'}
                        </span>
                      </td>
                      <td className="px-10 py-8">
                        {getStatusBadge(recipe.status)}
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex justify-end items-center gap-6">
                          <div className="relative group/control">
                             <select
                               className="appearance-none bg-surface-50 border border-surface-100 rounded-xl px-5 py-2.5 pr-10 text-[9px] font-bold uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 transition-all text-surface-600 group-hover/control:bg-white group-hover/control:border-primary-200"
                               value={recipe.status}
                               onChange={(e) => updateStatus(recipe.recipeId, e.target.value)}
                             >
                               <option value="Draft">Override: Draft</option>
                               <option value="PendingApproval">Action: Pending</option>
                               <option value="Published">Action: Publish</option>
                               <option value="Archived">Action: Archive</option>
                             </select>
                             <FiMoreVertical className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400" size={14} />
                          </div>
                          
                          <div className="flex gap-2">
                            <Link to={`/recipes/${recipe.recipeId}`}>
                              <Button variant="ghost" size="sm" icon={<FiEye />} className="h-10 w-10 !p-0 bg-surface-50 hover:bg-surface-900 hover:text-white" />
                            </Link>
                            <Button variant="secondary" size="sm" icon={<FiTrash2 />} className="h-10 w-10 !p-0 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white border-red-100" />
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {filteredRecipes.length === 0 && (
            <div className="py-40 text-center grayscale opacity-40">
              <FiFileText className="mx-auto text-surface-100 mb-6" size={80} />
              <h3 className="text-2xl font-serif font-bold text-surface-900">Archive Query empty</h3>
              <p className="text-surface-400 font-medium max-w-xs mx-auto mt-2">No masterpieces documented in the current synchronization cycle match your identifier.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminRecipesPage;
