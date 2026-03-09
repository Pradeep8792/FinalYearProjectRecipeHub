import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiImage, FiCheck, FiX, FiLoader, FiEdit2 } from 'react-icons/fi';
import { recipeApi } from '../../api/recipeApi';
import Button from '../common/Button';

const RecipeImageUploader = ({ recipeId, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 10 * 1024 * 1024) {
        return toast.error('File too large (Max 10MB)');
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error('Please select an image first');
    setUploading(true);
    try {
      const result = await recipeApi.uploadImage(recipeId, file, true);
      toast.success('Visual asset successfully synchronized');
      onUploaded?.(result);
      setFile(null);
      setPreview(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Synchronization failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-surface-200 p-8 shadow-premium">
      <header className="mb-8">
        <div className="flex items-center gap-3 text-secondary-500 mb-2">
          <FiImage size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Visual Identity</span>
        </div>
        <h3 className="text-2xl font-bold text-surface-900 tracking-tight">Image Configuration</h3>
        <p className="text-surface-400 text-xs font-medium mt-1">High-resolution cinematic shots recommended (Max 10MB)</p>
      </header>

      <div
        onClick={() => fileInputRef.current?.click()}
        className="relative group h-72 w-full rounded-[2.5rem] border-2 border-dashed border-surface-100 bg-surface-50/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-white transition-all overflow-hidden"
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
              exit={{ opacity: 0 }}
              className="absolute inset-0 w-full h-full"
            >
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-surface-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px]">
                <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white mb-3">
                   <FiEdit2 size={24} />
                </div>
                <p className="text-white font-bold text-xs uppercase tracking-widest">Replace Asset</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center p-10 text-center"
            >
              <div className="h-16 w-16 rounded-3xl bg-white border border-surface-100 shadow-soft flex items-center justify-center text-surface-300 group-hover:scale-110 group-hover:text-primary-500 group-hover:shadow-primary-100 transition-all">
                <FiUploadCloud size={28} />
              </div>
              <p className="text-surface-600 font-bold text-sm mt-6">Select or drop cinematic shot</p>
              <p className="text-surface-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">PNG, JPG, WEBP</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4 mt-8">
        {preview && !uploading && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFile(null);
              setPreview(null);
            }}
            className="h-12 w-12 rounded-xl bg-danger/5 text-danger flex items-center justify-center hover:bg-danger hover:text-white transition-all"
            title="Clear Selection"
          >
            <FiX size={20} />
          </button>
        )}
        <Button
          type="button"
          onClick={handleUpload}
          variant="primary"
          fullWidth
          size="lg"
          disabled={!file}
          isLoading={uploading}
          icon={<FiCheck />}
        >
          {uploading ? 'Synchronizing Archive...' : 'Commit Visual Asset'}
        </Button>
      </div>
    </div>
  );
};

export default RecipeImageUploader;

