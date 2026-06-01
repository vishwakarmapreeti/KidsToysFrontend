import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, Tag } from 'lucide-react';
import categoryService from '../../../services/categoryService';
import type { Category } from '../../../services/categoryService';

export default function CategoriesListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [search, setSearch]         = useState('');
  const [deleting, setDeleting]     = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setIsLoading(true);
    categoryService.getCategories()
      .then(res => setCategories(res.data.categories))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    setDeleting(id);
    try {
      await categoryService.deleteCategory(id);
      setCategories(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      alert('Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Categories</h2>
          <p className="text-sm text-neutral-500">{categories.length} total categories</p>
        </div>
        <Link
          to="/admin/categories/add"
          className="inline-flex items-center gap-2 bg-[#FF6B6B] text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-[#ff5252] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white rounded-xl border border-neutral-200 px-4 py-2.5 w-full sm:w-72">
        <Search className="w-4 h-4 text-neutral-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search categories..."
          className="text-sm text-neutral-700 focus:outline-none w-full"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              {['Category', 'Slug', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {[1,2,3,4].map(j => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 bg-neutral-200 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-neutral-500">
                  No categories found
                </td>
              </tr>
            ) : (
              filtered.map((cat, idx) => (
                <motion.tr
                  key={cat._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="hover:bg-neutral-50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-10 h-10 rounded-xl object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
                          <Tag className="w-5 h-5 text-neutral-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-neutral-900 text-sm">{cat.name}</p>
                        <p className="text-xs text-neutral-500 line-clamp-1">{cat.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <code className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-lg">
                      {cat.slug}
                    </code>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/categories/edit/${cat._id}`}
                        className="p-2 rounded-lg hover:bg-blue-50 text-neutral-500 hover:text-blue-600 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        disabled={deleting === cat._id}
                        className="p-2 rounded-lg hover:bg-red-50 text-neutral-500 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}