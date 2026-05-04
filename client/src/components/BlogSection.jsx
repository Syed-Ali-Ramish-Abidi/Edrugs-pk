import React from 'react';

const blogsData = [
  {
    id: 1,
    title: "Top 10 Cough Syrups in Pakistan for Dry Cough",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Winter Skincare Guide for Dry and Sensitive Skin",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop&q=80",
  },
  {
    id: 3,
    title: "Are Soft Drinks Safe During Pregnancy? Myths Busted",
    image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=200&h=200&fit=crop&q=80",
  },
  {
    id: 4,
    title: "Understanding the Symptoms of Vitamin D Deficiency",
    image: "https://images.unsplash.com/photo-1550572017-edb70267852c?w=200&h=200&fit=crop&q=80",
  },
  {
    id: 5,
    title: "5 Essential First Aid Items Every Home Must Have",
    image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=200&h=200&fit=crop&q=80",
  },
  {
    id: 6,
    title: "How to Manage Blood Sugar Levels Effectively at Home",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200&h=200&fit=crop&q=80",
  },
];

export default function BlogSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Blogs</h2>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-[10px] text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm">
          View All
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogsData.map((blog) => (
          <div
            key={blog.id}
            className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-[10px] transition-colors cursor-pointer group"
          >
            {/* Circular Image with Tint */}
            <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 relative border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-teal-600/20 mix-blend-multiply group-hover:bg-teal-600/10 transition-colors"></div>
            </div>

            {/* Blog Title */}
            <div>
              <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-teal-700 transition-colors">
                {blog.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
