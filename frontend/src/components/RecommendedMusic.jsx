import { useEffect, useState } from 'react';

const RecommendedMusic = ({ handlePlay }) => {
  const [recommendedMusic, setRecommendedMusic] = useState([]);

  useEffect(() => {
    const fetchRecommendedMusic = async () => {
      try {
        const response = await fetch('http://localhost:3000/recommendations/music', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const recommendedMusicData = await response.json();
          setRecommendedMusic(recommendedMusicData);
        } else {
          console.error('Error fetching recommended music:', response.statusText);
        }
      } catch (error) {
        console.error('Error during recommended music fetch:', error);
      }
    };

    fetchRecommendedMusic();
  }, []);

  return (
    <div>
      <h2 className='text-4xl text-white font-bold ml-12 pl-10 mt-5'>Recommended Music</h2>
      {recommendedMusic && recommendedMusic.length > 0 ? (
        <div className="music-container">
          {recommendedMusic && recommendedMusic.map((music) => (
            <div key={music.id} className="music-box border text-white">
              <div className="image-box">
                <p className='text-4xl font-bold text-white'>{music.title.charAt(0)}</p>
              </div>
              <div>
                <p className='text-2xl font-semibold'>{music.title}</p>
                <p className='text-md mb-2'>{music.artist}</p>
                <p>{music.album}</p>
              </div>
              <button className='border w-20 px-2 py-2 bg-blue-700 hover:bg-gray-700 border-blue-700 rounded-full' onClick={() => handlePlay(music)}>Play</button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white mt-5 mx-4">{recommendedMusic ? 'No recommended music' : 'Loading...'}</p>
      )}
    </div>
  );
};

export default RecommendedMusic;