// src/app/search/page.js
'use client';

import { useState, useEffect } from 'react';
import { db, ref, get } from '@/firebase';
import Link from 'next/link';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allAnime, setAllAnime] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all anime data
  useEffect(() => {
    const fetchAllAnime = async () => {
      const animeRef = ref(db, "animes");
      try {
        const snapshot = await get(animeRef);
        if (snapshot.exists()) {
          const animeList = Object.entries(snapshot.val());
          setAllAnime(animeList);
          setSearchResults(animeList.sort(() => 0.5 - Math.random()).slice(0, 9));
        }
      } catch (error) {
        console.error("Error fetching anime:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllAnime();
  }, []);

  // Handle search input
  useEffect(() => {
    if (searchQuery === '') {
      setSearchResults(allAnime.sort(() => 0.5 - Math.random()).slice(0, 9));
    } else {
      const filtered = allAnime.filter(([_, anime]) => 
        anime.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchQuery, allAnime]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 px-4">
        <div className="container mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-800 rounded w-full mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4 pb-24 md:pb-4">
      <div className="container mx-auto">
        {/* Search Bar */}
        <div className="mb-8 sticky top-16 z-10 bg-gray-900 py-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search anime..."
            className="w-full p-4 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {searchResults.map(([id, anime]) => (
              <Link 
                href={`/watch/${id}`} 
                key={id}
                className="bg-gray-800 rounded-lg hover:bg-blue-500/20 transition-all duration-300 border border-gray-700 hover:border-blue-500 overflow-hidden group"
              >
                <div className="relative aspect-[2/3]">
                  <img 
                    src={anime.cover} 
                    alt={anime.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {anime.episodes && (
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {anime.episodes.length} eps
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-white font-medium line-clamp-2">{anime.title}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-blue-400 text-sm">{anime.type || 'TV'}</span>
                    <span className="text-gray-400 text-sm">{anime.duration || '24m'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl text-gray-400 mb-4">
              {searchQuery ? 'No results found' : 'Search for anime'}
            </h3>
            <p className="text-gray-500">
              {searchQuery ? 'Try different keywords' : 'Start typing to find your favorite anime'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}