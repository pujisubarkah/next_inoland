"use client";

import React from 'react';
import Forum from '../components/forum';
import Pdflist from '../components/pdflist';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faChevronLeft,
  faComment,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';

const Pengetahuan = () => {
  const [activeComponent, setActiveComponent] = React.useState('Pdflist');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleForumClick = () => {
    setActiveComponent('Forum');
  };

  const handleListPdfClick = () => {
    setActiveComponent('Pdflist');
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <div
        style={{
          width: isSidebarOpen ? '250px' : '50px',
          transition: 'width 0.3s',
          overflow: 'hidden',
          backgroundColor: '#333',
          color: '#fff',
          padding: '10px',
        }}
      >
        {/* Toggle Sidebar Button */}
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
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <FontAwesomeIcon icon={isSidebarOpen ? faChevronLeft : faChevronRight} />
        </button>

        {/* Sidebar Menu */}
        <ul style={{ listStyleType: 'none', padding: '0' }}>
          <li style={{ marginBottom: '10px' }}>
            <button
              onClick={handleForumClick}
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
                justifyContent: isSidebarOpen ? 'flex-start' : 'center',
              }}
            >
              <FontAwesomeIcon icon={faComment} />
              {isSidebarOpen && <span style={{ marginLeft: '10px' }}>Diskusi Inovasi</span>}
            </button>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <button
              onClick={handleListPdfClick}
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
                justifyContent: isSidebarOpen ? 'flex-start' : 'center',
              }}
            >
              <FontAwesomeIcon icon={faFilePdf} />
              {isSidebarOpen && <span style={{ marginLeft: '10px' }}>Direktori Inovasi</span>}
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '10px' }}>
        {activeComponent === 'Forum' && <Forum />}
        {activeComponent === 'Pdflist' && <Pdflist />}
      </div>
    </div>
  );
};

export default Pengetahuan;
