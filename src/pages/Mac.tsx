import './Page.css'
import './ProductPage.css'

const Mac = () => {
  return (
    <div className="page product-page">
      <section className="product-hero">
        <div className="product-hero-content">
          <div className="product-hero-text">
            <h1 className="product-hero-title">Mac</h1>
            <p className="product-hero-subtitle">If you can dream it, Mac can do it.</p>
            <div className="product-hero-ctas">
              <a href="/us/shop/goto/buy_mac" className="product-hero-cta">Shop Mac</a>
              <a href="/macbook-air" className="product-hero-cta">Learn more</a>
            </div>
          </div>
          <div className="product-hero-image">
            <img src="/images/mac/macbook_air.jpg" alt="MacBook Air" />
          </div>
        </div>
      </section>

      <section className="product-showcase">
        <div className="product-showcase-item">
          <h2 className="product-showcase-title">MacBook Pro</h2>
          <p className="product-showcase-subtitle">Mind-blowing. Head-turning.</p>
          <div className="product-showcase-ctas">
            <a href="/macbook-pro" className="product-showcase-cta">Learn more</a>
            <a href="/us/shop/goto/buy_mac/macbook_pro" className="product-showcase-cta">Buy</a>
          </div>
          <div className="product-showcase-image">
            <img src="/images/mac/macbook_pro.jpg" alt="MacBook Pro" />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Mac
