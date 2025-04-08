// src/app/page.js
"use client";
import { useState } from 'react';
import Head from 'next/head';
import { db, ref, set } from '@/firebase';

export default function UploadAnime() {
  const [animeTitle, setAnimeTitle] = useState('');
  const [episodes, setEpisodes] = useState([{ number: 1, url: '' }]);
  const [previewData, setPreviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const addEpisode = () => {
    setEpisodes([...episodes, { number: episodes.length + 1, url: '' }]);
  };

  const handleEpisodeChange = (index, value) => {
    const newEpisodes = [...episodes];
    newEpisodes[index].url = value;
    setEpisodes(newEpisodes);
  };

  const uploadAnime = async () => {
    if (!animeTitle.trim()) {
      alert("Please enter anime title!");
      return;
    }

    setIsLoading(true);
    try {
      const animeData = await fetchAnimeDetails(animeTitle);
      if (!animeData) {
        alert("Anime not found in Jikan API!");
        return;
      }

      const episodeUrls = {};
      episodes.forEach((ep, index) => {
        if (ep.url.trim()) {
          episodeUrls[index + 1] = ep.url.trim();
        }
      });

      if (Object.keys(episodeUrls).length === 0) {
        alert("Please enter at least one episode!");
        return;
      }

      setPreviewData({ ...animeData, episodes: episodeUrls });
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while fetching anime details");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmUpload = async () => {
    if (!previewData) return;

    const updatedTitle = document.getElementById("editTitle")?.value.trim() || previewData.title;
    const updatedDuration = document.getElementById("editDuration")?.value.trim() || previewData.duration;
    
    const updatedEpisodes = {};
    document.querySelectorAll("#editEpisodes input").forEach((input, index) => {
      updatedEpisodes[index + 1] = input.value.trim();
    });

    try {
      await saveToFirebase(
        previewData.id,
        updatedTitle,
        updatedDuration,
        previewData.cover,
        previewData.genres,
        updatedEpisodes
      );
      alert("Anime uploaded successfully!");
      setAnimeTitle('');
      setEpisodes([{ number: 1, url: '' }]);
      setPreviewData(null);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    }
  };

  const saveToFirebase = async (animeID, title, duration, cover, genres, episodes) => {
    const animeRef = ref(db, `animes/${animeID}`);
    await set(animeRef, {
      title,
      duration,
      cover,
      genres,
      ...episodes
    });
  };

  const fetchAnimeDetails = async (title) => {
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${title}&limit=1`);
      const data = await response.json();
      if (data.data.length > 0) {
        const anime = data.data[0];
        return {
          id: anime.mal_id,
          title: anime.title,
          cover: anime.images.jpg.image_url,
          genres: anime.genres.map(g => g.name),
          duration: anime.duration.replace(" per ep", ""),
        };
      }
    } catch (error) {
      console.error("Jikan API error:", error);
    }
    return null;
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <Head>
        <title>Upload Anime</title>
      </Head>

      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Upload Anime Episode</h1>
        
        <label className="block mb-2">Anime Title</label>
        <input 
          type="text" 
          value={animeTitle}
          onChange={(e) => setAnimeTitle(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-800 rounded" 
          placeholder="Enter anime title" 
        />

        <div id="episodeContainer">
          {episodes.map((episode, index) => (
            <div key={index} className="episode-item mb-4">
              <label>Episode {episode.number}</label>
              <input 
                type="text" 
                value={episode.url}
                onChange={(e) => handleEpisodeChange(index, e.target.value)}
                className="episode-url w-full p-2 mb-2 bg-gray-800 rounded" 
                placeholder="Enter episode URL" 
              />
            </div>
          ))}
        </div>

        <button 
          onClick={addEpisode}
          className="mt-2 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Add More Episodes
        </button>

        <button 
          onClick={uploadAnime}
          disabled={isLoading}
          className={`mt-4 px-4 py-2 rounded ${isLoading ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'} transition`}
        >
          {isLoading ? 'Loading...' : 'Upload'}
        </button>

        {previewData && (
          <>
            <h2 className="text-2xl font-bold mt-6">Preview & Edit</h2>
            <div id="previewContainer" className="bg-gray-900 p-4 rounded mt-4">
              <p className="mb-2">
                <strong>Anime Title:</strong> 
                <input 
                  id="editTitle" 
                  defaultValue={previewData.title} 
                  className="bg-gray-800 p-1 rounded ml-2 w-1/2" 
                />
              </p>
              <p className="mb-2">
                <strong>Duration:</strong> 
                <input 
                  id="editDuration" 
                  defaultValue={previewData.duration} 
                  className="bg-gray-800 p-1 rounded ml-2 w-1/2" 
                />
              </p>
              <p className="mb-2"><strong>Genres:</strong> {previewData.genres.join(", ")}</p>
              <p className="mb-2">
                <strong>Cover:</strong> 
                <img 
                  src={previewData.cover} 
                  alt="Anime cover" 
                  className="w-32 mt-2 rounded" 
                />
              </p>
              <p className="mb-2"><strong>Episodes:</strong></p>
              <ul id="editEpisodes" className="mt-2 space-y-2">
                {Object.entries(previewData.episodes).map(([num, url]) => (
                  <li key={num} className="flex items-center">
                    <span className="w-16">Ep {num}:</span> 
                    <input 
                      defaultValue={url} 
                      className="bg-gray-800 p-1 rounded ml-2 flex-1" 
                    />
                  </li>
                ))}
              </ul>
              <button 
                onClick={confirmUpload}
                className="mt-4 bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600 transition"
              >
                Confirm & Upload
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}