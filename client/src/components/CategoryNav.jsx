import React from 'react'
import { ChevronDown } from 'lucide-react'

const CATEGORIES = [
  'Medicine',
  'Baby & Mother Care',
  'Nutritions & Supplements',
  'Foods & Beverages',
  'Devices & Support',
  'Personal Care',
  'OTC And Health Need',
]

export default function CategoryNav() {
  return (
    <div className="bg-teal-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center overflow-x-auto whitespace-nowrap py-0 hide-scrollbar">
          <ul className="flex items-center gap-0 w-full justify-between">
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 px-3 py-3 text-sm text-white/90 hover:text-white hover:bg-teal-600 transition-colors"
                >
                  <span>{cat}</span>
                  <ChevronDown size={14} className="opacity-70" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
