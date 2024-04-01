import { useState, useEffect } from 'react';
import Header from '../components/Header';


const Profile = () => {
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    artist: '',
    genre: '',
    country: '',
    musicFile: null,
  });

  const handleInputChange = (e) => {
    // Update the uploadFormData state based on form input changes
    setUploadFormData({
      ...uploadFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    // Update the uploadFormData state with the selected music file
    setUploadFormData({
      ...uploadFormData,
      musicFile: e.target.files[0],
    });
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object and append form data
    const formData = new FormData();
    formData.append('title', uploadFormData.title);
    formData.append('artist', uploadFormData.artist);
    formData.append('genre', uploadFormData.genre);
    formData.append('country', uploadFormData.country);
    formData.append('musicFile', uploadFormData.musicFile);

    try {
      // Make a POST request to the backend upload endpoint with formData
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        // Handle success (maybe update the musicList state)
        console.log('Music upload successful!');
        alert('Music uploaded successfully')
      } else {
        // Handle error (display an error message to the user)
        console.error('Error uploading music:', response.statusText);
        alert('Error uploading music');
      }
    } catch (error) {
      console.error('Error during music upload:', error);
    }
  };

  return (
    <div>
      <Header showLogin={false} />
      <div className='main flex justify-center flex-col items-center '>
        <h2 className='text-4xl text-white font-bold mt-10'>User's Profile</h2>

        <div className='box2 flex flex-col justify-center items-center m-5 px-5 py-10 rounded-lg'>
          <h3 className='text-3xl text-white font-bold'>Upload Music</h3>

          <form className='flex flex-col justify-center items-center' onSubmit={handleUploadSubmit}>
            <label className="block text-gray-200 text-xl ml-5 mb-2">
              Music File: <br />
              <input type="file" name="musicFile" onChange={handleFileChange} />
            </label>
            <label className="block text-gray-200 text-xl mb-1">
              Title: <br />
              <input
                id='title'
                type="text" 
                name="title"
                placeholder='Input title' 
                value={uploadFormData.title}
                onChange={handleInputChange}
                className="input py-2 px-2 text-sm text-gray-700 lg:text-xl rounded-md" 
              />
            </label>
            <label className="block text-gray-200 text-xl mb-1">
              Artist: <br />
              <input
                id='artist'
                type="text" 
                name="artist"
                placeholder='Input artist' 
                value={uploadFormData.artist}
                onChange={handleInputChange}
                className="input py-2 px-2 text-sm text-gray-700 lg:text-xl rounded-md" 
              />
            </label>
            <label className="block text-gray-200 text-xl mb-1">
              Genre: <br />
              <select 
                id='genre'
                value={uploadFormData.genre}
                onChange={handleInputChange}
                name="genre"
                className="input py-2 px-2 text-sm text-gray-700 lg:text-xl rounded-md"
              >
                <option value="" label="Select a genre" />
                <option value="Hip-hop">Hip-hop</option>
                <option value="Pop">Pop</option>
                <option value="Rap">Rap</option>
                <option value="Afrobeats">Afrobeats</option>
                <option value="Gospel">Gospel</option>
                <option value="Classical">Classical</option>
                <option value="K-pop">K-pop</option>
                <option value="Jazz">Jazz</option>
                <option value="R&B">R&B</option>
                <option value="Reggae">Reggae</option>
                <option value="Instrumental">Instrumental</option>
              </select>
            </label>
            <label className="block text-gray-200 text-xl mb-1">
              Country: <br />
              <select
                id='country'
                name='country'
                value={uploadFormData.country}
                onChange={handleInputChange}
                className="input py-2 px-2 text-sm mb-4 text-gray-700 lg:text-xl rounded-md"
              >
                <option value="" label="Select Country" />
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Asia">Asia</option>
                <option value="Others">Others</option>
              </select>
            </label>
            <button className="bg-blue-600 mb-2 font-semibold text-white w-full  hover:bg-blue-400 py-2 px-1 rounded-md" type="submit">Upload</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile