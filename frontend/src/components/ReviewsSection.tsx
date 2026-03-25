import { useState, useEffect } from 'react';
import type { TouchEvent } from 'react';

const MOBILE_MQ = '(max-width: 640px)';

const reviews = [
  { id: 1, img: "/image/отзывы/отзыв1.svg", alt: "Отзыв 1" },
  { id: 2, img: "/image/отзывы/отзыв2.svg", alt: "Отзыв 2" },
  { id: 3, img: "/image/отзывы/отзыв3.svg", alt: "Отзыв 3" },
  { id: 4, img: "/image/отзывы/отзыв4.svg", alt: "Отзыв 4" },
  { id: 5, img: "/image/отзывы/отзыв5.svg", alt: "Отзыв 5" },
  { id: 6, img: "/image/отзывы/отзыв6.svg", alt: "Отзыв 6" },
];

export default function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MQ);

    const apply = () => {
      setIsMobile(mq.matches);
    };

    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
  };

  // Получаем карточки для отображения: на телефоне 2, на десктопе 3
  const getVisibleReviews = () => {
    const result = [];
    const visibleCount = isMobile ? 2 : 3;
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % reviews.length;
      result.push({ ...reviews[index], position: i });
    }
    return result;
  };

  const visibleReviews = getVisibleReviews();

  return (
    <section className="reviews-section">
      <div className="reviews-container">
        <h2 className="reviews-title">Отзывы о нашей работе</h2>
        
        <div className="slider-wrapper">
          <button className="slider-btn slider-btn-prev" onClick={prevSlide} aria-label="Предыдущий">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div 
            className="slider-viewport"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="slider-track">
              {visibleReviews.map((review, index) => (
                <div 
                  key={`${review.id}-${currentIndex}-${index}`} 
                  className={`slide-card slide-card-${review.position}`}
                >
                  <div className="card-inner">
                    <img 
                      src={review.img} 
                      alt={review.alt}
                      className="card-image"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="slider-btn slider-btn-next" onClick={nextSlide} aria-label="Следующий">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="slider-dots">
          {reviews.map((_, index: number) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}