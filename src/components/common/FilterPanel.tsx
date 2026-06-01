import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FilterPanelProps {
  onPriceChange: (min: number, max: number) => void;
  onAgeGroupChange: (ages: string[]) => void;
  onBrandChange: (brands: string[]) => void;
  onRatingChange: (rating: number) => void;
  activeFilters: {
    priceRange: [number, number];
    ageGroups: string[];
    brands: string[];
    minRating: number;
  };
  onReset: () => void;
}

const ageGroups = ['0-1', '2-3', '4-5', '6-8', '9-12', '13+'];
const brands = ['LEGO', 'Mattel', 'Hasbro', 'Fisher-Price', 'Melissa & Doug', 'Ravensburger'];
const ratings = [5, 4, 3, 2, 1];

export default function FilterPanel({
  onPriceChange,
  onAgeGroupChange,
  onBrandChange,
  onRatingChange,
  activeFilters,
  onReset,
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['price', 'age', 'brand', 'rating']));

  const toggleSection = (section: string) => {
    const updated = new Set(expandedSections);
    if (updated.has(section)) {
      updated.delete(section);
    } else {
      updated.add(section);
    }
    setExpandedSections(updated);
  };

  return (
    <div className="space-y-6">
      {/* Reset Button */}
      <button
        onClick={onReset}
        className="w-full px-4 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
      >
        Clear Filters
      </button>

      {/* Price Filter */}
      <div className="border-b border-neutral-200 pb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full mb-4"
        >
          <h3 className="font-semibold text-neutral-900">Price Range</h3>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedSections.has('price') ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.has('price') && (
          <div className="space-y-4">
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={activeFilters.priceRange[0]}
              onChange={(e) => onPriceChange(Number(e.target.value), activeFilters.priceRange[1])}
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={activeFilters.priceRange[1]}
              onChange={(e) => onPriceChange(activeFilters.priceRange[0], Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-neutral-600">
              ${activeFilters.priceRange[0]} - ${activeFilters.priceRange[1]}
            </div>
          </div>
        )}
      </div>

      {/* Age Group Filter */}
      <div className="border-b border-neutral-200 pb-6">
        <button
          onClick={() => toggleSection('age')}
          className="flex items-center justify-between w-full mb-4"
        >
          <h3 className="font-semibold text-neutral-900">Age Group</h3>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedSections.has('age') ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.has('age') && (
          <div className="space-y-2">
            {ageGroups.map((age) => (
              <label key={age} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeFilters.ageGroups.includes(age)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onAgeGroupChange([...activeFilters.ageGroups, age]);
                    } else {
                      onAgeGroupChange(activeFilters.ageGroups.filter((a) => a !== age));
                    }
                  }}
                  className="w-4 h-4 rounded border-neutral-300"
                />
                <span className="text-sm text-neutral-600">{age} years</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brand Filter */}
      <div className="border-b border-neutral-200 pb-6">
        <button
          onClick={() => toggleSection('brand')}
          className="flex items-center justify-between w-full mb-4"
        >
          <h3 className="font-semibold text-neutral-900">Brand</h3>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedSections.has('brand') ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.has('brand') && (
          <div className="space-y-2">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={activeFilters.brands.includes(brand)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onBrandChange([...activeFilters.brands, brand]);
                    } else {
                      onBrandChange(activeFilters.brands.filter((b) => b !== brand));
                    }
                  }}
                  className="w-4 h-4 rounded border-neutral-300"
                />
                <span className="text-sm text-neutral-600">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div>
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full mb-4"
        >
          <h3 className="font-semibold text-neutral-900">Rating</h3>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedSections.has('rating') ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.has('rating') && (
          <div className="space-y-2">
            {ratings.map((rating) => (
              <label key={rating} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  checked={activeFilters.minRating === rating}
                  onChange={() => onRatingChange(rating)}
                  className="w-4 h-4 rounded-full border-neutral-300"
                />
                <span className="text-sm text-neutral-600">{rating}+ Stars</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
