"use client"
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db, ref, get } from '@/firebase';

export default function Home() {
  const [allAnime, setAllAnime] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        const animeRef = ref(db, "animes");
        const snapshot = await get(animeRef);

        if (snapshot.exists()) {
          setAllAnime(Object.entries(snapshot.val()));
        } else {
          console.log("No animes found!");
        }
      } catch (error) {
        console.error("Error fetching animes:", error);
      }
    };

    fetchAnimes();
  }, []);

  const displayedAnimes = allAnime.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(allAnime.length / itemsPerPage);

  return (
    <>
      <Head>
        <title>AnimeStream - Latest Releases</title>
        <meta name="description" content="Your website description for SEO." />
        <meta name="keywords" content="Anime, Streaming, Web Development" />
        <meta name="author" content="Demon" />
        <meta name="theme-color" content="#000000" />
        <meta name="robots" content="index, follow" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
      </Head>

      <Navbar />

      <main className="bg-black text-white">
        {/* Hero Section */}
        <h1 className="text-4xl p-[5%] sm:p-[12%] font-bold mt-16">Latest Releases</h1>

        <section className="flex items-center justify-center relative animate-fadeIn">
          <div className="absolute inset-0 bg-[url('https://dummyimage.com/800x1200/1a202c/ffffff&text=Hero+Anime')] bg-cover bg-center opacity-20"></div>
          <div className="container mx-auto px-4 relative text-center">
            <div className="grid grid-cols-1 gap-6">
              <div className="group relative cursor-pointer">
                <img 
                  src="https://dummyimage.com/600x900/4a5568/ffffff&text=Featured+1" 
                  className="w-full h-64 object-cover rounded-lg transform group-hover:scale-105 transition-transform"
                  alt="Featured Anime"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 via-gray-900/70">
                  <h3 className="text-xl font-bold">Attack on Titan</h3>
                  <p className="text-gray-400 mt-1">24m/episode • Action</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Series Section */}
        <section className="py-12 animate-fadeIn">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Popular Series</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayedAnimes.map(([animeId, anime]) => (
                <Link 
                  key={animeId} 
                  href={`/watch/${animeId}`}
                  className="relative rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105 bg-black"
                >
                  <div className="relative">
                    <img 
                      src={anime.cover} 
                      className="w-full h-[240px] object-cover rounded-[1px]"
                      alt={anime.title}
                    />
                  </div>
                  <div className="py-2 text-left">
                    <span className="text-base font-normal text-white">{anime.title}</span>
                    <p className="text-sm text-gray-400">{anime.duration}</p>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded transition-all hover:bg-blue-600 hover:text-white ${
                      currentPage === page ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

// Navbar Component
function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm px-4 py-3 justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          AnimeStream
        </Link>
        <div className="flex space-x-6">
          <Link href="/" className="hover:text-blue-400 transition">Home</Link>
          <Link href="/popular" className="hover:text-blue-400 transition">Popular</Link>
          <Link href="/genres" className="hover:text-blue-400 transition">Genres</Link>
          <Link href="/upload" className="hover:text-blue-400 transition">Upload</Link>
        </div>
        <div className="flex space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          AnimeStream
        </Link>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-full hover:bg-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-gray-900/95 backdrop-blur-sm pt-16">
          <div className="flex flex-col items-center space-y-6 py-8">
            <Link 
              href="/" 
              className="text-xl hover:text-blue-400 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/popular" 
              className="text-xl hover:text-blue-400 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Popular
            </Link>
            <Link 
              href="/genres" 
              className="text-xl hover:text-blue-400 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Genres
            </Link>
          </div>
        </div>
      )}

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm flex justify-around py-3">
        <Link href="/" className="flex flex-col items-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/popular" className="flex flex-col items-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <span className="text-xs mt-1">Popular</span>
        </Link>
        <Link href="/genres" className="flex flex-col items-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          <span className="text-xs mt-1">Genres</span>
        </Link>
      </nav>
    </>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="py-6 bg-gray-900/80 backdrop-blur-sm text-center">
      <p className="text-gray-400">&copy; {new Date().getFullYear()} AnimeStream. All rights reserved.</p>
    </footer>
  );
}