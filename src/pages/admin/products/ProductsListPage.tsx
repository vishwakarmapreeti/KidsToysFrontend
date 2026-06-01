import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, Package, Star } from 'lucide-react';
import productService from '../../../services/productService';
import type { Product } from '../../../services/productService';

export default function ProductsListPage() {
  const [products, setProducts]   = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch]       = useState('');
  const [deleting, setDeleting]   = useState<string | null>(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = () => {
    setIsLoading(true);
    productService.getProducts({ limit: 100 })
      .then(res => setProducts(res.data.products))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    setDeleting(id);
    try {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch {
      alert('Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Products</h2>
          <p className="text-sm text-neutral-500">{products.length} total products</p>
        </div>
        <Link
          to="/admin/products/add"
          className="inline-flex items-center gap-2 bg-[#FF6B6B] text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-[#ff5252] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white rounded-xl border border-neutral-200 px-4 py-2.5 w-full sm:w-72">
        <Search className="w-4 h-4 text-neutral-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="text-sm text-neutral-700 focus:outline-none w-full"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {[1,2,3,4,5,6].map(j => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-neutral-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Package className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-500 font-medium">No products found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((product, idx) => {
                  const discount = product.discountPrice > 0
                    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                    : 0;

                  return (
                    <motion.tr
                      key={product._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className="hover:bg-neutral-50 transition-colors"
                    >
                      {/* Product */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-11 h-11 rounded-xl object-cover border border-neutral-100"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center">
                              <Package className="w-5 h-5 text-neutral-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-neutral-900 text-sm truncate max-w-[180px]">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span className="text-xs text-neutral-500">{product.ratings}</span>
                              {product.isFeatured && (
                                <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium ml-1">
                                  Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-neutral-600">
                          {typeof product.category === 'object' ? product.category.name : product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold text-sm text-neutral-900">
                            ₹{(product.discountPrice > 0 ? product.discountPrice : product.price).toLocaleString('en-IN')}
                          </p>
                          {discount > 0 && (
                            <p className="text-xs text-neutral-400 line-through">
                              ₹{product.price.toLocaleString('en-IN')}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          product.stock > 10
                            ? 'bg-green-100 text-green-700'
                            : product.stock > 0
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="p-2 rounded-lg hover:bg-blue-50 text-neutral-500 hover:text-blue-600 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id)}
                            disabled={deleting === product._id}
                            className="p-2 rounded-lg hover:bg-red-50 text-neutral-500 hover:text-red-600 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}