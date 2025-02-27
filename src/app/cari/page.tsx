'use client';

import { useState } from 'react';
import InteractiveMap from '../components/InteractiveMap';
import ListInovasi from '../components/ListInovasi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faTable, faGlobe } from '@fortawesome/free-solid-svg-icons';

const Cariinovasi = () => {
  const [activeComponent, setActiveComponent] = useState('SebaranInovasi');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSebaranInovasiClick = () => setActiveComponent('SebaranInovasi');
  const handleListInovasiClick = () => setActiveComponent('ListInovasi');
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen">
      <div 
        className={`bg-gray-800 text-white transition-all duration-300 p-3 ${isSidebarOpen ? 'w-64' : 'w-16'}`}
      >
        <button 
          onClick={toggleSidebar} 
          className="bg-gray-700 text-white p-2 rounded w-full flex justify-center mb-3"
        >
          <FontAwesomeIcon icon={isSidebarOpen ? faChevronLeft : faChevronRight} />
        </button>
        <ul className="space-y-3">
          <li>
            <button 
              onClick={handleSebaranInovasiClick} 
              className="flex items-center bg-gray-700 p-2 rounded w-full hover:bg-gray-600"
            >
              <FontAwesomeIcon icon={faGlobe} />
              {isSidebarOpen && <span className="ml-2">Sebaran Inovasi</span>}
            </button>
          </li>
          <li>
            <button 
              onClick={handleListInovasiClick} 
              className="flex items-center bg-gray-700 p-2 rounded w-full hover:bg-gray-600"
            >
              <FontAwesomeIcon icon={faTable} />
              {isSidebarOpen && <span className="ml-2">Daftar Inovasi</span>}
            </button>
          </li>
        </ul>
      </div>
      <div className="flex-1 p-4">
        {activeComponent === 'SebaranInovasi' && <InteractiveMap />}
        {activeComponent === 'ListInovasi' && <ListInovasi />}
      </div>
    </div>
  );
};

export default Cariinovasi;
