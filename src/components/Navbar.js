// src/components/Navbar.js
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { db, ref, get } from '@/firebase'; // Changed from 'database' to 'db'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allAnime, setAllAnime] = useState([]);

  // Fetch all anime data
  useEffect(() => {
    const fetchAllAnime = async () => {
      const animeRef = ref(db, "animes"); // Changed from database to db
      try {
        const snapshot = await get(animeRef);
        if (snapshot.exists()) {
          const animeList = Object.entries(snapshot.val());
          setAllAnime(animeList);
          setSearchResults(animeList.sort(() => 0.5 - Math.random()).slice(0, 9));
        }
      } catch (error) {
        console.error("Error fetching anime:", error);
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

  // Rest of your component remains the same...
  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm px-4 py-3 justify-between items-center">
        <Link href="/" className="text-xl font-bold">AnimeStream</Link>
        <div className="flex space-x-6">
          <Link href="/" className="hover:text-blue-400 transition">Home</Link>
          <Link href="/popular" className="hover:text-blue-400 transition">Popular</Link>
          <Link href="/genres" className="hover:text-blue-400 transition">Genres</Link>
        </div>
        <div className="flex space-x-4 items-center">
          {searchOpen ? (
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search anime..."
                className="p-2 bg-gray-800 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                autoFocus
              />
              <button 
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="absolute right-2 top-2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-full hover:bg-gray-700"
            >
              🔍
            </button>
          )}
        </div>
      </nav>

      {/* Search Results Overlay */}
      {searchOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-gray-900/95 backdrop-blur-sm p-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {searchResults.length > 0 ? (
              searchResults.map(([id, anime], index) => (
                <Link 
                  href={`/watch/${id}`} 
                  key={id}
                  className="bg-gray-800 rounded hover:bg-blue-500 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <div className="relative">
                    <img 
                      src={anime.cover} 
                      alt={anime.title}
                      className="w-full h-[240px] object-cover rounded-[1px]"
                    />
                  </div>
                  <div className="py-2 text-left px-2">
                    <span className="text-base font-normal text-white line-clamp-1">{anime.title}</span>
                    <p className="text-sm text-gray-400">{anime.duration}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-400 col-span-full text-center py-8">
                {searchQuery ? 'No results found.' : 'Start typing to search...'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Mobile Navbar */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">AnimeStream</Link>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-full hover:bg-gray-700"
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-gray-900/95 backdrop-blur-sm pt-16">
          <div className="flex flex-col items-center space-y-6 py-8">
            <Link href="/" className="text-xl" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/popular" className="text-xl" onClick={() => setMobileMenuOpen(false)}>Popular</Link>
            <Link href="/genres" className="text-xl" onClick={() => setMobileMenuOpen(false)}>Genres</Link>
            <div className="pt-4 w-full px-8">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search anime..."
                className="p-2 bg-gray-800 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <div className="grid grid-cols-2 gap-4 mt-4">
                {searchResults.map(([id, anime]) => (
                  <Link 
                    href={`/watch/${id}`} 
                    key={id}
                    className="bg-gray-800 rounded hover:bg-blue-500 transition-all duration-300"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setSearchQuery('');
                    }}
                  >
                    <div className="relative">
                      <img 
                        src={anime.cover} 
                        alt={anime.title}
                        className="w-full h-[160px] object-cover rounded-[1px]"
                      />
                    </div>
                    <div className="py-2 text-left px-2">
                      <span className="text-sm font-normal text-white line-clamp-1">{anime.title}</span>
                      <p className="text-xs text-gray-400">{anime.duration}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm flex justify-around py-3">
        <Link href="/" className="flex flex-col items-center text-blue-400">
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/popular" className="flex flex-col items-center text-gray-400 hover:text-blue-400">
          <span className="text-xs mt-1">Popular</span>
        </Link>
        <Link href="/genres" className="flex flex-col items-center text-gray-400 hover:text-blue-400">
          <span className="text-xs mt-1">Genres</span>
        </Link>
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center text-gray-400 hover:text-blue-400"
        >
          <span className="text-xs mt-1">Search</span>
        </button>
      </nav>
    </>
  );
}