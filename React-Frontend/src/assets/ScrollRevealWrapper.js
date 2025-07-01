import { useEffect, useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import { initScrollReveal } from './ScrollRevealConfig';

const ScrollRevealWrapper = () => {
  const { products, gifts } = useContext(ProductContext);

  useEffect(() => {
    if (products.length > 0 || gifts.length > 0) {
      initScrollReveal();
    }
  }, []);

  return null;
};

export default ScrollRevealWrapper;
