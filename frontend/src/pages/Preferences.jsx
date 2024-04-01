import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Preferences = () => {
  const [currentPreferences, setCurrentPreferences] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // const token = localStorage.getItem('authToken');
    // Fetch current user preferences from the backend API
    const fetchPreferences = async () => {
      try {
        const response = await fetch('http://localhost:3000/preferences', {
          method: 'GET',
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
          credentials: 'include',
        });
        // console.log(`Bearer ${localStorage.getItem('token')}`);

        if (response.ok) {
          const preferences = await response.json();
          setCurrentPreferences(preferences);
        } else {
          console.error('Error fetching preferences:', response.statusText);
        }
      } catch (error) {
        console.error('Error during preferences fetch:', error);
      }
    };

    fetchPreferences();
  }, []);

  const formik = useFormik({
    initialValues: {
      artist: currentPreferences.artist || '',
      genre: currentPreferences.genre || '',
      country: currentPreferences.country || '',
      dataThreshold: currentPreferences.dataThreshold || '',
    },
    validationSchema: Yup.object({
      title: Yup.string(''),
      artist: Yup.string(),
      genre: Yup.string().oneOf(['Hip-hop', 'Pop', 'Rap', 'Afrobeats', 'Gospel', 'Classical', 'K-pop', 'Jazz', 'R&B', 'Reggae', 'Instrumental'], 'Invalid genre'),
      country: Yup.string().oneOf(['USA', 'UK', 'Nigeria', 'Asia', 'Others'], 'Invalid country'),
      dataThreshold: Yup.number().min(1, 'Data threshold must be at least 1').required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        // Send updated preferences to the backend API
        const response = await fetch('http://localhost:3000/preferences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          credentials: 'include',
          body: JSON.stringify(values),
        });

        if (response.ok) {
          // Navigate to the music page upon successful update
          navigate('/music');
        } else {
          console.error('Error updating preferences:', response.statusText);
        }
      } catch (error) {
        console.error('Error during preferences update:', error);
      }
    },
  });

  const handleContinue = () => {
    navigate('/music');
  }

  return (
    <div className=''>
      <Header  showLogin = {false}/>
      <div className='main flex justify-center lg:gap-10 lg:flex-row flex-col items-center'>
        <div className="box3 flex flex-col justify-center items-center px-5 py-10 rounded-lg lg:mt-0 mt-10 mb-4">
          <h2 className="lg:text-4xl text-2xl lg:mb-0 mb-4 text-white font-bold">Current Preferences:</h2>
          <p className='lg:text-xl text-lg lg:mb-0 mb-2 text-white font-bold'>Artist: {currentPreferences.artist || 'Not set'}</p>
          <p className='lg:text-xl text-lg lg:mb-0 mb-2 text-white font-bold'>Genre: {currentPreferences.genre || 'Not set'}</p>
          <p className='lg:text-xl text-lg lg:mb-0 mb-2 text-white font-bold'>Country: {currentPreferences.country || 'Not set'}</p>
          <p className='lg:text-xl text-lg text-white font-bold'>Data Threshold: {currentPreferences.dataThreshold || 'Not set'} MB</p>
          <button onClick={handleContinue} className="bg-blue-600 mt-5 font-semibold text-white lg:w-80  hover:bg-blue-400 py-2 px-1 rounded-md">
              Continue with Preferences
            </button>
        </div>

        <div className='box2 flex flex-col justify-center items-center m-5 px-5 py-10 rounded-lg'>
        <h2 className='text-4xl text-white font-bold'>Set Preferences</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label htmlFor="artist" className="block text-gray-200 text-xl mb-1">
                Artist:
              </label>
              <input
                type="text"
                id="artist"
                name="artist"
                placeholder='Input artist suggestion'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.artist}
                className="input py-2 px-2 text-sm lg:text-xl rounded-md"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="genre" className="block text-gray-200 text-xl mb-1">
                Genre:
              </label>
              <select
                id="genre"
                name="genre"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.genre}
                className="input py-2 px-2 text-sm lg:text-xl rounded-md"
              >
                <option value="" disabled>Select Genre</option>
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
            </div>

            <div className="mb-4">
              <label htmlFor="country" className="block text-gray-200 text-xl mb-1">
                Country:
              </label>
              <select
                id="country"
                name="country"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.country}
                className="input py-2 px-2 text-sm lg:text-xl rounded-md"
              >
                <option value="" disabled>Select Country</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Asia">Asia</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="dataThreshold" className="block text-gray-200 text-xl mb-1">
                Data Threshold (MB):
              </label>
              <input
                type="number"
                id="dataThreshold"
                name="dataThreshold"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.dataThreshold}
                className="input py-2 px-2 text-sm lg:text-xl rounded-md"
              />
            </div>

            <button type="submit" className="bg-blue-600 mb-2 font-semibold text-white w-full  hover:bg-blue-400 py-2 px-1 rounded-md">
              Reset Preferences
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
