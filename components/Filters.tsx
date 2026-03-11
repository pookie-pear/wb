'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, Filter as FilterIcon } from 'lucide-react';

const FITS = ['Slim', 'Regular', 'Relaxed', 'Skinny', 'Straight'];
const WASHES = ['Dark', 'Medium', 'Light', 'Black', 'Acid Wash'];
const GENDERS = ['Men', 'Women', 'Unisex'];
const SIZES = [26, 28, 30, 32, 34, 36, 38, 40];

interface FilterSectionProps {
  title: string;
  options: (string | number)[];
  current: string | null;
  paramKey: string;
  onUpdate: (key: string, value: string | null) => void;
}

const FilterSection = ({ title, options, current, paramKey, onUpdate }: FilterSectionProps) => (
  <div className="mb-8">
    <h4 className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.3em] mb-4">{title}</h4>
    <div className="flex flex-wrap gap-x-6 gap-y-3">
      {Array.isArray(options) && options.map((opt: string | number) => (
        <button
          key={opt}
          onClick={() => onUpdate(paramKey, current === String(opt) ? null : String(opt))}
          className={`text-[10px] uppercase tracking-[0.2em] transition-all ${
            current === String(opt)
              ? 'text-white font-bold'
              : 'text-gray-600 hover:text-gray-300'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const Filters = ({ basePath = '/' }: { basePath?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentFit = searchParams.get('fit');
  const currentWash = searchParams.get('wash');
  const currentGender = searchParams.get('gender');
  const currentSize = searchParams.get('size');
  const currentSort = searchParams.get('sort') || 'newest';

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-transparent py-8">
      <div className="w-full px-4 md:px-0">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-3 text-white group"
          >
            <FilterIcon className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Filter</span>
            <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          <div className="flex items-center space-x-8">
            <span className="text-gray-600 text-[9px] font-bold uppercase tracking-[0.3em]">Sort</span>
            <select 
              value={currentSort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="bg-transparent text-white text-[10px] font-bold uppercase tracking-[0.2em] focus:outline-none cursor-pointer appearance-none"
            >
              <option value="newest" className="bg-black">Newest</option>
              <option value="price-low" className="bg-black">Price +</option>
              <option value="price-high" className="bg-black">Price -</option>
              <option value="rating" className="bg-black">Rating</option>
            </select>
          </div>
        </div>

        {/* Expandable Filter Menu */}
        <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isOpen ? 'max-h-[1000px] pt-12 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <FilterSection title="Fit" options={FITS} current={currentFit} paramKey="fit" onUpdate={updateFilter} />
            <FilterSection title="Wash" options={WASHES} current={currentWash} paramKey="wash" onUpdate={updateFilter} />
            <FilterSection title="Gender" options={GENDERS} current={currentGender} paramKey="gender" onUpdate={updateFilter} />
            <FilterSection title="Size" options={SIZES} current={currentSize} paramKey="size" onUpdate={updateFilter} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
