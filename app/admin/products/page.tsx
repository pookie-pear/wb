'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Edit2, ChevronLeft, Package, Save, ChevronDown } from 'lucide-react';
import { IProductData, IVariation } from '@/models/Product';

const AdminProductsPage = () => {
  const [products, setProducts] = useState<IProductData[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProductData[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        console.log('Fetching products from /api/products...');
        const res = await fetch('/api/products');
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error('API Error Response:', errorData);
          throw new Error(`API returned ${res.status}: ${JSON.stringify(errorData)}`);
        }

        const data = await res.json();
        console.log('Received data type:', typeof data);
        console.log('Is array?', Array.isArray(data));
        
        if (Array.isArray(data)) {
          setProducts(data);
          setFilteredProducts(data);
        } else {
          console.error('Data fetched is not an array. Actual data:', data);
          setProducts([]);
          setFilteredProducts([]);
        }
      } catch (err) {
        console.error('Critical Fetch Error:', err);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Check for admin access
    const userStr = localStorage.getItem('user');
    try {
      const user = userStr ? JSON.parse(userStr) : null;
      if (!user || !user.isAdmin) {
        router.push('/login');
        return;
      }
    } catch (err) {
      console.error('Auth check error', err);
      router.push('/login');
      return;
    }

    fetchProducts();
  }, [router]);

  useEffect(() => {
    if (!Array.isArray(products)) {
      setFilteredProducts([]);
      return;
    }
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.fit.toLowerCase().includes(search.toLowerCase()) ||
      p.wash.toLowerCase().includes(search.toLowerCase()) ||
      (p._id && p._id.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredProducts(filtered);
  }, [search, products]);

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this item from the archive?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
      }
    } catch (err) {
      alert('Failed to remove product');
    }
  };
  
  const toggleTag = (id: string, tag: string) => {
    setProducts(prev => prev.map(p => {
      if (p._id === id) {
        const tags = p.archiveTags || [];
        const has = tags.includes(tag);
        return { ...p, archiveTags: has ? tags.filter((t: string) => t !== tag) : [...tags, tag] };
      }
      return p;
    }));
    setFilteredProducts(prev => prev.map(p => {
      if (p._id === id) {
        const tags = p.archiveTags || [];
        const has = tags.includes(tag);
        return { ...p, archiveTags: has ? tags.filter((t: string) => t !== tag) : [...tags, tag] };
      }
      return p;
    }));
  };
  
  const updateVariationField = (id: string, index: number, field: keyof IVariation, value: string | number) => {
    setProducts(prev => prev.map(p => {
      if (p._id === id) {
        const vars = [...(p.variations || [])];
        vars[index] = { ...vars[index], [field]: value } as IVariation;
        return { ...p, variations: vars };
      }
      return p;
    }));
    setFilteredProducts(prev => prev.map(p => {
      if (p._id === id) {
        const vars = [...(p.variations || [])];
        vars[index] = { ...vars[index], [field]: value } as IVariation;
        return { ...p, variations: vars };
      }
      return p;
    }));
  };
  
  const addVariation = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p._id === id) {
        const vars = [...(p.variations || [])];
        vars.push({
          sku: `SKU-${Date.now()}`,
          color: 'Indigo',
          waistSize: 32,
          lengthSize: 32,
          countInStock: 5,
          price: p.price,
          image: p.image,
        });
        return { ...p, variations: vars };
      }
      return p;
    }));
    setFilteredProducts(prev => prev.map(p => {
      if (p._id === id) {
        const vars = [...(p.variations || [])];
        vars.push({
          sku: `SKU-${Date.now()}`,
          color: 'Indigo',
          waistSize: 32,
          lengthSize: 32,
          countInStock: 5,
          price: p.price,
          image: p.image,
        });
        return { ...p, variations: vars };
      }
      return p;
    }));
  };
  
  const removeVariation = (id: string, index: number) => {
    setProducts(prev => prev.map(p => {
      if (p._id === id) {
        const vars = [...(p.variations || [])];
        vars.splice(index, 1);
        return { ...p, variations: vars };
      }
      return p;
    }));
    setFilteredProducts(prev => prev.map(p => {
      if (p._id === id) {
        const vars = [...(p.variations || [])];
        vars.splice(index, 1);
        return { ...p, variations: vars };
      }
      return p;
    }));
  };
  
  const saveProduct = async (id: string) => {
    const current = products.find(p => p._id === id);
    if (!current) return;
    try {
      const vars: IVariation[] = current.variations || [];
      const colors = vars.length ? Array.from(new Set(vars.map(v => v.color).filter(Boolean))) : (current.colors || []);
      const waistSizes = vars.length ? Array.from(new Set(vars.map(v => v.waistSize).filter((n: number) => !isNaN(n)))).sort((a: number, b: number) => a - b) : (current.waistSizes || []);
      const lengthSizes = vars.length ? Array.from(new Set(vars.map(v => v.lengthSize).filter((n: number) => !isNaN(n)))).sort((a: number, b: number) => a - b) : (current.lengthSizes || []);
      const totalStock = vars.length ? vars.reduce((sum: number, v: IVariation) => sum + (v.countInStock || 0), 0) : (current.countInStock || 0);
      const payload = { ...current, colors, waistSizes, lengthSizes, countInStock: totalStock };
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update');
      const updated = await res.json();
      setProducts(prev => prev.map(p => p._id === id ? updated : p));
      setFilteredProducts(prev => prev.map(p => p._id === id ? updated : p));
      alert('Saved changes');
    } catch (err) {
      alert('Failed to save changes');
    }
  };

  return (
    <div className="bg-[#020202] min-h-screen relative py-24 px-6 md:px-12">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(20,20,20,1)_0%,_rgba(0,0,0,1)_100%)] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 border-b border-white/5 pb-12 gap-8">
          <div>
            <Link 
              href="/" 
              className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 hover:text-white transition-colors mb-8 italic"
            >
              <ChevronLeft className="w-3 h-3" />
              <span>EXIT ARCHIVE</span>
            </Link>
            <h1 className="text-4xl md:text-6xl font-extralight uppercase tracking-tighter text-white">
              ADMIN <span className="font-medium">CURATOR</span>
            </h1>
            <p className="text-[10px] tracking-[0.6em] text-white/40 uppercase font-bold italic mt-4">
              MANAGE COLLECTION
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-8">
            <div className="relative">
              <input
                type="text"
                placeholder="SEARCH ARCHIVE..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white/5 border border-white/10 px-12 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white focus:outline-none focus:border-blue-500 transition-all min-w-[300px]"
              />
            </div>
            <Link 
              href="/admin/products/new"
              className="flex items-center justify-center space-x-3 bg-white text-black px-10 py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-blue-500 hover:text-white transition-all duration-500 shadow-lg shadow-white/5"
            >
              <Plus className="w-4 h-4" />
              <span>ARCHIVE NEW PIECE</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-48 opacity-20">
            <p className="text-[10px] uppercase tracking-[1em] font-light italic">SYNCHRONIZING ARCHIVE...</p>
          </div>
        ) : (!Array.isArray(filteredProducts) || filteredProducts.length === 0) ? (
          <div className="text-center py-48 opacity-20 border border-dashed border-white/10">
            <Package className="w-12 h-12 mx-auto mb-6 opacity-40" />
            <p className="text-[10px] uppercase tracking-[1em] font-light italic">THE ARCHIVE IS CURRENTLY EMPTY</p>
          </div>
        ) : (
          <div className="border border-white/10">
            <div className="grid grid-cols-[80px_1.5fr_1fr_1fr_1fr_220px] items-center px-4 py-3 text-[9px] font-bold uppercase tracking-[0.3em] bg-white/5 border-b border-white/10">
              <span>Item</span>
              <span>Name</span>
              <span>Category</span>
              <span>Price</span>
              <span>Stock</span>
              <span>Actions</span>
            </div>
            <div className="divide-y divide-white/10">
              {filteredProducts.map((p) => {
                if (!p || !p._id) return null;
                const pId = p._id;
                return (
                  <div key={pId} className="px-4 py-4">
                    <div className="grid grid-cols-[80px_1.8fr_1fr_0.9fr_1fr_220px] items-center gap-4">
                      <div className="relative h-16 w-12 bg-white/5 border border-white/10">
                        <Image src={p.image || ''} alt={p.name || ''} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">{p.name}</div>
                        <div className="text-[8px] text-white/40 uppercase tracking-[0.2em] italic">{p.fit} / {p.wash} / {p.gender}</div>
                        <div className="mt-1 text-[8px] text-white/50 uppercase tracking-[0.2em]">
                          <span className="mr-3">Material: {p.material}</span>
                          <span className="mr-3">Rating: {(p.rating || 0).toFixed(1)}</span>
                          <span>Reviews: {p.numReviews || 0}</span>
                        </div>
                        <div className="mt-1 text-[8px] text-white/50 uppercase tracking-[0.2em]">
                          <span className="mr-3">Colors: {(p.colors || []).join(', ')}</span>
                          <span className="mr-3">Waist: {(p.waistSizes || []).join(', ')}</span>
                          <span>Length: {(p.lengthSizes || []).join(', ')}</span>
                        </div>
                      </div>
                      <div className="text-[8px] text-white/60 uppercase tracking-[0.2em]">{p.category}</div>
                      <div className="text-[10px] font-black text-white italic tracking-tighter">${(p.price || 0).toFixed(2)}</div>
                      <div className="text-[8px] font-bold uppercase tracking-[0.3em]">
                        {(() => {
                          const vars = Array.isArray(p.variations) ? p.variations : [];
                          const total = vars.length > 0 ? vars.reduce((s: number, v: IVariation) => s + (v.countInStock || 0), 0) : (p.countInStock || 0);
                          return <span className={total < 10 ? 'text-red-500' : 'text-white/60'}>{total} UNITS</span>;
                        })()}
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => router.push(`/admin/products/edit/${pId}`)} className="px-3 py-2 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition" title="Edit">
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button onClick={() => deleteProduct(pId)} className="px-3 py-2 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition" title="Remove">
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <button onClick={() => saveProduct(pId)} className="px-3 py-2 bg-white text-black hover:bg-blue-500 hover:text-white transition font-black text-[9px] uppercase tracking-[0.3em]" title="Save">
                          <Save className="w-3 h-3" />
                        </button>
                        <button onClick={() => setExpanded(expanded === pId ? null : pId)} className="px-3 py-2 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition" title="Toggle Details">
                          <ChevronDown className={`w-3 h-3 transition-transform ${expanded === pId ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>
                    
                    <div className={`mt-4 overflow-hidden transition-all ${expanded === pId ? 'max-h-[1000px]' : 'max-h-0'}`}>
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_80px] gap-4 items-end p-4 bg-white/5 border border-white/10">
                        <div className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/40 md:col-span-7">Variations</div>
                        {(Array.isArray(p.variations) ? p.variations : []).map((v: IVariation, idx: number) => (
                          <div key={idx} className="contents">
                            <div>
                              <label className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">SKU</label>
                              <input value={v.sku} onChange={(e) => updateVariationField(pId, idx, 'sku', e.target.value)} className="w-full bg-transparent text-white text-[10px] border-b border-white/10 focus:outline-none" />
                            </div>
                            <div>
                              <label className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">Color</label>
                              <input value={v.color} onChange={(e) => updateVariationField(pId, idx, 'color', e.target.value)} className="w-full bg-transparent text-white text-[10px] border-b border-white/10 focus:outline-none" />
                            </div>
                            <div>
                              <label className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">Waist</label>
                              <input type="number" value={v.waistSize} onChange={(e) => updateVariationField(pId, idx, 'waistSize', parseInt(e.target.value))} className="w-full bg-transparent text-white text-[10px] border-b border-white/10 focus:outline-none" />
                            </div>
                            <div>
                              <label className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">Length</label>
                              <input type="number" value={v.lengthSize} onChange={(e) => updateVariationField(pId, idx, 'lengthSize', parseInt(e.target.value))} className="w-full bg-transparent text-white text-[10px] border-b border-white/10 focus:outline-none" />
                            </div>
                            <div>
                              <label className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">Price</label>
                              <input type="number" value={v.price} onChange={(e) => updateVariationField(pId, idx, 'price', parseFloat(e.target.value))} className="w-full bg-transparent text-white text-[10px] border-b border-white/10 focus:outline-none" />
                            </div>
                            <div>
                              <label className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">Stock</label>
                              <input type="number" value={v.countInStock} onChange={(e) => updateVariationField(pId, idx, 'countInStock', parseInt(e.target.value))} className="w-full bg-transparent text-white text-[10px] border-b border-white/10 focus:outline-none" />
                            </div>
                            <div className="flex items-end">
                              <button onClick={() => removeVariation(pId, idx)} className="px-3 py-2 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition" title="Remove Variation">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                        <div className="md:col-span-7">
                          <button onClick={() => addVariation(pId)} className="text-[9px] font-bold uppercase tracking-[0.3em] text-white hover:text-blue-500 transition-colors flex items-center space-x-2">
                            <Plus className="w-3 h-3" />
                            <span>Add Variation</span>
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2 items-center">
                        <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/40">Archive Sections:</span>
                        {['older','high_demand','running_out','rare_drop'].map(tag => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(pId, tag)}
                            className={`px-4 py-1 text-[9px] font-bold uppercase border transition-all ${
                              (p.archiveTags || []).includes(tag) ? 'border-blue-500 bg-blue-500 text-white' : 'border-white/20 text-gray-400 hover:border-white/50'
                            }`}
                          >
                            {tag.replace('_',' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;