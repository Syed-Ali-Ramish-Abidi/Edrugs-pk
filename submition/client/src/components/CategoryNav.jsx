import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Helper function to generate category links with query params
const getCatalogLink = (mainCategory, subCategory = null, itemType = null) => {
  let url = '/medicines';
  const params = new URLSearchParams();
  if (mainCategory) params.append('main', mainCategory);
  if (subCategory) params.append('sub', subCategory);
  if (itemType) params.append('item', itemType);
  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
};

export const categoriesData = [
  {
    name: 'Medicine',
    subcategories: [
      {
        name: 'Derma',
        subcategories: [
          { name: 'Eczema' },
          { name: 'Rashes' },
          { name: 'Acne' },
        ],
      },
      {
        name: 'Circulatory System',
        subcategories: [
          {
            name: 'Infections',
            subcategories: [
              { name: 'Bacterial' },
              { name: 'Viral' },
              { name: 'Fungal' },
            ],
          },
          { name: 'Blood Related' },
        ],
      },
      {
        name: 'Endocrine System',
        subcategories: [
          { name: 'Diabetes Management' },
          { name: 'Thyroid Care' }
        ],
      },
      {
        name: 'Eyes Nose Ear',
        subcategories: [
          { name: 'Eye Drops' },
          { name: 'Nasal Sprays' },
          { name: 'Ear Drops' }
        ],
      },
    ],
  },
  {
    name: 'Baby & Mother Care',
    subcategories: [
      {
        name: 'Diapers & Wipes',
        subcategories: [
          { name: 'Disposable Diapers' },
          { name: 'Baby Wipes' },
          { name: 'Rash Creams' }
        ]
      },
      {
        name: 'Baby Food',
        subcategories: [
          { name: 'Infant Formula' },
          { name: 'Baby Cereals' }
        ]
      }
    ],
  },
  {
    name: 'Nutritions & Supplements',
    subcategories: [
      {
        name: 'Vitamins',
        subcategories: [
          { name: 'Multi-vitamins' },
          { name: 'Vitamin C' },
          { name: 'Vitamin D' }
        ]
      },
      {
        name: 'Protein Supplements',
        subcategories: [
          { name: 'Whey Protein' },
          { name: 'Mass Gainers' }
        ]
      }
    ],
  },
  {
    name: 'Foods & Beverages',
    subcategories: [
      {
        name: 'Diet Foods',
        subcategories: [
          { name: 'Sugar Replacements' },
          { name: 'Low Calorie Snacks' }
        ]
      },
      {
        name: 'Health Drinks',
        subcategories: [
          { name: 'Energy Drinks' },
          { name: 'Electrolytes' }
        ]
      }
    ],
  },
  {
    name: 'Devices & Support',
    subcategories: [
      {
        name: 'Measuring Devices',
        subcategories: [
          { name: 'BP Monitors' },
          { name: 'Thermometers' },
          { name: 'Glucometers' }
        ]
      },
      {
        name: 'Supports & Braces',
        subcategories: [
          { name: 'Knee Caps' },
          { name: 'Back Belts' },
          { name: 'Neck Collars' }
        ]
      }
    ],
  },
  {
    name: 'Personal Care',
    subcategories: [
      {
        name: 'Hair Care',
        subcategories: [
          { name: 'Shampoo' },
          { name: 'Hair Oils' },
          { name: 'Hair Serums' }
        ]
      },
      {
        name: 'Skin Care',
        subcategories: [
          { name: 'Lotions & Creams' },
          { name: 'Face Washes' },
          { name: 'Sunblocks' }
        ]
      }
    ],
  },
  {
    name: 'OTC And Health Need',
    subcategories: [
      {
        name: 'Pain Relief',
        subcategories: [
          { name: 'Pain Balms' },
          { name: 'Sprays' },
          { name: 'Pain Patches' }
        ]
      },
      {
        name: 'First Aid',
        subcategories: [
          { name: 'Bandages' },
          { name: 'Antiseptics' },
          { name: 'Cotton & Gauze' }
        ]
      }
    ],
  },
]

export default function CategoryNav({ isMobile = false }) {
  // Mobile accordion state
  const [expandedCat, setExpandedCat] = useState(null)
  const [expandedSubCat, setExpandedSubCat] = useState(null)

  if (isMobile) {
    return (
      <div className="flex flex-col space-y-1">
        {categoriesData.map((cat) => (
          <div key={cat.name} className="flex flex-col">
            <button
              onClick={() => setExpandedCat(expandedCat === cat.name ? null : cat.name)}
              className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium w-full text-left focus:outline-none"
            >
              <span>{cat.name}</span>
              {cat.subcategories && cat.subcategories.length > 0 && (
                <ChevronDown size={16} className={`transition-transform duration-200 ${expandedCat === cat.name ? 'rotate-180' : ''}`} />
              )}
            </button>
            <AnimatePresence>
              {expandedCat === cat.name && cat.subcategories && cat.subcategories.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-gray-50 rounded-xl mx-2"
                >
                  {cat.subcategories.map((subcat) => (
                    <div key={subcat.name} className="flex flex-col border-b border-gray-100 last:border-none">
                      {subcat.subcategories && subcat.subcategories.length > 0 ? (
                        <button
                          onClick={() => setExpandedSubCat(expandedSubCat === subcat.name ? null : subcat.name)}
                          className="flex items-center justify-between px-4 py-2 text-sm text-gray-600 hover:text-teal-700 w-full text-left focus:outline-none"
                        >
                          <span>{subcat.name}</span>
                          <ChevronDown size={14} className={`transition-transform duration-200 ${expandedSubCat === subcat.name ? 'rotate-180' : ''}`} />
                        </button>
                      ) : (
                        <Link
                          to={getCatalogLink(cat.name, subcat.name)}
                          className="flex items-center justify-between px-4 py-2 text-sm text-gray-600 hover:text-teal-700 w-full text-left focus:outline-none"
                        >
                          <span>{subcat.name}</span>
                        </Link>
                      )}
                      <AnimatePresence>
                        {expandedSubCat === subcat.name && subcat.subcategories && subcat.subcategories.length > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-gray-100 rounded-b-xl"
                          >
                            {subcat.subcategories.map((subsubcat) => (
                              <Link
                                key={subsubcat.name}
                                to={getCatalogLink(cat.name, subcat.name, subsubcat.name)}
                                className="w-full text-left block px-6 py-2 text-sm text-gray-500 hover:text-teal-700 focus:outline-none"
                              >
                                {subsubcat.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="hidden md:block bg-teal-700 relative z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center whitespace-nowrap py-0">
          <ul className="flex items-center gap-0 w-full justify-between">
            {categoriesData.map((cat) => (
              <li key={cat.name} className="group relative">
                <button
                  className="inline-flex items-center gap-1 px-3 py-3 text-sm text-white/90 group-hover:text-white group-hover:bg-teal-600 transition-colors focus:outline-none"
                >
                  <span>{cat.name}</span>
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <ChevronDown size={14} className="opacity-70 transition-transform group-hover:rotate-180" />
                  )}
                </button>

                {/* Level 1 Dropdown */}
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <div className="absolute top-full left-0 w-64 bg-white shadow-xl border border-gray-100 py-2 rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]">
                    <ul className="flex flex-col">
                      {cat.subcategories.map((subcat) => (
                        <li key={subcat.name} className="group/sub relative">
                          {subcat.subcategories && subcat.subcategories.length > 0 ? (
                            <button
                              className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-teal-600 hover:text-white transition-colors focus:outline-none"
                            >
                              <span>{subcat.name}</span>
                              <ChevronRight size={14} className="opacity-70" />
                            </button>
                          ) : (
                            <Link
                              to={getCatalogLink(cat.name, subcat.name)}
                              className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-teal-600 hover:text-white transition-colors focus:outline-none"
                            >
                              <span>{subcat.name}</span>
                            </Link>
                          )}

                          {/* Level 2 Flyout (Right side) */}
                          {subcat.subcategories && subcat.subcategories.length > 0 && (
                            <div className="absolute top-0 left-full w-64 bg-white shadow-xl border border-gray-100 py-2 rounded-md ml-0.5 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 z-[110]">
                              <ul className="flex flex-col">
                                {subcat.subcategories.map((subsubcat) => (
                                  <li key={subsubcat.name}>
                                    <Link
                                      to={getCatalogLink(cat.name, subcat.name, subsubcat.name)}
                                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-teal-600 hover:text-white transition-colors focus:outline-none"
                                    >
                                      {subsubcat.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
