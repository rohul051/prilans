'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  FolderGit2, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Code2, 
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Layers
} from 'lucide-react';

export const PortfolioView: React.FC = () => {
  const { currentUser, addPortfolioItem, deletePortfolioItem } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [techInput, setTechInput] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const handleAddTech = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (t: string) => {
    setTechnologies(technologies.filter((tech) => tech !== t));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSaving(true);
    try {
      await addPortfolioItem({
        title,
        description,
        imageUrl: imageUrl.trim() || '',
        liveUrl,
        githubUrl,
        technologies,
      });

      // Reset
      setTitle('');
      setDescription('');
      setImageUrl('');
      setLiveUrl('');
      setGithubUrl('');
      setIsAdding(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const portfolio = currentUser?.portfolio || [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded uppercase tracking-wider">
              Student Showcase
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
            Student Portfolio Management
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Showcase your best academic and client projects to stand out to prospective employers.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Close Form' : 'Add New Project'}</span>
        </button>
      </div>

      {/* Add Project Form Drawer */}
      {isAdding && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md space-y-4 animate-in fade-in duration-200"
        >
          <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            <span>Add Project Showcase</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Project Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Campus Smart Attendance System"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Image / Mockup URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/project-screenshot.png"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Project Summary & Your Contributions
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what problem this project solved, the architecture, and tools you utilized..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 leading-relaxed"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Live Demo URL (Optional)
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://myproject.vercel.app"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                GitHub Repository (Optional)
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/myuser/myrepo"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          {/* Tech stack */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Technologies & Tools
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTech();
                  }
                }}
                placeholder="Type tech and press Add (e.g. Next.js, Firebase, Tailwind)"
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {technologies.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-medium"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(t)}
                    className="hover:text-red-600 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-sm"
            >
              {saving ? 'Saving...' : 'Add to Portfolio'}
            </button>
          </div>
        </form>
      )}

      {/* Portfolio Items Grid */}
      {portfolio.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-base mb-1">
            No portfolio projects added yet
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
            Upload your assignments, side-projects, design prototypes, and case studies to increase your proposal acceptance rate!
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl"
          >
            Create Your First Showcase
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              <div>
                <div className="h-44 bg-gray-100 overflow-hidden relative">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center text-slate-400">
                      <FolderGit2 className="w-10 h-10 mb-1" />
                      <span className="text-[11px] font-semibold text-slate-500">Project Showcase</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      onClick={() => deletePortfolioItem(item.id)}
                      className="p-1.5 bg-white/90 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg shadow-sm transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  <h4 className="font-bold text-gray-900 text-sm mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-gray-100 flex items-center justify-between text-xs mt-auto">
                <span className="text-[11px] text-gray-400">
                  Added on {item.createdAt}
                </span>

                <div className="flex items-center gap-2">
                  {item.githubUrl && (
                    <a
                      href={item.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                      title="View GitHub Repository"
                    >
                      <Code2 className="w-4 h-4" />
                    </a>
                  )}
                  {item.liveUrl && (
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
