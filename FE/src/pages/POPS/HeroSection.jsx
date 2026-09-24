import { useEffect, useState } from "react";

const heroSlides = [
  {
    image: "/dist/img/anh3.jpg",
    alt: "Nhà máy sản xuất thảm bê tông",
  },
  {
    image: "/dist/img/anh10.jpg",
    alt: "Dây chuyền sản xuất",
  },
  {
    image: "/dist/img/anh8.jpg",
    alt: "Công trình thi công",
  },
];

export default function HeroSection({ onOpenOrder }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % heroSlides.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, [isPaused]);

  const showSlide = (slideIndex) => {
    setActiveSlide((slideIndex + heroSlides.length) % heroSlides.length);
  };

  return (
    <section className="lp-hero lp-hero-full-width">
      <div className="hero-container">
        <div className="lp-hero-grid">
          <div className="lp-hero-left">
            <div className="lp-hero-tag">
              CÔNG TY TNHH THẢM BÊ TÔNG VIỆT NAM
            </div>
            <h1 className="lp-hero-title">
              THẢM
              <br />
              BÊ TÔNG
            </h1>
            <div className="lp-hero-rule" />
            <p className="lp-hero-desc">
              Giải pháp bền vững cho công trình hiện đại — Sản xuất tại Việt Nam
              với công nghệ tiên tiến từ nước ngoài.
            </p>

            <div className="lp-hero-highlights">
              <span>◯ Bền Vững</span>
              <span>♧ Thi Công Nhanh</span>
              <span>● Tối Ưu Chi Phí</span>
            </div>

            <div className="lp-hero-btns">
              <a href="#bang-gia" className="btn-lp-primary">
                XEM SẢN PHẨM
              </a>
              <a href="#lien-he" className="btn-lp-secondary">
                LIÊN HỆ TƯ VẤN
              </a>
            </div>
          </div>

          <div
            className="lp-hero-gallery"
            aria-label="Hình ảnh sản phẩm và công trình"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="lp-gallery-stage">
              {heroSlides.map((slide, slideIndex) => (
                <img
                  key={slide.image}
                  className={`lp-gallery-slide${
                    slideIndex === activeSlide ? " is-active" : ""
                  }`}
                  src={slide.image}
                  alt={slide.alt}
                  aria-hidden={slideIndex !== activeSlide}
                />
              ))}
              <button
                className="lp-gallery-arrow lp-gallery-arrow-prev"
                type="button"
                aria-label="Ảnh trước"
                onClick={() => showSlide(activeSlide - 1)}
              >
                &#8592;
              </button>
              <button
                className="lp-gallery-arrow lp-gallery-arrow-next"
                type="button"
                aria-label="Ảnh tiếp theo"
                onClick={() => showSlide(activeSlide + 1)}
              >
                &#8594;
              </button>
            </div>
            <div
              className="lp-gallery-dots"
              role="tablist"
              aria-label="Chọn ảnh"
            >
              {heroSlides.map((slide, slideIndex) => (
                <button
                  key={slide.image}
                  className={`lp-gallery-dot${
                    slideIndex === activeSlide ? " is-active" : ""
                  }`}
                  type="button"
                  role="tab"
                  aria-label={`Xem ảnh ${slideIndex + 1}`}
                  aria-selected={slideIndex === activeSlide}
                  onClick={() => showSlide(slideIndex)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
