import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NewsGrid.css';

const NewsGrid = ({ items }) => {
  const navigate = useNavigate();

  const handleItemClick = (id) => {
    navigate(`/news/${id}`);
  };

  const sortedItems = items.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="news-grid">
      {sortedItems.map((item) => (
        <div key={item.id} className="news-item" onClick={() => handleItemClick(item.id)}>
          <img src={item.image} alt={item.title} className="news-image" />
          <div className="news-content">
            <h3><b>{item.title}</b></h3>
            <p style={{ color: 'darkred' }}>{item.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsGrid;
