import { useEffect } from 'react';
import { initScrollReveal } from '../assets/ScrollRevealConfig';

/**
 * @param {string} selector - CSS class selector
 * @param {string} configType - نوع الحركة (مثل: 'top', 'topInterval', 'left'...)
 * @param {any[]} deps - بيانات تُراقب لإعادة التفعيل
 */
const useScrollReveal = (selector = '.reveal', configType = 'default', deps = []) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      initScrollReveal(selector, configType);
    }, 100); // لتفادي مشكلة تحميل العناصر ببطء

    return () => clearTimeout(timeout);
  }, deps);
};

export default useScrollReveal;
