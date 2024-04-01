import { useState, useRef } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import RecommendedMusic from '../components/RecommendedMusic';
import AllMusic from '../components/AllMusic';
import Previous from '../assets/previous.png';
import Next from '../assets/next.png';
import Play from '../assets/play.png';
import Pause from '../assets/pause.png';
import RepeatOne from '../assets/repeat-one.png';
// import RepeatAll from '../assets/repeat.png';
import RepeatOn from '../assets/no-repeat.png';
import Forward from '../assets/forward.png';
import Rewind from '../assets/rewind.png';
import Speaker from '../assets/speaker.png';
// import SpeakerOff from '../assets/speaker-off.png';

const Dashboard = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [musicProgress, setMusicProgress] = useState(0); // [0, 100
  const [allMusic, setAllMusic] = useState([]);
  const [currentMusic, setCurrentMusic] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [volume, setVolume] = useState(50); // Initial volume
  const [musicTotalLength, setMusicTotalLength] = useState('04 : 38');
  const [musicCurrentTime, setMusicCurrentTime] = useState('00 : 00');

  const audioRef = useRef(null);

  // Handle music progress
  const handleMusicProgress = (e) => {
    setMusicProgress(e.target.value);
    audioRef.current.currentTime = e.target.value * audioRef.current.duration / 100;
  };

  // Handle music search
  const handleSearch = (results) => {
    setSearchResults(results);
    setAllMusic(results);
    setCurrentIndex(null);
  };

//   // Handle music next
// const handleNext = () => {
//   if (currentIndex !== null && currentIndex < allMusic.length - 1) {
//     const nextIndex = currentIndex + 1;
//     setCurrentIndex(nextIndex);
//     handlePlay(allMusic[nextIndex], nextIndex);
//   } else if (isRepeat) {
//     // If on the last track and repeat is enabled, play again
//     setCurrentIndex(0);
//     handlePlay(allMusic[0], 0);
//   }
// };

// // Handle music previous
// const handlePrevious = () => {
//   if (currentIndex !== null && currentIndex > 0) {
//     const previousIndex = currentIndex - 1;
//     setCurrentIndex(previousIndex);
//     handlePlay(allMusic[previousIndex], previousIndex);
//   } else if (isRepeat) {
//     // If on the first track and repeat is enabled, play the last track
//     const lastTrackIndex = allMusic.length - 1;
//     setCurrentIndex(lastTrackIndex);
//     handlePlay(allMusic[lastTrackIndex], lastTrackIndex);
//   }
// };

  // Handle music play
  const handlePlay = async (music, index) => {
    try {
      const response = await fetch(`http://localhost:3000/music/${music.filename}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const musicBlob = await response.blob();
        const musicUrl = URL.createObjectURL(musicBlob);

        setCurrentMusic({
          title: music.title,
          artist: music.artist,
          url: musicUrl,
        });

        setAllMusic(searchResults);
        setCurrentIndex(index);

        audioRef.current.src = musicUrl;
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        console.error('Error fetching music:', response.statusText);
      }
    } catch (error) {
      console.error('Error during music fetch:', error);
    }
  };

  // Handle music pause
  const handleTogglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle music rewind
  const handleRewind = () => {
    audioRef.current.currentTime -= 5;
  };

  // Handle music forward
  const handleForward = () => {
    audioRef.current.currentTime += 5;
  };

  // Handle music repeat
  const handleRepeatToggle = () => {
    setIsRepeat(!isRepeat);
  };

  // Handle music next
  const handleNext = () => {
    if (currentIndex !== null && currentIndex < allMusic.length - 1) {
      const nextIndex = currentIndex + 1;
      handlePlay(allMusic[nextIndex], nextIndex);
    } else
    if (isRepeat) {
      audioRef.current.play();
    }
  };

  // Handle music previous
  const handlePrevious = () => {
    if (currentIndex !== null && currentIndex > 0) {
      const previousIndex = currentIndex - 1;
      handlePlay(allMusic[previousIndex], previousIndex);
    }
  };

  // Handle music mute toggle
  // const handleMuteToggle = () => {
  //   if (audioRef.current) {
  //     audioRef.current.muted = !audioRef.current.muted;
  //   }
  // };

  // Handle music volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume / 100;
  };

  // Handle music Update
  const handleMusicUpdate = () => {
    // input total length of the music
    let minutes = Math.floor(audioRef.current.duration / 60);
    let seconds = Math.floor(audioRef.current.duration % 60);
    let musicTotalLength0 = `${minutes <10 ? `0${minutes}` : minutes} : ${seconds <10 ? `0${seconds}` : seconds}`;
    setMusicTotalLength(musicTotalLength0);

    // input current time of the music
    let currentMinutes = Math.floor(audioRef.current.currentTime / 60);
    let currentSeconds = Math.floor(audioRef.current.currentTime % 60);
    let musicCurrentT = `${currentMinutes <10 ? `0${currentMinutes}` : currentMinutes} : ${currentSeconds <10 ? `0${currentSeconds}` : currentSeconds}`;
    setMusicCurrentTime(musicCurrentT);

    const progress = parseInt((audioRef.current.currentTime / audioRef.current.duration) * 100);
    setMusicProgress(isNaN(progress) ? 0 : progress);
  }

  return (
    <div>
      <Header showLogin={false} />
      <div className='home pt-8'>
        <SearchBar onSearch={handleSearch} />

        {searchResults.length > 0 && (
          <div className='mx-2'>
            <h2 className='text-4xl text-white mt-5 font-bold ml-12 pl-10'>Search Results</h2>
            <div className="music-container">
              {searchResults.map((music, index) => (
                <div key={music.id} className="music-box text-white border">
                  <div className="image-box">
                    <p className='text-4xl font-bold text-white'>{music.title.charAt(0)}</p>
                  </div>
                  <div>
                    <p className='text-2xl font-semibold'>{music.title}</p>
                    <p className='text-mm'>{music.artist}</p>
                    <p>{music.album}</p>
                  </div>
                  <button className='border w-20 px-2 py-2 bg-blue-700 hover:bg-gray-700 border-blue-700 rounded-full' onClick={() => handlePlay(music, index)}>Play</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <RecommendedMusic handlePlay={handlePlay} />
        <AllMusic handlePlay={handlePlay} />
        <div className='space'></div>

        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-2 text-white">
          {currentMusic && (
            <div className='music-Container'>
              <p className='text-center text-xl'>{currentMusic.title} - {currentMusic.artist}</p>
              <audio
                ref={audioRef}
                src={currentMusic.url}
                autoPlay
                // onEnded={() => isRepeat && audioRef.current.play()}
                onEnded={handleNext} 
                onTimeUpdate={handleMusicUpdate}
              ></audio>
              <div className="musicTimerDiv">
                <p>{musicCurrentTime}</p>
                <p>{musicTotalLength}</p>
              </div>
              <input type='range' value={musicProgress} onChange={handleMusicProgress} className="progressBar"/>
              <div className='controls'>
                <div></div>
                <div className="buttons">
                  <button onClick={handlePrevious}><img src={Previous} alt="" className='w-8' /></button>
                  <button onClick={handleRewind}><img src={Rewind} alt="" className='w-6' /></button>
                  <button onClick={handleTogglePlay}>{isPlaying ? (
                    <div className='border rounded-full'>
                      <img src={Pause} alt="" className='p-1 w-8' />
                    </div>
                  ) : (
                    <div className='border rounded-full'>
                      <img src={Play} alt="" className='p-1 w-8'/>
                    </div>
                  )}</button>
                  <button onClick={handleForward}><img src={Forward} alt="" className='w-6' /></button>
                  <button onClick={handleNext}><img src={Next} alt="" className='w-8' /></button>
                  <button onClick={handleRepeatToggle}>{isRepeat ? (
                    <div>
                      <img src={RepeatOne} alt="" className='w-8' />
                    </div>
                  ) : (
                    <div>
                      <img src={RepeatOn} alt="" className='w-8' />
                    </div>
                  )}</button>
                </div>
                <div className='speaker'>
                  <img src={Speaker} alt="" className='w-8'/>
                  <input type="range" name='volumeControl' className='' value={volume} onChange={handleVolumeChange} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;