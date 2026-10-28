import './Page.css'
import './ProductPage.css'

const Vision = () => {
  return (
    <div className="page product-page">
      <section className="product-hero">
        <div className="product-hero-content">
          <div className="product-hero-text">
            <h1 className="product-hero-title">Apple Vision Pro</h1>
            <p className="product-hero-subtitle">Welcome to the era of spatial computing.</p>
            <div className="product-hero-ctas">
              <a href="/us/shop/goto/buy_vision" className="product-hero-cta">Buy</a>
              <a href="/apple-vision-pro" className="product-hero-cta">Learn more</a>
            </div>
          </div>
          <div className="product-hero-image">
            <img src="/images/vision/vision_pro.jpg" alt="Apple Vision Pro" />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Vision
