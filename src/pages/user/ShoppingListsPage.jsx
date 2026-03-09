import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiCheckCircle, FiCircle, FiShoppingCart, FiList, FiPackage, FiTruck, FiCornerDownRight } from 'react-icons/fi';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { shoppingListApi } from '../../api/shoppingListApi.jsx';
import { useAuth } from '../../hooks/useAuth.jsx';
import usePageTitle from '../../hooks/usePageTitle.jsx';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';

const ShoppingListsPage = () => {
  const { user, loading: authLoading } = useAuth();
  usePageTitle('Your Provision Hub | RecipeHub');
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [newListTitle, setNewListTitle] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadLists = async (selectLatest = false) => {
    try {
      if (!user?.userId) return;
      const data = await shoppingListApi.getByUser(user.userId);
      setLists(data);
      if (data.length > 0) {
        if (!selectedList || selectLatest) {
          setSelectedList(data[data.length - 1]);
        } else {
          const updated = data.find(l => l.shoppingListId === selectedList.shoppingListId);
          if (updated) setSelectedList(updated);
        }
      } else {
        setSelectedList(null);
      }
    } catch (error) {
      console.error('Failed to load sequences', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.userId) return;
    loadLists();
  }, [user?.userId]);

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    setIsSubmitting(true);
    try {
      await shoppingListApi.create({ userId: user.userId, name: newListTitle });
      setNewListTitle('');
      toast.success('Inventory sequence initialized');
      await loadLists(true);
    } catch {
      toast.error('Could not initialize sequence');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteList = async (shoppingListId) => {
    try {
      await shoppingListApi.remove(shoppingListId);
      if (selectedList?.shoppingListId === shoppingListId) setSelectedList(null);
      toast.success('Sequence terminated');
      loadLists();
    } catch {
      toast.error('Termination failed');
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim() || !selectedList) return;
    try {
      await shoppingListApi.addItem(selectedList.shoppingListId, {
        ingredientName: newItemName,
        quantity: "1",
        unit: 'pcs'
      });
      setNewItemName('');
      loadLists();
    } catch {
      toast.error('Could not archive item');
    }
  };

  const handleToggleItem = async (item) => {
    try {
      const currentChecked = item.isChecked ?? false;
      await shoppingListApi.updateItem(item.shoppingListItemId, { isChecked: !currentChecked });
      loadLists();
    } catch {
      toast.error('Could not update item status');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await shoppingListApi.removeItem(itemId);
      loadLists();
    } catch {
      toast.error('Could not remove item');
    }
  };

  if (authLoading || (loading && lists.length === 0)) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-40">
          <Loader variant="primary" />
          <p className="mt-6 text-sm font-bold text-surface-400 uppercase tracking-widest animate-pulse">Initializing Provision Hub...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 lg:gap-10 pb-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0 mt-2">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-primary-500 mb-2">
              <FiTruck size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Gourmet Logistics</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-surface-900 tracking-tight leading-tight">Provision Hub</h1>
            <p className="mt-2 text-surface-500 text-base font-medium leading-relaxed">
              Orchestrate your culinary inventory with precision sequences.
            </p>
          </div>

          <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-surface-200 shadow-sm text-surface-600 font-bold text-sm">
            <FiShoppingCart className="text-primary-500" />
            <span>{lists.length} Sequences</span>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-1 xl:grid-cols-[320px,minmax(0,1fr)] gap-8 items-start">
          {/* Sidebar: Lists */}
          <aside className="flex flex-col gap-6 w-full xl:sticky xl:top-28">
            <div className="bg-surface-950 rounded-[2rem] p-6 shrink-0 relative overflow-hidden shadow-xl">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3 text-primary-400">
                  <FiPackage />
                  <h3 className="text-[10px] font-bold text-primary-400 uppercase tracking-[0.2em]">New Manifest</h3>
                </div>
                <form onSubmit={handleCreateList} className="flex gap-3">
                  <input
                    className="flex-1 h-12 px-5 rounded-xl bg-white/10 border border-white/10 text-white font-bold placeholder:text-surface-500 focus:bg-white/15 focus:border-primary-500 focus:outline-none transition-all text-sm"
                    placeholder="Sequence Identifier..."
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="h-12 w-12 shrink-0 flex items-center justify-center rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50"
                  >
                    <FiPlus />
                  </button>
                </form>
              </div>
              <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-primary-500/10 rounded-full blur-3xl" />
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-[10px] font-bold text-surface-400 uppercase tracking-[0.2em] ml-2">Active Sequences</h3>
              <AnimatePresence mode="popLayout">
                {lists.map((list) => (
                  <motion.div
                    key={list.shoppingListId}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`group flex items-center justify-between p-6 rounded-[2.2rem] border transition-all cursor-pointer ${selectedList?.shoppingListId === list.shoppingListId
                        ? 'bg-white border-primary-500 shadow-premium transform scale-[1.02]'
                        : 'bg-white border-surface-100 text-surface-900 hover:border-primary-200'
                      }`}
                    onClick={() => setSelectedList(list)}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${selectedList?.shoppingListId === list.shoppingListId ? 'bg-primary-500 text-white' : 'bg-surface-50 text-surface-400 border border-surface-100'}`}>
                        <FiList />
                      </div>
                      <div>
                        <h4 className={`font-serif font-bold text-sm tracking-tight ${selectedList?.shoppingListId === list.shoppingListId ? 'text-surface-900' : 'text-surface-600'}`}>
                           {list.name}
                        </h4>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${selectedList?.shoppingListId === list.shoppingListId ? 'text-primary-500' : 'text-surface-400'}`}>
                          {list.items?.length || 0} Provisions
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteList(list.shoppingListId); }}
                      className={`h-9 w-9 flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 transition-all text-surface-300 hover:text-red-500 hover:bg-red-50`}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {lists.length === 0 && !loading && (
                <div className="py-20 text-center rounded-[3rem] border border-dashed border-surface-100 grayscale opacity-40">
                  <FiPackage className="mx-auto text-surface-100 mb-4" size={48} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">No Sequences Discovered</p>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content: Items */}
          <main className="flex flex-col w-full min-w-0">
            <AnimatePresence mode="wait">
              {selectedList ? (
                <motion.div
                  key={selectedList.shoppingListId}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex flex-col bg-white rounded-[2.5rem] border border-surface-200 shadow-premium overflow-hidden"
                >
                  <header className="p-10 border-b border-surface-50 flex flex-col md:flex-row md:items-center justify-between gap-8 shrink-0">
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 rounded-[1.5rem] bg-primary-50 flex items-center justify-center text-primary-600 border border-primary-100 shadow-sm">
                        <FiPackage size={24} />
                      </div>
                      <div>
                        <h2 className="text-3xl font-serif font-bold text-surface-900 tracking-tight">{selectedList.name}</h2>
                        <div className="flex items-center gap-2 mt-1.5">
                           <span className="h-1.5 w-1.5 rounded-full bg-success" />
                           <span className="text-[10px] font-bold uppercase tracking-widest text-surface-400">Inventory Manifest</span>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleAddItem} className="flex gap-4">
                      <div className="relative">
                        <input
                          className="h-14 pl-12 pr-6 rounded-[1.5rem] bg-surface-50/50 border border-surface-200 text-sm font-bold placeholder:text-surface-300 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 focus:outline-none transition-all w-full md:w-[320px]"
                          placeholder="Provision Name..."
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                        />
                        <FiCornerDownRight className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-300" />
                      </div>
                      <Button type="submit" variant="primary" className="h-14 shrink-0 px-6 rounded-2xl shadow-lg shadow-primary-500/10"><FiPlus size={20} /></Button>
                    </form>
                  </header>

                  <div className="p-6 md:p-8">
                    <div className="max-w-4xl mx-auto space-y-6">
                      <AnimatePresence mode="popLayout">
                        {selectedList.items?.map((item, idx) => (
                          <motion.div
                            key={item.shoppingListItemId}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`group flex items-center justify-between p-8 rounded-[2.5rem] border transition-all ${item.isChecked
                                ? 'bg-surface-50 border-surface-100 shadow-none'
                                : 'bg-white border-surface-100 hover:border-primary-300 shadow-soft-xl hover:shadow-premium'
                              }`}
                          >
                            <div className="flex items-center gap-8">
                              <button
                                onClick={() => handleToggleItem(item)}
                                className={`h-10 w-10 rounded-2xl flex items-center justify-center transition-all shadow-sm ${item.isChecked
                                    ? 'bg-success text-white'
                                    : 'bg-white border-2 border-surface-100 text-surface-200 hover:border-primary-500 hover:text-primary-500'
                                  }`}
                              >
                                {item.isChecked ? <FiCheckCircle size={20} /> : <FiCircle size={20} />}
                              </button>
                              <div className="flex flex-col">
                                <span className={`text-xl font-serif font-bold tracking-tight ${item.isChecked ? 'text-surface-400 line-through' : 'text-surface-900'}`}>
                                  {item.ingredientName}
                                </span>
                                <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${item.isChecked ? 'text-surface-300' : 'text-surface-400'}`}>
                                  Provision Unit: 1.0 Archive
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteItem(item.shoppingListItemId)}
                              className="h-12 w-12 flex items-center justify-center rounded-2xl text-surface-200 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500 transform hover:rotate-12"
                            >
                              <FiTrash2 size={20} />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {(!selectedList.items || selectedList.items.length === 0) && (
                        <div className="py-40 text-center grayscale opacity-30">
                          <FiShoppingCart className="mx-auto text-surface-100 mb-6" size={80} />
                          <h3 className="text-2xl font-serif font-bold text-surface-900">Manifest is Vacant</h3>
                          <p className="text-surface-400 font-medium max-w-xs mx-auto mt-2">Initialize your logistics by adding your first gourmet provision above.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <footer className="p-10 border-t border-surface-50 flex items-center justify-between bg-surface-50/30">
                     <div className="flex items-center gap-8">
                       <div>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-surface-400">Completion Status</p>
                         <div className="h-2 w-48 bg-surface-200 rounded-full mt-2 overflow-hidden">
                            <div 
                              className="h-full bg-success transition-all duration-500" 
                              style={{ width: `${selectedList.items?.length ? (selectedList.items.filter(i => i.isChecked).length / selectedList.items.length) * 100 : 0}%` }}
                            />
                         </div>
                       </div>
                       <p className="text-sm font-bold text-surface-600 mt-4">
                         {selectedList.items?.filter(i => i.isChecked).length || 0} / {selectedList.items?.length || 0} Orchestrated
                       </p>
                     </div>
                  </footer>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 bg-surface-50 rounded-[2.5rem] border-2 border-dashed border-surface-200 grayscale opacity-40 min-h-[400px]">
                  <FiList className="text-surface-100 mb-6" size={80} />
                  <h3 className="text-2xl font-serif font-bold text-surface-900 tracking-tight">Awaiting Logistics Order</h3>
                  <p className="text-surface-400 font-medium mt-3 max-w-xs text-center">Select or initialize a sequence from the provision archive to begin.</p>
                </div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ShoppingListsPage;
