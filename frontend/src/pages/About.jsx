import React from 'react';
import Header from '../components/Header';

const About = () => {
  return (
    <div className='text-white'>
        <Header showLogin={false}/>
        <div className="home px-10 py-8">
        <h1 className="primary text-center text-4xl font-bold mb-4">About Our Music App</h1>

        <section className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Overview</h2>
            <p className="text-white text-lg">
            Our music app is a personalized music experience that allows users to discover and enjoy their favorite music based on their preferences.
            </p>
        </section>

        <section className="mb-4">
            <h2 className="text-2xl font-bold mb-2">How It Works</h2>
            <p className="text-white text-lg">
            Our app leverages advanced recommendation algorithms to suggest music that matches the user's preferences. Users can set their preferences in terms of genre, artist, and country.
            </p>
            <p className="text-white text-lg">
            The app also provides a seamless search feature, allowing users to find specific music by title, artist, or genre. The search results are displayed in an organized manner, making it easy for users to navigate and discover new music.
            </p>
        </section>

        <section className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Features</h2>
            <ul className="list-disc pl-6 text-white text-lg">
            <li>Personalized music recommendations based on user preferences.</li>
            <li>Efficient search functionality for finding specific music.</li>
            <li>User-friendly interface with responsive design.</li>
            {/* Add more features as needed */}
            </ul>
        </section>

        <section className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Technologies Used</h2>
            <p className="text-white text-lg">
            Our web application is built using modern technologies, including React for the frontend, Node.js for the backend, and a database to store user preferences and music metadata.
            </p>
        </section>

        <section className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Contact Us</h2>
            <p className="text-white text-lg">
            If you have any questions or feedback, feel free to reach out to us at <a className='text-blue-600 font-semibold text-xl hover:underline' href="mailto:chimakingsley216@gmail.com">chimakingsley216@gmail.com</a>.
            </p>
        </section>
        </div>
    </div>
  );
};

export default About;