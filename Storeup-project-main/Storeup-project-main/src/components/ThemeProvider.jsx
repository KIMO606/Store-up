import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

/**
 * مكون ThemeProvider لتطبيق ألوان النمط على مستوى التطبيق
 * يستخدم CSS Variables لتطبيق الألوان بشكل ديناميكي
 */
const ThemeProvider = ({ children }) => {
  const { currentStore } = useSelector((state) => state.store);
  
  // تحديث متغيرات CSS عند تغيير النمط
  useEffect(() => {
    if (currentStore?.theme) {
      const { primaryColor, secondaryColor } = currentStore.theme;
      
      // تحويل اللون الأساسي إلى ألوان مختلفة الشدة
      const root = document.documentElement;
      
      // تطبيق اللون الأساسي
      root.style.setProperty('--color-primary', primaryColor);
      root.style.setProperty('--color-primary-hover', adjustColor(primaryColor, -10));
      root.style.setProperty('--color-primary-light', adjustColor(primaryColor, 40));
      root.style.setProperty('--color-primary-bg', `${primaryColor}10`);
      
      // تطبيق اللون الثانوي
      root.style.setProperty('--color-secondary', secondaryColor);
      root.style.setProperty('--color-secondary-hover', adjustColor(secondaryColor, -10));
      root.style.setProperty('--color-secondary-light', adjustColor(secondaryColor, 40));
      root.style.setProperty('--color-secondary-bg', `${secondaryColor}10`);
    }
  }, [currentStore]);
  
  return (
    <>{children}</>
  );
};

/**
 * وظيفة مساعدة لتعديل درجة اللون
 * @param {string} color - اللون الأصلي بتنسيق hex
 * @param {number} amount - مقدار التغيير (-100 إلى 100)
 * @returns {string} - اللون المعدل بتنسيق hex
 */
function adjustColor(color, amount) {
  // إزالة # إذا كانت موجودة
  color = color.replace('#', '');
  
  // تحويل إلى RGB
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);
  
  // تعديل الألوان
  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));
  
  // تحويل إلى hex مرة أخرى
  const rr = r.toString(16).padStart(2, '0');
  const gg = g.toString(16).padStart(2, '0');
  const bb = b.toString(16).padStart(2, '0');
  
  return `#${rr}${gg}${bb}`;
}

export default ThemeProvider; 