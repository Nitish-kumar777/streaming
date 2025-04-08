// src/app/watch/[id]/page.js
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db, ref, get } from '@/firebase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';

// Dynamically import VideoPlayer with no SSR
const VideoPlayer = dynamic(
  () => import('@/components/VideoPlayer'),
  { 
    ssr: false,
    loading: () => <div className="bg-black aspect-video rounded-lg flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  }
);

export default function WatchPage() {
  const params = useParams();
  const animeID = params.id;
  const [animeData, setAnimeData] = useState(null);
  const [jikanData, setJikanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch from Firebase
        const animeRef = ref(db, `animes/${animeID}`);
        const snapshot = await get(animeRef);
        
        if (!snapshot.exists()) {
          throw new Error('Anime not found');
        }
        
        const data = snapshot.val();
        setAnimeData(data);
        
        // Fetch from Jikan API
        const jikanResponse = await fetch(`https://api.jikan.moe/v4/anime/${animeID}/full`);
        const jikanData = await jikanResponse.json();
        
        if (jikanData.data) {
          setJikanData(jikanData.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (animeID) {
      fetchData();
    }
  }, [animeID]);

  if (loading) return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="flex flex-col justify-center items-center min-h-[80vh] text-red-500">
        <h2 className="text-2xl font-bold mb-4">Error Loading Anime</h2>
        <p className="mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
      <Footer />
    </div>
  );

  if (!animeData) return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="flex justify-center items-center min-h-[80vh]">
        <p>No anime data found</p>
      </div>
      <Footer />
    </div>
  );

  // Prepare video sources
  const videoSources = Object.entries(animeData)
    .filter(([key]) => !isNaN(key))
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([episode, url]) => ({
      src: url,
      type: 'video/mp4',
      label: `Episode ${episode}`
    }));

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Video Player Section */}
        <section className="mb-8">
          <div className="bg-black rounded-lg overflow-hidden shadow-lg">
            <VideoPlayer 
              sources={videoSources}
              initialSource={currentEpisode}
              onEpisodeChange={setCurrentEpisode}
            />
          </div>
        </section>

        {/* Anime Info Section */}
        <section className="mb-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h1 className="text-3xl font-bold mb-2">{jikanData?.title || 'Unknown Title'}</h1>
            
            <div className="flex flex-wrap gap-4 mb-4 text-gray-300">
              {jikanData?.score && (
                <span className="flex items-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="mr-1 text-yellow-400">
                    <path d="M12 2L14.85 8.08L21.5 9.02L16.75 13.62L18.1 20.22L12 17L5.9 20.22L7.25 13.62L2.5 9.02L9.15 8.08L12 2Z" />
                  </svg>
                  {jikanData.score}
                </span>
              )}
              
              {jikanData?.episodes && (
                <span className="flex items-center">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" className="mr-1 text-blue-400">
                    <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
                    <polygon points="10,8 16,12 10,16" fill="currentColor" />
                  </svg>
                  {jikanData.episodes} Episodes
                </span>
              )}
              
              {jikanData?.year && (
                <span className="flex items-center">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" className="mr-1 text-green-400">
                    <rect x="3" y="5" width="18" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none" />
                    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" />
                    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  {jikanData.year}
                </span>
              )}
            </div>
            
            {/* Genres Section */}
            {jikanData?.genres?.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {jikanData.genres.map((genre) => (
                    <a 
                      key={genre.mal_id}
                      href={`/genres?genre=${genre.name}`}
                      className="bg-gray-700 px-3 py-1 rounded-full hover:bg-blue-500 transition text-sm"
                    >
                      {genre.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {/* Description */}
            {jikanData?.synopsis && (
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Synopsis</h2>
                <div 
                  className={`text-gray-300 transition-all duration-500 ${isExpanded ? 'max-h-[1000px]' : 'max-h-[120px] overflow-hidden'}`}
                >
                  <p className="whitespace-pre-line">{jikanData.synopsis}</p>
                </div>
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 text-blue-400 hover:text-blue-300 focus:outline-none text-sm"
                >
                  {isExpanded ? 'Show Less' : 'Read More'}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Episodes Section */}
        <section className="mb-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Episodes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {videoSources.map((source, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentEpisode(index)}
                  className={`px-4 py-2 rounded transition text-left truncate ${
                    index === currentEpisode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {source.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Recommendations Section */}
        <section>
          <LatestPosts currentAnimeId={animeID} />
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

function LatestPosts({ currentAnimeId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = ref(db, 'animes');
        const snapshot = await get(postsRef);
        
        if (snapshot.exists()) {
          const allPosts = Object.entries(snapshot.val())
            .filter(([id]) => id !== currentAnimeId)
            .slice(0, 8);
          
          setPosts(allPosts);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentAnimeId]);

  if (loading) return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">You Might Also Like</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="bg-gray-700 rounded-lg h-[200px] animate-pulse"></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">You Might Also Like</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {posts.map(([id, anime]) => (
          <a
            key={id}
            href={`/watch/${id}`}
            className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition group"
          >
            <div className="relative aspect-[2/3]">
              <img 
                src={anime.cover} 
                alt={anime.title}
                className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-white font-medium text-sm">{anime.title}</span>
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-white font-medium text-sm line-clamp-1">{anime.title}</h3>
              <p className="text-gray-400 text-xs">{anime.duration}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}