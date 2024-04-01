import { useState, useEffect } from 'react';

const AllMusic = ({ handlePlay }) => {
  const [allMusic, setAllMusic] = useState([]);

  useEffect(() => {
    const fetchAllMusic = async () => {
      try {
        const response = await fetch('http://localhost:3000/music', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const allMusicData = await response.json();
          setAllMusic(allMusicData);
        } else {
          console.error('Error fetching all music:', response.statusText);
        }
      } catch (error) {
        console.error('Error during all music fetch:', error);
      }
    };

    fetchAllMusic();
  }, []);

  return (
    <div>
      <h2 className='text-4xl text-white font-bold ml-12 pl-10 mt-5'>All Music</h2>
      <div className="music-container">
        {allMusic.map((music) => (
          <div key={music.id} className="music-box text-white border">
            <div className="image-box">
              <p className='text-4xl font-bold text-white'>{music.title.charAt(0)}</p>
            </div>
            <div>
              <p className='text-2xl font-semibold'>{music.title}</p>
              <p className='text-md mb-2'>{music.artist}</p>
              <p>{music.album}</p>
            </div>
            <button className='border w-20 px-2 py-2 bg-blue-700 border-blue-700 hover:bg-gray-700 rounded-full' onClick={() => handlePlay(music)}>Play</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllMusic;