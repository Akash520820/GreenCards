import React from 'react';
import './CategoryCard.css';

const CategoryCard = ({ category, onClick }) => {
  return (
    <div 
      className="category-card" 
      style={{ backgroundColor: category.bgColor }}
      onClick={() => onClick && onClick(category.path)}
    >
      <div className="category-card-image">
        <img src={category.image} alt={category.text} />
      </div>
      <h3 className="category-card-title">{category.text}</h3>
    </div>
  );
};

export default CategoryCard;