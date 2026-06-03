import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, X, Save, Plus } from 'lucide-react';
import productService from '../../../services/productService';
import categoryService from '../../../services/categoryService';
import type { Category } from '../../../services/categoryService';

const AGE_GROUPS = ['0-2', '3-5', '6-8', '9-12', '13+'];

export default function ProductFormPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const isEdit   = Boolean(id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState('');

  const [form, setForm] = useState({
    name:          '',
    description:   '',
    price:         '',
    discountPrice: '',
    category:      '',
    brand:         '',
    stock:         '',
    ageGroup:      '',
    tags:          '',
    isFeatured:    false,
  });

  const [images, setImages]         = useState<File[]>([]);
  const [previews, setPreviews]     = useState<string[]>([]);
  const [existingImages, setExisting] = useState<string[]>([]);

  useEffect(() => {
    // Fetch categories
    categoryService.getCategories()
      .then(res => setCategories(res.data.categories));

    // If edit — fetch product
    if (isEdit && id) {
      productService.getProduct(id).then(res => {
        const p = res.data.product;
        setForm({
          name:          p.name,
          description:   p.description,
          price:         String(p.price),
          discountPrice: String(p.discountPrice || ''),
          category:      typeof p.category === 'object' ? p.category._id : p.category,
          brand:         p.brand,
          stock:         String(p.stock),
          ageGroup:      p.ageGroup,
          tags:          p.tags.join(', '),
          isFeatured:    p.isFeatured,
        });
        setExisting(p.images);
      });
    }
  }, [id]);

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setImages(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeNewImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const removeExistingImage = (idx: number) => {
    setExisting(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const fd = new FormData();
      fd.append('name',        form.name);
      fd.append('description', form.description);
      fd.append('price',       form.price);
      fd.append('discountPrice', form.discountPrice || '0');
      fd.append('category',    form.category);
      fd.append('brand',       form.brand);
      fd.append('stock',       form.stock);
      fd.append('ageGroup',    form.ageGroup);
      fd.append('isFeatured',  String(form.isFeatured));

      // Tags — array as JSON string
      const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      fd.append('tags', JSON.stringify(tagsArray));

      // New images
      images.forEach(img => fd.append('images', img));

      if (isEdit && id) {
        await productService.updateProduct(id, fd);
      } else {
        await productService.createProduct(fd);
      }

      navigate('/admin/products');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/products')} className="p-2 rounded-xl hover:bg-neutral-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-neutral-600" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-neutral-900">
            {isEdit ? 'Edit Product' : 'Add Product'}
          </h2>
          <p className="text-sm text-neutral-500">
            {isEdit ? 'Update product details' : 'Add a new product to your store'}
          </p>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {error && (
          <div className="bg-red-50 text-red-600 rounded-xl p-3 text-sm">{error}</div>
        )}

        {/* Images */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
          <h3 className="font-semibold text-neutral-900 mb-4">Product Images</h3>

          <div className="flex flex-wrap gap-3">
            {/* Existing images */}
            {existingImages.map((img, idx) => (
              <div key={idx} className="relative w-24 h-24">
                <img src={img} alt="" className="w-full h-full object-cover rounded-xl border border-neutral-200" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(idx)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* New image previews */}
            {previews.map((src, idx) => (
              <div key={idx} className="relative w-24 h-24">
                <img src={src} alt="" className="w-full h-full object-cover rounded-xl border border-neutral-200" />
                <button
                  type="button"
                  onClick={() => removeNewImage(idx)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Upload button */}
            {(existingImages.length + previews.length) < 5 && (
              <label className="w-24 h-24 border-2 border-dashed border-neutral-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#FF6B6B] hover:bg-red-50/30 transition-all">
                <Plus className="w-6 h-6 text-neutral-400" />
                <span className="text-xs text-neutral-400 mt-1">Add</span>
                <input type="file" accept="image/*" multiple onChange={handleImageAdd} className="hidden" />
              </label>
            )}
          </div>
          <p className="text-xs text-neutral-400 mt-3">Max 5 images. PNG, JPG, WEBP up to 5MB each.</p>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-neutral-900">Basic Information</h3>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Lego City Set"
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe the product..."
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] transition-all resize-none"
            />
          </div>

          {/* Category + Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] transition-all bg-white"
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Brand</label>
              <input
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="e.g. Lego"
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-neutral-900">Pricing & Stock</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                placeholder="1499"
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Discount Price (₹)
              </label>
              <input
                name="discountPrice"
                type="number"
                value={form.discountPrice}
                onChange={handleChange}
                min="0"
                placeholder="1199"
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                required
                min="0"
                placeholder="50"
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Additional */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-neutral-900">Additional Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Age Group</label>
              <select
                name="ageGroup"
                value={form.ageGroup}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] transition-all bg-white"
              >
                <option value="">Select age group</option>
                {AGE_GROUPS.map(a => (
                  <option key={a} value={a}>{a} years</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Tags <span className="text-xs text-neutral-400">(comma separated)</span>
              </label>
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="lego, blocks, city"
                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] transition-all"
              />
            </div>
          </div>

          {/* Featured toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-200 peer-checked:bg-[#FF6B6B] rounded-full transition-colors" />
              <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">Featured Product</p>
              <p className="text-xs text-neutral-500">Show on homepage featured section</p>
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-[#FF6B6B] text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-[#ff5252] transition-colors disabled:opacity-60 shadow-sm"
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-2.5 rounded-xl font-medium text-sm text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.form>
    </div>
  );
}
