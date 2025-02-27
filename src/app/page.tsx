import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const Page: React.FC = () => {
  return (
    <div>
      <Navbar />
      <h1>Welcome to Inoland</h1>
      <p>This is a sample page using the Navbar component.</p>
      <Footer />
    </div>
  );
};

export default Page;

