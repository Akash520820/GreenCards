import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CategoryCard from './CategoryCard';
import { categories } from '../../assets/assets';
import './CategoriesSection.css';

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const CategoriesSection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (path) => {
    // Navigate to AllProduct page with category filter as URL parameter
    navigate(`/AllProduct?category=${path}`);
  };

  return (
    <div className="categories-section">
      <div className="container">
        <h2 className="categories-section-title">Categories</h2>
        <motion.div
          className="categories-grid"
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {categories.map((category, index) => (
            <motion.div key={index} variants={itemVariants}>
              <CategoryCard
                category={category}
                onClick={handleCategoryClick}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CategoriesSection;