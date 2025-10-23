import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { Search, Command, TrendingUp, Clock, MapPin, Leaf, Heart } from 'lucide-react';

export interface SearchResult {
  id: string;
  type: 'park' | 'species' | 'campaign' | 'action';
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: () => void;
}

export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onSelect?: (result: SearchResult) => void;
  showCommandPalette?: boolean;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search parks, species, campaigns...',
  onSearch,
  onSelect,
  showCommandPalette = true,
  className,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'park',
      title: 'Jim Corbett National Park',
      subtitle: 'Uttarakhand',
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      id: '2',
      type: 'species',
      title: 'Bengal Tiger',
      subtitle: 'Panthera tigris tigris',
      icon: <Leaf className="w-4 h-4" />,
    },
    {
      id: '3',
      type: 'campaign',
      title: 'Save the Elephants',
      subtitle: '₹2.5M raised',
      icon: <Heart className="w-4 h-4" />,
    },
  ];

  useEffect(() => {
    if (query.length > 0) {
      // Filter mock results
      const filtered = mockResults.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.subtitle?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  // Keyboard shortcut for command palette (Ctrl+K)
  useEffect(() => {
    if (!showCommandPalette) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCommandPalette]);

  const handleSelect = (result: SearchResult) => {
    setQuery('');
    setIsOpen(false);
    setRecentSearches((prev) => [result.title, ...prev.slice(0, 4)]);
    onSelect?.(result);
    result.action?.();
  };

  const typeColors = {
    park: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
    species: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30',
    campaign: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30',
    action: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30',
  };

  return (
    <div className={cn('relative w-full max-w-2xl', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            'w-full pl-12 pr-20 py-4 rounded-2xl',
            'bg-white/10 backdrop-blur-md border border-white/20',
            'text-gray-900 dark:text-white placeholder-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'transition-all duration-200',
            'dark:bg-black/30 dark:border-white/10'
          )}
        />
        {showCommandPalette && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-xs text-gray-500">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        )}
      </div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              'absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden',
              'bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl',
              'dark:bg-black/30 dark:border-white/10',
              'max-h-96 overflow-y-auto'
            )}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Recent Searches */}
            {query.length === 0 && recentSearches.length > 0 && (
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>Recent Searches</span>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(search)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors text-gray-700 dark:text-gray-300"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {results.length > 0 ? (
              <div className="p-2">
                {results.map((result) => (
                  <motion.button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl',
                      'hover:bg-white/10 dark:hover:bg-white/5',
                      'transition-colors text-left group'
                    )}
                    whileHover={{ x: 4 }}
                  >
                    <div className={cn('p-2 rounded-lg', typeColors[result.type])}>
                      {result.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {result.title}
                      </div>
                      {result.subtitle && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {result.subtitle}
                        </div>
                      )}
                    </div>
                    <TrendingUp className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
              </div>
            ) : query.length > 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No results found for "{query}"
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
