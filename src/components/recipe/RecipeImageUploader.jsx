import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUploadCloud, FiImage, FiCheck, FiX, FiLoader } from 'react-icons/fi'
import { recipeApi } from '../../api/recipeApi'

function RecipeImageUploader({ recipeId, onUploaded }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
    }
  }

  const handleUpload = async () => {
    if (!file) return toast.error('Selection required: Please choose an image')
    setUploading(true)
    try {
      const result = await recipeApi.uploadImage(recipeId, file, true)
      toast.success('Visual asset successfully synchronized')
      onUploaded?.(result)
      setFile(null)
      setPreview(null)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Synchronization failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="card-premium p-8 space-y-6">
      <header>
        <h3 className="text-lg font-black text-surface-900 tracking-tight">Visual Asset Configuration</h3>
        <p className="text-surface-400 text-[10px] font-bold uppercase tracking-widest mt-1">High-resolution imagery recommended</p>
      </header>

      <div
        onClick={() => fileInputRef.current?.click()}
        className="relative group h-64 w-full rounded-[2.5rem] border-2 border-dashed border-surface-100 bg-surface-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-white transition-all overflow-hidden"
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 w-full h-full"
            >
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-surface-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
                  <FiEdit2 /> Change Asset
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="h-16 w-16 rounded-3xl bg-white border border-surface-100 shadow-soft flex items-center justify-center text-surface-300 group-hover:scale-110 group-hover:text-primary-500 transition-all">
                <FiUploadCloud size={24} />
              </div>
              <p className="text-surface-500 font-bold text-sm mt-4">Select or drop cinematic shot</p>
              <p className="text-surface-300 text-[10px] font-black uppercase tracking-widest mt-1">PNG, JPG up to 10MB</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-end gap-3">
        {preview && !uploading && (
          <button
            onClick={() => { setFile(null); setPreview(null); }}
            className="h-12 w-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
          >
            <FiX />
          </button>
        )}
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading || !file}
          className="flex-1 h-12 bg-surface-900 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary-600 shadow-lg shadow-surface-100 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {uploading ? (
            <>
              <FiLoader className="animate-spin" />
              Synchronizing...
            </>
          ) : (
            <>
              Commit Asset
              <FiCheck className="group-hover:scale-125 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default RecipeImageUploader
