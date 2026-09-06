import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useScrollContainer } from '../../context/ScrollContainerContext';

export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  const { scrollContainerRef } = useScrollContainer();

  useEffect(() => {
    if (scrollContainerRef?.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, scrollContainerRef]);

  return null;
};

export default ScrollToTop;
