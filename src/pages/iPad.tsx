import './Page.css'
import './ProductPage.css'

const iPad = () => {
  return (
    <div className="page product-page">
      <section className="product-hero">
        <div className="product-hero-content">
          <div className="product-hero-text">
            <h1 className="product-hero-title">iPad</h1>
            <p className="product-hero-subtitle">Touch, draw, and type on one magical device.</p>
            <div className="product-hero-ctas">
              <a href="/us/shop/goto/buy_ipad" className="product-hero-cta">Shop iPad</a>
              <a href="/ipad-pro" className="product-hero-cta">Learn more</a>
            </div>
          </div>
          <div className="product-hero-image">
            <img src="/images/ipad/ipad_pro.jpg" alt="iPad Pro" />
          </div>
        </div>
      </section>
    </div>
  )
}

export default iPad
