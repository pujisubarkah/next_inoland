"use client";

import React from 'react';
import Infografis from '../components/Carousel';
import Berita from '../components/Berita';
import InovatifMap from '../components/InovatifMap';
import Tuxedovation from '../components/Tuxedovation';
import Jippnas from '../components/Jippnas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, faChartPie, faNewspaper, faVideo, faGlobeAsia, faTableCells } from '@fortawesome/free-solid-svg-icons';
import InovasiLAN from '../components/InovasiLAN';

const Referensi = () => {

  const [activeComponent, setActiveComponent] = React.useState('Indeks Inovasi');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);


  const handleIndeksInovasiClick = () => {
    setActiveComponent('Indeks Inovasi');
  };

  const handleListInovasiClick = () => {
    setActiveComponent('List Inovasi');
  };

  const handleBeritaClick = () => {
    setActiveComponent('Berita');
  };

  const handleInfografisClick = () => {
    setActiveComponent('Infografis');
  };

  const handleTuxedoClick = () => {
    setActiveComponent('Tuxedovation');
  };

  const handleJippnasClick = () => {
    setActiveComponent('Jippnas');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ 
        width: isSidebarOpen ? '250px' : '50px', 
        transition: 'width 0.3s', 
        overflow: 'hidden', 
        backgroundColor: '#333', 
        color: '#fff', 
        padding: '10px' 
      }}>
        <button 
          onClick={toggleSidebar} 
          style={{
            backgroundColor: '#444',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            borderRadius: '5px',
            width: '100%',
            marginBottom: '10px',
            zIndex: '1000',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <FontAwesomeIcon icon={isSidebarOpen ? faChevronLeft : faChevronRight} />
        </button>
        <ul style={{ listStyleType: 'none', padding: '0' }}>
          <li style={{ marginBottom: '10px' }}>
            <button 
              onClick={handleIndeksInovasiClick} 
              style={{
                backgroundColor: '#444',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                cursor: 'pointer',
                borderRadius: '5px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isSidebarOpen ? 'flex-start' : 'center'
              }}
            >
              <FontAwesomeIcon icon={faGlobeAsia} />
              {isSidebarOpen && <span style={{ marginLeft: '10px' }}>Indeks Inovasi Daerah</span>}
            </button>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <button 
              onClick={handleListInovasiClick} 
              style={{
                backgroundColor: '#444',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                cursor: 'pointer',
                borderRadius: '5px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isSidebarOpen ? 'flex-start' : 'center'
              }}
            >
              <FontAwesomeIcon icon={faTableCells} />
              {isSidebarOpen && <span style={{ marginLeft: '10px' }}>List Inovasi</span>}
            </button>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <button 
              onClick={handleBeritaClick} 
              style={{
                backgroundColor: '#444',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                cursor: 'pointer',
                borderRadius: '5px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isSidebarOpen ? 'flex-start' : 'center'
              }}
            >
              <FontAwesomeIcon icon={faNewspaper} />
              {isSidebarOpen && <span style={{ marginLeft: '10px' }}>Berita Inovasi</span>}
            </button>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <button 
              onClick={handleInfografisClick} 
              style={{
                backgroundColor: '#444',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                cursor: 'pointer',
                borderRadius: '5px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isSidebarOpen ? 'flex-start' : 'center'
              }}
            >
              <FontAwesomeIcon icon={faChartPie} />
              {isSidebarOpen && <span style={{ marginLeft: '10px' }}>Infografis Inovasi</span>}
            </button>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <button 
              onClick={handleTuxedoClick} 
              style={{
                backgroundColor: '#444',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                cursor: 'pointer',
                borderRadius: '5px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isSidebarOpen ? 'flex-start' : 'center'
              }}
            >
              <FontAwesomeIcon icon={faVideo} />
              {isSidebarOpen && <span style={{ marginLeft: '10px' }}>Tuxedovation</span>}
            </button>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <button 
              onClick={handleJippnasClick} 
              style={{
                backgroundColor: '#444',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                cursor: 'pointer',
                borderRadius: '5px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isSidebarOpen ? 'flex-start' : 'center'
              }}
            >
              <FontAwesomeIcon icon={faVideo} />
              {isSidebarOpen && <span style={{ marginLeft: '10px' }}>Etalase Jippnas</span>}
            </button>
          </li>
        </ul>
      </div>
      <div style={{ flex: 1, padding: '10px' }}>
        {activeComponent === 'Indeks Inovasi' && <InovatifMap provinces={[]} selectedYear={2023} />}
        {activeComponent === 'List Inovasi' && <InovasiLAN />}
        {activeComponent === 'Berita' && <Berita />}
        {activeComponent === 'Infografis' && <Infografis />}
        {activeComponent === 'Tuxedovation' && <Tuxedovation />}
        {activeComponent === 'Jippnas' && <Jippnas />}
      </div>
    </div>
  );
};

export default Referensi;
