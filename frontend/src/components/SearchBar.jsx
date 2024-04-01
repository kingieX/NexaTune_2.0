import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    try {
      // Use fetch for search, assuming the endpoint is /search
      const response = await fetch(`http://localhost:3000/search?title=${searchTerm}`, {
        method: 'GET',
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
          credentials: 'include',
      });

      const data = await response.json();
      onSearch(data);
    } catch (error) {
      console.error('Error searching for music:', error);
    }
  };

  return (
    <div className='flex justify-center mt-'>
      <input
        type="text"
        placeholder="Search for music..."
        value={searchTerm}
        className="input py-2 px-2 text-sm lg:text-xl rounded-md"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch} className="bg-blue-600 ml-2 font-semibold text-white  hover:bg-blue-400 py-2 px-4 rounded-md">Search</button>
    </div>
  );
};

export default SearchBar;
