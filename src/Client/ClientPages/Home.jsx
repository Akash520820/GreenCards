
import "./Home.css";
import MainBanner from '../ClientsComponent/MainBanner';
import CategoriesSection from '../ClientsComponent/CategoriesSection';
import BestSeller from '../ClientsComponent/BestSeller';
import PromoBanner from '../ClientsComponent/PromoBanner';
import React from 'react';
import { useProducts } from '../../context/ProductContext';


const Home = () => {
  const { loading: productsLoading } = useProducts();

  if (productsLoading) {
    return (
      <div className="home-page">
        <div className="container">
          <div className="products-loading">
            <div className="spinner"></div>
            <p>Loading…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container  Homecontainer'>
      <MainBanner />
      <CategoriesSection />
      <BestSeller />
      <PromoBanner />
    </div>
  );
};

export default Home;



