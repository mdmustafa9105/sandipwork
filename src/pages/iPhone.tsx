import './Page.css'
import './ProductPage.css'

const IPhone = () => {
  return (
    <div className="page product-page">
      <section className="product-hero">
        <div className="product-hero-content">
          <div className="product-hero-text">
            <h1 className="product-hero-title">iPhone 17 Pro</h1>
            <p className="product-hero-subtitle">All out Pro.</p>
            <div className="product-hero-ctas">
              <a href="/us/shop/goto/buy_iphone/iphone_17_pro" className="product-hero-cta">Buy</a>
              <a href="/iphone-17-pro" className="product-hero-cta">Learn more</a>
            </div>
          </div>
          <div className="product-hero-image">
            <img src="/images/iphone/iphone_17_pro.jpg" alt="iPhone 17 Pro" />
          </div>
        </div>
      </section>

      <section className="product-showcase">
        <div className="product-showcase-item">
          <h2 className="product-showcase-title">iPhone Air</h2>
          <p className="product-showcase-subtitle">The thinnest iPhone ever. With the power of pro inside.</p>
          <div className="product-showcase-ctas">
            <a href="/us/shop/goto/buy_iphone/iphone_air" className="product-showcase-cta">Buy</a>
            <a href="/iphone-air" className="product-showcase-cta">Learn more</a>
          </div>
          <div className="product-showcase-image">
            <img src="/images/iphone/hero_iphone_air.jpg" alt="iPhone Air" />
          </div>
        </div>
      </section>

      <section className="product-showcase" style={{ background: '#fbfbfd' }}>
        <div className="product-showcase-item">
          <h2 className="product-showcase-title">iPhone 17</h2>
          <p className="product-showcase-subtitle">Magichromatic.</p>
          <div className="product-showcase-ctas">
            <a href="/us/shop/goto/buy_iphone/iphone_17" className="product-showcase-cta">Buy</a>
            <a href="/iphone-17" className="product-showcase-cta">Learn more</a>
          </div>
          <div className="product-showcase-image">
            <img src="/images/iphone/hero_iphone_17.jpg" alt="iPhone 17" />
          </div>
        </div>
      </section>
    </div>
  )
}

export default IPhone
