import './Page.css'
import './ProductPage.css'

const AirPods = () => {
  return (
    <div className="page product-page">
      <section className="product-hero">
        <div className="product-hero-content">
          <div className="product-hero-text">
            <h1 className="product-hero-title">AirPods</h1>
            <p className="product-hero-subtitle">Magic like you've never heard.</p>
            <div className="product-hero-ctas">
              <a href="/us/shop/goto/buy_airpods" className="product-hero-cta">Shop AirPods</a>
              <a href="/airpods-pro" className="product-hero-cta">Learn more</a>
            </div>
          </div>
          <div className="product-hero-image">
            <img src="/images/airpods/airpods_pro.jpg" alt="AirPods Pro" />
          </div>
        </div>
      </section>
    </div>
  )
}

export default AirPods
