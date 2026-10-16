import { useState } from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { useAppStore } from '../hooks/useAppStore';
import { useTranslation } from '../hooks/useTranslation';
import { useToast } from '../hooks/useToast';
import { knowledgeArticles } from '../data/knowledgeArticles';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import type { KnowledgeArticle } from '../types';

export function KnowledgePage() {
  const { state, dispatch } = useAppStore();
  const { t } = useTranslation();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [readingArticle, setReadingArticle] = useState<KnowledgeArticle | null>(null);

  // Filter articles
  const filteredArticles = knowledgeArticles.filter((article) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || article.category === selectedCategory;

    const matchesSaved = !showSavedOnly || state.savedArticles.includes(article.id);

    return matchesSearch && matchesCategory && matchesSaved;
  });

  const toggleSaveArticle = (articleId: string) => {
    dispatch({ type: 'TOGGLE_SAVED_ARTICLE', payload: articleId });
    const isSaved = state.savedArticles.includes(articleId);
    addToast(isSaved ? 'Article removed from saved bookmarks.' : 'Article saved to your bookmarks!', 'info');
  };

  const categories = [
    { key: 'all', label: t.knowledge.allCategories },
    { key: 'soil-health', label: t.knowledge.categories['soil-health'] },
    { key: 'organic-farming', label: t.knowledge.categories['organic-farming'] },
    { key: 'natural-farming', label: t.knowledge.categories['natural-farming'] },
    { key: 'composting', label: t.knowledge.categories['composting'] },
    { key: 'crop-rotation', label: t.knowledge.categories['crop-rotation'] },
    { key: 'soil-testing', label: t.knowledge.categories['soil-testing'] },
    { key: 'farm-economics', label: t.knowledge.categories['farm-economics'] },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">{t.knowledge.title}</h1>
            <StatusBadge status="verified" />
          </div>
          <p className="text-sm text-gray-500 mt-1">{t.knowledge.subtitle}</p>
        </div>

        <button
          onClick={() => setShowSavedOnly(!showSavedOnly)}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            showSavedOnly
              ? 'bg-forest-800 text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>{t.knowledge.savedArticles} ({state.savedArticles.length})</span>
        </button>
      </div>

      {/* Search and Category Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.knowledge.searchArticles}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600 focus:ring-1 focus:ring-forest-600"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-forest-600"
          >
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArticles.map((article) => {
          const isSaved = state.savedArticles.includes(article.id);

          return (
            <div
              key={article.id}
              className="bg-white rounded-2xl border border-gray-200 hover:border-forest-300 shadow-xs hover:shadow-sm transition-all p-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-forest-50 text-forest-800 border border-forest-100">
                    {article.category.replace('-', ' ')}
                  </span>
                  <button
                    onClick={() => toggleSaveArticle(article.id)}
                    className="p-1.5 text-gray-400 hover:text-forest-700 rounded-lg hover:bg-forest-50 transition-colors"
                    title={isSaved ? t.knowledge.unsaveArticle : t.knowledge.saveArticle}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-5 h-5 text-forest-700" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <h3 className="text-base font-bold text-gray-900 leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>

                <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between">
                  <span className="truncate">{article.sourceOrg}</span>
                  <StatusBadge status={article.reviewStatus} />
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">
                  {article.lastReviewed ? `Reviewed: ${article.lastReviewed}` : 'General reference'}
                </span>

                <button
                  onClick={() => setReadingArticle(article)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-forest-800 hover:text-forest-600 transition-colors"
                >
                  <span>{t.knowledge.readMore}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
          <BookOpen className="w-10 h-10 text-gray-400 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-semibold text-gray-700">
            {showSavedOnly ? t.knowledge.noSavedArticles : t.knowledge.noArticles}
          </p>
        </div>
      )}

      {/* Article Detail Reading Modal */}
      {readingArticle && (
        <Modal
          open={!!readingArticle}
          onClose={() => setReadingArticle(null)}
          title={readingArticle.title}
          size="lg"
        >
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-forest-100 text-forest-900">
                  {readingArticle.category.replace('-', ' ')}
                </span>
                <StatusBadge status={readingArticle.reviewStatus} />
              </div>
              <span>{readingArticle.sourceOrg}</span>
            </div>

            <div className="p-3 bg-forest-50/40 rounded-xl border border-forest-100 text-xs text-forest-900 font-medium">
              {readingArticle.summary}
            </div>

            <div className="text-xs text-gray-700 leading-relaxed space-y-3 whitespace-pre-line font-sans">
              {readingArticle.content}
            </div>

            {/* Source and verification footer */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-500">
              <div>
                <strong>Source: </strong>
                {readingArticle.sourceOrg} ({readingArticle.sourceTitle})
              </div>
              {readingArticle.sourceUrl && (
                <a
                  href={readingArticle.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-forest-800 hover:underline font-semibold"
                >
                  Official Link <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
