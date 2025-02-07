'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Heart, Shuffle, Repeat, Loader, Download, Trash2 } from 'lucide-react';
// import Image from 'next/image';

interface Song {
  audio: string;
  image: string;
  title: string;
}

interface Track {
  song: Song;
}

interface SelectedSong {
      playlist: string[];
      total: number;
}
const baseUrl=process.env.NEXT_PUBLIC_API_URL as string
const fetchSelectedSongs = async () => {
      try {
        const response = await fetch(`${baseUrl}/selected_songs`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching selected songs:', error);
        return {
          playlist: [],
          total: 0
        };
      }
}

const SpotifyMusicPlayer = () => {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTotal, setCurrentTotal] = useState(0);
  const [selectedSong, setSelectedSong] = useState<SelectedSong | null>(null);

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prevIndex) => 
      (prevIndex + 1) % playlist.length
    );
  }, [playlist.length]);

  const fetchPlaylist = (keyword?: string) => {
    setIsSearching(true);
    const url = keyword 
      ? `${baseUrl}/playlist?keyword=${encodeURIComponent(keyword)}`
      : `${baseUrl}/playlist`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const formattedPlaylist = data.playlist.map((item: Song) => ({
          song: {
            audio: item.audio,
            image: item.image,
            title: item.title
          }
        }));
        setPlaylist(formattedPlaylist);
        setIsSearching(false);
      })
      .catch(error => {
        console.error('Error fetching playlist:', error);
        setIsSearching(false);
      });
  };

  useEffect(() => {
    fetchPlaylist();
  }, []);

  useEffect(() => {
    const fetchSelectedSongsData = async () => {
      const selected_song = await fetchSelectedSongs();
      setSelectedSong(selected_song);
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === selected_song.playlist.length - 1 ? 0 : prevIndex + 1
        );
        setCurrentTotal((prevTotal) => 
          prevTotal === selected_song.total ? 0 : prevTotal + 1
        );
      }, 400);

      return () => clearInterval(interval);
    };

    fetchSelectedSongsData();
  }, []);

  const currentTrack = playlist[currentTrackIndex];

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;
    
    const updateProgress = () => {
      if (!audioElement.duration) return;
      const progressPercent = (audioElement.currentTime / audioElement.duration) * 100;
      setProgress(isNaN(progressPercent) ? 0 : progressPercent);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audioElement.currentTime = 0;
        audioElement.play();
      } else {
        nextTrack();
        setIsPlaying(false);
      }
    };

    const handleError = () => {
      nextTrack();
      setIsPlaying(false);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      audioElement.play().catch(() => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    };

    audioElement.addEventListener('loadstart', handleLoadStart);
    audioElement.addEventListener('canplay', handleCanPlay);
    audioElement.addEventListener('timeupdate', updateProgress);
    audioElement.addEventListener('ended', handleEnded);
    audioElement.addEventListener('error', handleError);

    return () => {
      audioElement.removeEventListener('loadstart', handleLoadStart);
      audioElement.removeEventListener('canplay', handleCanPlay);
      audioElement.removeEventListener('timeupdate', updateProgress);
      audioElement.removeEventListener('ended', handleEnded);
      audioElement.removeEventListener('error', handleError);
    };
  }, [currentTrackIndex, isRepeat, nextTrack]);

  const togglePlay = () => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play().catch(() => {
        nextTrack();
        setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prevIndex) => 
      prevIndex === 0 ? playlist.length - 1 : prevIndex - 1
    );
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const seekTime = (Number(e.target.value) / 100) * audioElement.duration;
    audioElement.currentTime = seekTime;
    setProgress(Number(e.target.value));
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchPlaylist(searchQuery.trim());
    } else {
      fetchPlaylist();
    }
  };

  const handleDownload = (track: Track) => {
    window.open(track.song.audio, '_blank');
  };

  const handleDelete = (index: number) => {
    const newPlaylist = [...playlist];
    newPlaylist.splice(index, 1);
    setPlaylist(newPlaylist);
    if (currentTrackIndex === index) {
      setCurrentTrackIndex(0);
    }
  };

  if (!currentTrack) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader className="animate-spin w-16 h-16 mx-auto mb-4" />
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent ">Creating your perfect playlist...</p>
          <div className="mt-4">
            <p className="text-lg font-semibold">
              {selectedSong?.playlist[currentIndex]}
            </p>
            <p className="text-sm text-gray-500">
              {currentTotal}
              {/* {selectedSong?.total} */}
            </p>
          </div>
        </div>
      </div>
    );
  }  
  return (
    <div className='mt-10 md:mt-0 flex flex-col items-center justify-center md:gap-4'>
      <div className="flex items-center gap-2 w-[90%] md:w-[50%]">
          <input
            type="text"
            placeholder="Search songs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-[#ffffff1a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff5480] h-12 md:h-14"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-[#ff5480] rounded-lg hover:bg-[#ff5480]/80 transition-colors  h-12 md:h-14"
            disabled={isSearching}
          >
            {isSearching ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              'Update'
            )}
          </button>
        </div>
    
    <div className="flex flex-col md:flex-row gap-4 p-4 mb-0 h-[80vh] md:h-[72vh]">
      
      <div className="w-[99%] mt-2 md:mt-0 md:w-[550px] bg-gradient-to-b  from-[#ff5480] to-black text-white p-6 rounded-xl shadow-2xl" style={{ backgroundImage: `url(${currentTrack.song.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
       }}>
        <audio 
          ref={audioRef} 
          src={currentTrack.song.audio} 
          preload="metadata"
        />
        
        <div className="flex items-center mb-6 ">
          <div className="w-16 h-16 rounded mr-4">
            <img src={currentTrack.song.image} alt="o" className='rounded-md' />
          </div>
          <div>
            <h2 className="text-xl font-bold">{currentTrack.song.title}</h2>
            <p className="text-sm text-gray-400">Artist Name</p>
          </div>
          <button 
            onClick={() => setIsLiked(!isLiked)} 
            className="ml-auto"
            aria-label={isLiked ? "Unlike" : "Like"}
          >
            <Heart 
              size={24} 
              fill={isLiked ? '#ff5480' : 'none'} 
              color="white" 
            />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
            <span>{formatTime(audioRef.current?.duration || 0)}</span>
          </div>
          <input
            type="range" 
            min="0" 
            max="100" 
            value={isNaN(progress) ? 0 : progress} 
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-[#ff5480] [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:bg-[#ff5480] [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
            aria-label="Seek"
            style={{
              background: `linear-gradient(to right, #ff5480 ${progress}%, #4B5563 ${progress}%)`
            }}
          />        </div>

        <div className="flex justify-around items-center mt-">
          <button 
            onClick={() => setIsShuffle(!isShuffle)}
            className={`${isShuffle ? 'text-[#ff5480]' : 'text-[#ffb31a]'}`}
            aria-label="Shuffle"
          >
            <Shuffle size={20} />
          </button>

          <button 
            onClick={prevTrack} 
            className="hover:bg-gray-700 p-2 rounded-full bg-white text-black hover:text-white"
            aria-label="Previous track"
          >
            <SkipBack size={24} />
          </button>

          <button 
            onClick={togglePlay} 
            className="bg-white text-black p-4 rounded-full hover:bg-gray-200"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isLoading ? (
              <Loader className="animate-spin" size={24} />
            ) : isPlaying ? (
              <Pause size={24} />
            ) : (
              <Play size={24} />
            )}
          </button>

          <button 
            onClick={nextTrack} 
            className="hover:bg-gray-700 p-2 rounded-full bg-white text-black hover:text-white"
            aria-label="Next track"
          >
            <SkipForward size={24} />
          </button>

          <button 
            onClick={() => setIsRepeat(!isRepeat)}
            className={`${isRepeat ? 'text-[#ff5480]' : 'text-[#ffb31a]'}`}
            aria-label="Repeat"
          >
            <Repeat size={20} />
          </button>
        </div>
      </div>

      <div className="bg-[#2e0b01bb] text-white p-6 rounded-xl overflow-y-auto ">
        <h3 className="text-xl font-bold mb-4">Playlist 💖</h3>
        {playlist.map((track, index) => (
          <div 
            key={index}
            className={`flex items-center p-2 hover:bg-[#ff5480]/20 rounded ${
              currentTrackIndex === index ? 'bg-[#ff5480]/30' : ''
            }`}
          >
            <div 
              className="flex-1 flex items-center cursor-pointer"
              onClick={() => setCurrentTrackIndex(index)}
            >
              <div className="w-10 h-10 bg-gray-700 rounded mr-3">
                  <img src={track.song.image} alt="o" className='rounded-md' />
              </div>
              <div>
                <p className="font-medium">{track.song.title}</p>
                <p className="text-sm text-gray-400">Artist Name</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentTrackIndex === index && isLoading ? (
                <Loader className="animate-spin" size={16} />
              ) : (
                <>
                  <button
                    onClick={() => handleDownload(track)}
                    className="p-2 hover:bg-[#ff5480]/20 rounded"
                    aria-label="Download"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-2 hover:bg-[#ff5480]/20 rounded"
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};export default SpotifyMusicPlayer;