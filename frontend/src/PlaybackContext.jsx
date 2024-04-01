import { createContext, useContext, useState } from 'react';

const PlaybackContext = createContext();

export const PlaybackProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMusic, setCurrentMusic] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  const playMusic = (music, index) => {
    setIsPlaying(true);
    setCurrentMusic(music);
    setCurrentIndex(index);
  };

  const pauseMusic = () => {
    setIsPlaying(false);
  };

  return (
    <PlaybackContext.Provider value={{ isPlaying, currentMusic, currentIndex, playMusic, pauseMusic }}>
      {children}
    </PlaybackContext.Provider>
  );
};

export const usePlayback = () => {
  return useContext(PlaybackContext);
};
