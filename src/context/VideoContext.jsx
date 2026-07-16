import { createContext, useContext, useState, useEffect } from 'react';

const VideoContext = createContext(null);

export function VideoProvider({ children }) {
  const [videos, setVideos] = useState(() => {
    const stored = localStorage.getItem('growai_videos');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('growai_videos', JSON.stringify(videos));
  }, [videos]);

  const addVideo = (video) => {
    const newVideo = {
      id: 'vid_' + Date.now(),
      title: video.title || 'Video sin título',
      topic: video.topic,
      style: video.style,
      duration: video.duration,
      language: video.language || 'es',
      thumbnail: null,
      createdAt: new Date().toISOString(),
      description: '',
      tags: [video.style, video.language],
    };
    setVideos((prev) => [newVideo, ...prev]);
    return newVideo;
  };

  const updateVideo = (id, updates) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
  };

  const deleteVideo = (id) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const getRecentVideos = (count = 3) => {
    return videos.slice(0, count);
  };

  return (
    <VideoContext.Provider
      value={{ videos, addVideo, updateVideo, deleteVideo, getRecentVideos }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export const useVideos = () => {
  const ctx = useContext(VideoContext);
  if (!ctx) throw new Error('useVideos must be used within VideoProvider');
  return ctx;
};
