'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, X, Plus, Trash2 } from 'lucide-react';

const NewProductPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    images: [] as string[],
    category: 'Jeans',
    countInStock: 0,
    material: '',
    fit: 'Regular',
    wash: 'Dark',
    gender: 'Unisex',
    colors: ['Indigo'],
    waistSizes: [28, 30, 32, 34, 36],
    lengthSizes: [30, 32, 34],
    archiveTags: [] as string[],
    variations: [] as any[],
  });
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const extractDirectLink = (url: string) => {
    if (!url) return '';
    let processed = url.trim();
    
    // Google Search Links
    if (processed.includes('google.com/imgres')) {
      const match = processed.match(/imgurl=([^&]+)/);
      if (match) processed = decodeURIComponent(match[1]);
    }
    
    // Imgur Landing Pages
    if (processed.includes('imgur.com/') && !processed.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      const id = processed.split('/').pop();
      if (id && id.length >= 5) processed = `https://i.imgur.com/${id}.jpg`;
    }
    
    return processed;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to create product');
      
      router.push('/admin/products');
    } catch (err) {
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const addVariation = () => {
    setFormData({
      ...formData,
      variations: [
        ...formData.variations,
        {
          sku: `SKU-${Date.now()}`,
          color: 'Indigo',
          waistSize: 32,
          lengthSize: 32,
          countInStock: 5,
          price: formData.price,
          image: formData.image,
        }
      ]
    });
  };

  const removeVariation = (index: number) => {
    const newVariations = [...formData.variations];
    newVariations.splice(index, 1);
    setFormData({ ...formData, variations: newVariations });
  };

  return (
    <div className="bg-[#020202] min-h-screen relative py-24 px-6 md:px-12">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(20,20,20,1)_0%,_rgba(0,0,0,1)_100%)] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 border-b border-white/5 pb-12 gap-8">
          <div>
            <Link 
              href="/admin/products" 
              className="inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 hover:text-white transition-colors mb-8 italic"
            >
              <ChevronLeft className="w-3 h-3" />
              <span>EXIT CURATOR</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-extralight uppercase tracking-tighter text-white">
              ARCHIVE <span className="font-medium">NEW PIECE</span>
            </h1>
            <p className="text-[10px] tracking-[0.6em] text-white/40 uppercase font-bold italic mt-4">
              PRODUCT DETAILS
            </p>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center space-x-3 bg-white text-black px-12 py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-blue-500 hover:text-white transition-all duration-500 shadow-lg shadow-white/5 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'INITIALIZING...' : 'SAVE TO ARCHIVE'}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-12">
            <div className="space-y-4 border-b border-white/10 pb-4">
              <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">NAME</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-transparent text-white text-[11px] tracking-[0.2em] uppercase focus:outline-none placeholder:text-gray-800"
                placeholder="PRODUCT NAME"
              />
            </div>

            <div className="space-y-4 border-b border-white/10 pb-4">
              <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">PRICE</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full bg-transparent text-white text-[11px] tracking-[0.2em] uppercase focus:outline-none placeholder:text-gray-800"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-4 border-b border-white/10 pb-4">
              <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">IMAGE URL</label>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    onBlur={(e) => setFormData({ ...formData, image: extractDirectLink(e.target.value) })}
                    className="w-full bg-transparent text-white text-[11px] tracking-[0.2em] focus:outline-none placeholder:text-gray-800"
                    placeholder="https://..."
                  />
                </div>
                {formData.image && (
                  <div className="w-16 h-16 bg-white/5 border border-white/10 overflow-hidden">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => (e.target as HTMLImageElement).src = '/favicon.ico'}
                    />
                  </div>
                )}
              </div>
              <p className="text-[7px] text-white/20 uppercase tracking-widest mt-2">Pasting a Google or Imgur link? We'll try to extract the direct link for you.</p>
            </div>

            <div className="space-y-4 border-b border-white/10 pb-4">
              <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">MATERIAL</label>
              <input
                type="text"
                required
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="w-full bg-transparent text-white text-[11px] tracking-[0.2em] uppercase focus:outline-none placeholder:text-gray-800"
                placeholder="100% ORGANIC COTTON"
              />
            </div>
          </div>

          <div className="space-y-12">
            <div className="space-y-4 border-b border-white/10 pb-4">
              <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">DESCRIPTION</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-transparent text-white text-[11px] tracking-[0.2em] focus:outline-none placeholder:text-gray-800 min-h-[100px]"
                placeholder="ARCHIVE DESCRIPTION..."
              />
            </div>

            <div className="space-y-4 border-b border-white/10 pb-4">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">GALLERY IMAGES (URLs)</label>
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, images: [...(formData.images || []), ''] })}
                  className="text-[8px] font-bold uppercase tracking-[0.2em] text-blue-500 hover:text-white transition-colors"
                >
                  + ADD IMAGE
                </button>
              </div>
              <div className="space-y-4">
                {(formData.images || []).map((img: string, idx: number) => (
                  <div key={idx} className="flex items-center space-x-4">
                    <div className="flex-1 flex flex-col gap-2">
                      <input
                        type="text"
                        value={img}
                        onChange={(e) => {
                          const newImages = [...formData.images];
                          newImages[idx] = e.target.value;
                          setFormData({ ...formData, images: newImages });
                        }}
                        onBlur={(e) => {
                          const newImages = [...formData.images];
                          newImages[idx] = extractDirectLink(e.target.value);
                          setFormData({ ...formData, images: newImages });
                        }}
                        className="w-full bg-transparent text-white text-[10px] tracking-[0.1em] focus:outline-none border-b border-white/5 pb-2"
                        placeholder="https://..."
                      />
                      {img && (
                        <div className="w-12 h-12 bg-white/5 border border-white/10 overflow-hidden">
                          <img 
                            src={img} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => (e.target as HTMLImageElement).src = '/favicon.ico'}
                          />
                        </div>
                      )}
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        const newImages = [...formData.images];
                        newImages.splice(idx, 1);
                        setFormData({ ...formData, images: newImages });
                      }}
                      className="text-white/20 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-4 border-b border-white/10 pb-4">
                <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">FIT</label>
                <select
                  value={formData.fit}
                  onChange={(e) => setFormData({ ...formData, fit: e.target.value })}
                  className="w-full bg-transparent text-white text-[10px] font-bold uppercase tracking-[0.2em] focus:outline-none appearance-none"
                >
                  <option value="Slim" className="bg-black">Slim</option>
                  <option value="Regular" className="bg-black">Regular</option>
                  <option value="Relaxed" className="bg-black">Relaxed</option>
                  <option value="Skinny" className="bg-black">Skinny</option>
                  <option value="Straight" className="bg-black">Straight</option>
                </select>
              </div>

              <div className="space-y-4 border-b border-white/10 pb-4">
                <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">WASH</label>
                <select
                  value={formData.wash}
                  onChange={(e) => setFormData({ ...formData, wash: e.target.value })}
                  className="w-full bg-transparent text-white text-[10px] font-bold uppercase tracking-[0.2em] focus:outline-none appearance-none"
                >
                  <option value="Dark" className="bg-black">Dark</option>
                  <option value="Medium" className="bg-black">Medium</option>
                  <option value="Light" className="bg-black">Light</option>
                  <option value="Black" className="bg-black">Black</option>
                  <option value="Acid Wash" className="bg-black">Acid Wash</option>
                </select>
              </div>

              <div className="space-y-4 border-b border-white/10 pb-4">
                <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">GENDER</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-transparent text-white text-[10px] font-bold uppercase tracking-[0.2em] focus:outline-none appearance-none"
                >
                  <option value="Men" className="bg-black">Men</option>
                  <option value="Women" className="bg-black">Women</option>
                  <option value="Unisex" className="bg-black">Unisex</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 border-b border-white/10 pb-4">
              <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">ARCHIVE SECTIONS</label>
              <div className="flex flex-wrap gap-3">
                {['older','high_demand','running_out','rare_drop'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      const has = formData.archiveTags.includes(tag);
                      setFormData({
                        ...formData,
                        archiveTags: has ? formData.archiveTags.filter(t => t !== tag) : [...formData.archiveTags, tag]
                      });
                    }}
                    className={`px-6 py-2 text-[10px] font-bold uppercase border transition-all ${
                      formData.archiveTags.includes(tag) ? 'border-blue-500 bg-blue-500 text-white' : 'border-white/20 text-gray-400 hover:border-white/50'
                    }`}
                  >
                    {tag.replace('_',' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 border-b border-white/10 pb-4">
              <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">STOCK COUNT</label>
              <input
                type="number"
                required
                value={formData.countInStock}
                onChange={(e) => setFormData({ ...formData, countInStock: parseInt(e.target.value) })}
                className="w-full bg-transparent text-white text-[11px] tracking-[0.2em] uppercase focus:outline-none placeholder:text-gray-800"
                placeholder="0"
              />
            </div>

            <div className="space-y-8 pt-8">
              <div className="space-y-4">
                <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">AVAILABLE COLORS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={formData.colors?.join(', ')}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
                  className="w-full bg-transparent text-white text-[11px] tracking-[0.2em] uppercase focus:outline-none border-b border-white/5 pb-2"
                  placeholder="Indigo, Black, Light Blue"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">WAIST SIZES (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={formData.waistSizes?.join(', ')}
                  onChange={(e) => setFormData({ ...formData, waistSizes: e.target.value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)) })}
                  className="w-full bg-transparent text-white text-[11px] tracking-[0.2em] uppercase focus:outline-none border-b border-white/5 pb-2"
                  placeholder="28, 30, 32, 34"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/40">LENGTH SIZES (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={formData.lengthSizes?.join(', ')}
                  onChange={(e) => setFormData({ ...formData, lengthSizes: e.target.value.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)) })}
                  className="w-full bg-transparent text-white text-[11px] tracking-[0.2em] uppercase focus:outline-none border-b border-white/5 pb-2"
                  placeholder="30, 32, 34"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Variations Section */}
        <div className="mt-32 border-t border-white/5 pt-16">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 italic">PIECE VARIATIONS</h2>
            <button 
              onClick={addVariation}
              className="text-[9px] font-bold uppercase tracking-[0.3em] text-white hover:text-blue-500 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-3 h-3" />
              <span>ADD VARIATION</span>
            </button>
          </div>

          <div className="space-y-8">
            {formData.variations.map((v, i) => (
              <div key={i} className="bg-white/5 p-8 grid grid-cols-1 md:grid-cols-7 gap-8 items-end relative border border-white/5">
                <button 
                  onClick={() => removeVariation(i)}
                  className="absolute top-4 right-4 text-white/20 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="space-y-2 col-span-1">
                  <label className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">SKU</label>
                  <input
                    type="text"
                    value={v.sku}
                    onChange={(e) => {
                      const newVariations = [...formData.variations];
                      newVariations[i].sku = e.target.value;
                      setFormData({ ...formData, variations: newVariations });
                    }}
                    className="w-full bg-transparent text-white text-[10px] tracking-[0.1em] uppercase focus:outline-none border-b border-white/10"
                  />
                </div>

                <div className="space-y-2 col-span-1">
                  <label className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">COLOR</label>
                  <input
                    type="text"
                    value={v.color}
                    onChange={(e) => {
                      const newVariations = [...formData.variations];
                      newVariations[i].color = e.target.value;
                      setFormData({ ...formData, variations: newVariations });
                    }}
                    className="w-full bg-transparent text-white text-[10px] tracking-[0.1em] uppercase focus:outline-none border-b border-white/10"
                  />
                </div>

                <div className="space-y-2 col-span-1">
                  <label className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">WAIST</label>
                  <input
                    type="number"
                    value={v.waistSize}
                    onChange={(e) => {
                      const newVariations = [...formData.variations];
                      newVariations[i].waistSize = parseInt(e.target.value);
                      setFormData({ ...formData, variations: newVariations });
                    }}
                    className="w-full bg-transparent text-white text-[10px] tracking-[0.1em] focus:outline-none border-b border-white/10"
                  />
                </div>

                <div className="space-y-2 col-span-1">
                  <label className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">LENGTH</label>
                  <input
                    type="number"
                    value={v.lengthSize}
                    onChange={(e) => {
                      const newVariations = [...formData.variations];
                      newVariations[i].lengthSize = parseInt(e.target.value);
                      setFormData({ ...formData, variations: newVariations });
                    }}
                    className="w-full bg-transparent text-white text-[10px] tracking-[0.1em] focus:outline-none border-b border-white/10"
                  />
                </div>

                <div className="space-y-2 col-span-1">
                  <label className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">PRICE</label>
                  <input
                    type="number"
                    value={v.price}
                    onChange={(e) => {
                      const newVariations = [...formData.variations];
                      newVariations[i].price = parseFloat(e.target.value);
                      setFormData({ ...formData, variations: newVariations });
                    }}
                    className="w-full bg-transparent text-white text-[10px] tracking-[0.1em] focus:outline-none border-b border-white/10"
                  />
                </div>

                <div className="space-y-2 col-span-1">
                  <label className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">STOCK</label>
                  <input
                    type="number"
                    value={v.countInStock}
                    onChange={(e) => {
                      const newVariations = [...formData.variations];
                      newVariations[i].countInStock = parseInt(e.target.value);
                      setFormData({ ...formData, variations: newVariations });
                    }}
                    className="w-full bg-transparent text-white text-[10px] tracking-[0.1em] focus:outline-none border-b border-white/10"
                  />
                </div>

                <div className="space-y-2 col-span-1">
                  <label className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">IMAGE</label>
                  <input
                    type="text"
                    value={v.image}
                    onChange={(e) => {
                      const newVariations = [...formData.variations];
                      newVariations[i].image = e.target.value;
                      setFormData({ ...formData, variations: newVariations });
                    }}
                    className="w-full bg-transparent text-white text-[8px] tracking-[0.1em] focus:outline-none border-b border-white/10"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProductPage;
