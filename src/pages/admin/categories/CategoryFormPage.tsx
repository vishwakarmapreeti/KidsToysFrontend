import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X, Save } from 'lucide-react';
import categoryService from '../../../services/categoryService';

export default function CategoryFormPage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const isEdit     = Boolean(id);

  const [form, setForm]         = useState({ name: '', description: '' });
  const [image, setImage]       = useState<File | null>(null);
  const [preview, setPreview]   = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    if (isEdit && id) {
      categoryService.getCategory(id).then(res => {
        const cat = res.data.category;
        setForm({ name: cat.name, description: cat.description });
        setPreview(cat.image);
      });
    }
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      if (image) fd.append('image', image);

      if (isEdit && id) {
        await categoryService.updateCategory(id, fd);
      } else {
        await categoryService.createCategory(fd);
      }
      navigate('/admin/categories');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/categories')}
          className="p-2 rounded-xl hover:bg-neutral-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-600" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-neutral-900">
            {isEdit ? 'Edit Category' : 'Add Category'}
          </h2>
          <p className="text-sm text-neutral-500">
            {isEdit ? 'Update category details' : 'Create a new product category'}
          </p>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-5"
      >
        {error && (
          <div className="bg-red-50 text-red-600 rounded-xl p-3 text-sm">{error}</div>
        )}

        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Category Image
          </label>
          <div className="relative">
            {preview ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden border border-neutral-200">
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setImage(null); setPreview(''); }}
                  className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 transition-colors"
                >
                  <X className="w-4 h-4 text-neutral-600" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-neutral-300 rounded-xl cursor-pointer hover:border-[#FF6B6B] hover:bg-red-50/30 transition-all">
                <Upload className="w-8 h-8 text-neutral-400 mb-2" />
                <p className="text-sm text-neutral-500">Click to upload image</p>
                <p className="text-xs text-neutral-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Category Name <span className="text-red-500">*</span>
          </label>
          <input
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            required
            placeholder="e.g. Action Figures"
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            rows={3}
            placeholder="Short description of this category..."
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] transition-all resize-none"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-[#FF6B6B] text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-[#ff5252] transition-colors disabled:opacity-60 shadow-sm"
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Saving...' : isEdit ? 'Update Category' : 'Create Category'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/categories')}
            className="px-6 py-2.5 rounded-xl font-medium text-sm text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.form>
    </div>
  );
}