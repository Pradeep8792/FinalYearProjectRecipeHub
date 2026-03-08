import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiTrash2, FiCheckCircle, FiCircle, FiShoppingCart, FiList, FiChevronRight, FiEdit2 } from 'react-icons/fi'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { shoppingListApi } from '../../api/shoppingListApi.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import usePageTitle from '../../hooks/usePageTitle.jsx'
import Loader from '../../components/common/Loader'

function ShoppingListsPage() {
  const { user, loading: authLoading } = useAuth()
  usePageTitle('Shopping Lists')
  const [lists, setLists] = useState([])
  const [selectedList, setSelectedList] = useState(null)
  const [newListTitle, setNewListTitle] = useState('')
  const [newItemName, setNewItemName] = useState('')
  const [loading, setLoading] = useState(true)

  const loadLists = async () => {
    try {
      if (!user?.userId) return
      const data = await shoppingListApi.getByUser(user.userId)
      setLists(data)
      if (data.length > 0 && !selectedList) {
        setSelectedList(data[0])
      } else if (selectedList) {
        const updated = data.find(l => l.listId === selectedList.listId)
        if (updated) setSelectedList(updated)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user?.userId) return
    loadLists()
  }, [user?.userId])

  const handleCreateList = async (e) => {
    e.preventDefault()
    if (!newListTitle.trim()) return
    try {
      await shoppingListApi.create({ userId: user.userId, title: newListTitle })
      setNewListTitle('')
      toast.success('Inventory sequence initialized')
      loadLists()
    } catch {
      toast.error('Could not initialize list')
    }
  }

  const handleDeleteList = async (listId) => {
    try {
      await shoppingListApi.remove(listId)
      if (selectedList?.listId === listId) setSelectedList(null)
      toast.success('Inventory sequence terminated')
      loadLists()
    } catch {
      toast.error('Termination failed')
    }
  }

  const handleAddItem = async (e) => {
    e.preventDefault()
    if (!newItemName.trim() || !selectedList) return
    try {
      await shoppingListApi.addItem(selectedList.listId, {
        itemName: newItemName,
        quantity: 1,
        unit: 'pcs'
      })
      setNewItemName('')
      loadLists()
    } catch {
      toast.error('Could not add item')
    }
  }

  const handleToggleItem = async (item) => {
    try {
      await shoppingListApi.updateItem(item.itemId, {
        ...item,
        isPurchased: !item.isPurchased
      })
      loadLists()
    } catch {
      toast.error('Item update failed')
    }
  }

  const handleDeleteItem = async (itemId) => {
    try {
      await shoppingListApi.removeItem(itemId)
      loadLists()
    } catch {
      toast.error('Item removal failed')
    }
  }

  if (authLoading) return <DashboardLayout><div className="flex justify-center py-20"><Loader /></div></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-12rem)] flex flex-col gap-8 pb-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 shrink-0">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-primary-500 font-black uppercase tracking-[0.2em] text-[10px] mb-4 block">Logistics Hub</span>
              <h1 className="text-5xl font-black text-surface-900 tracking-tighter">
                Inventory Lists
              </h1>
            </motion.div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface-100 text-surface-600 font-bold text-sm">
            <FiShoppingCart />
            {lists.length} Active Provisions
          </div>
        </header>

        <div className="flex-1 min-h-0 grid lg:grid-cols-[380px,1fr] gap-8">
          {/* Sidebar: Lists */}
          <aside className="flex flex-col gap-6 min-h-0">
            <div className="card-premium p-6 shrink-0">
              <h3 className="text-xs font-black text-surface-400 uppercase tracking-widest mb-4">New Sequence</h3>
              <form onSubmit={handleCreateList} className="flex gap-2">
                <input
                  className="flex-1 h-11 px-4 rounded-xl bg-surface-50 border border-surface-100 text-sm font-bold placeholder:text-surface-300 focus:border-primary-500 focus:outline-none transition-all"
                  placeholder="List Title..."
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                />
                <button type="submit" className="h-11 w-11 flex items-center justify-center rounded-xl bg-surface-900 text-white hover:bg-primary-600 transition-all shadow-lg">
                  <FiPlus />
                </button>
              </form>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {lists.map((list) => (
                <motion.div
                  key={list.listId}
                  layout
                  className={`group flex items-center justify-between p-5 rounded-[2rem] border transition-all cursor-pointer ${selectedList?.listId === list.listId
                      ? 'bg-surface-900 border-surface-900 text-white shadow-xl shadow-surface-200'
                      : 'bg-white border-surface-100 text-surface-900 hover:border-primary-200'
                    }`}
                  onClick={() => setSelectedList(list)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${selectedList?.listId === list.listId ? 'bg-white/10 text-white' : 'bg-surface-50 text-surface-400'}`}>
                      <FiList />
                    </div>
                    <div>
                      <h4 className="font-black text-sm tracking-tight">{list.title}</h4>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedList?.listId === list.listId ? 'text-white/40' : 'text-surface-400'}`}>
                        {list.items?.length || 0} Provisions
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteList(list.listId); }}
                    className={`h-8 w-8 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-all ${selectedList?.listId === list.listId ? 'text-white/40 hover:text-white hover:bg-white/10' : 'text-surface-300 hover:text-red-500 hover:bg-red-50'}`}
                  >
                    <FiTrash2 size={14} />
                  </button>
                </motion.div>
              ))}

              {lists.length === 0 && !loading && (
                <div className="py-12 text-center text-surface-300">
                  <p className="text-xs font-black uppercase tracking-widest">No Sequences Found</p>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content: Items */}
          <main className="flex-1 flex flex-col min-h-0">
            {selectedList ? (
              <motion.div
                key={selectedList.listId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col min-h-0 bg-white rounded-[3rem] border border-surface-100 shadow-soft-xl overflow-hidden"
              >
                <header className="p-8 border-b border-surface-50 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-4 text-surface-900">
                    <h2 className="text-2xl font-black tracking-tight">{selectedList.title}</h2>
                    <div className="h-1 w-8 bg-primary-500 rounded-full" />
                  </div>

                  <form onSubmit={handleAddItem} className="flex gap-3">
                    <input
                      className="h-12 px-6 rounded-2xl bg-surface-50 border border-surface-100 text-sm font-bold placeholder:text-surface-300 focus:bg-white focus:border-primary-500 focus:outline-none transition-all w-[300px]"
                      placeholder="Add Provision Name..."
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                    />
                    <button type="submit" className="h-12 px-6 rounded-2xl bg-primary-500 text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-primary-600 transition-all shadow-lg shadow-primary-50">
                      <FiPlus />
                      Dispatch
                    </button>
                  </form>
                </header>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  <div className="max-w-3xl mx-auto space-y-4">
                    <AnimatePresence mode="popLayout">
                      {selectedList.items?.map((item) => (
                        <motion.div
                          key={item.itemId}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className={`group flex items-center justify-between p-6 rounded-[2rem] border transition-all ${item.isPurchased
                              ? 'bg-surface-50 border-surface-100 opacity-60'
                              : 'bg-white border-primary-50 hover:border-primary-200'
                            }`}
                        >
                          <div className="flex items-center gap-6">
                            <button
                              onClick={() => handleToggleItem(item)}
                              className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${item.isPurchased
                                  ? 'bg-green-500 text-white shadow-lg shadow-green-100'
                                  : 'border-2 border-surface-200 text-surface-200 hover:border-primary-500 hover:text-primary-500'
                                }`}
                            >
                              {item.isPurchased ? <FiCheckCircle /> : <FiCircle />}
                            </button>
                            <span className={`font-bold text-lg tracking-tight ${item.isPurchased ? 'text-surface-400 line-through' : 'text-surface-900'}`}>
                              {item.itemName}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteItem(item.itemId)}
                            className="h-10 w-10 flex items-center justify-center rounded-xl text-surface-200 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {(!selectedList.items || selectedList.items.length === 0) && (
                      <div className="py-24 text-center">
                        <FiPlus className="mx-auto text-surface-100 mb-6" size={48} />
                        <p className="text-surface-400 font-medium">This provision list is currently empty.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-surface-50 rounded-[3rem] border border-dashed border-surface-200">
                <FiList className="text-surface-200 mb-6" size={64} />
                <h3 className="text-xl font-black text-surface-400 uppercase tracking-widest">Select an Inventory Sequence</h3>
              </div>
            )}
          </main>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ShoppingListsPage

