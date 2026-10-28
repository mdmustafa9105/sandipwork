import './Page.css'
import './ProductPage.css'

const IPhone = () => {
  return (
    <div className="page product-page">
      <section className="product-hero">
        <div className="product-hero-content">
          <div className="product-hero-text">
            <h1 className="product-hero-title">iPhone</h1>
            <p className="product-hero-subtitle">Designed to be loved.</p>
            <div className="product-hero-ctas">
              <a href="/us/shop/goto/buy_iphone" className="product-hero-cta">Shop iPhone</a>
              <a href="/iphone-17-pro" className="product-hero-cta">Learn more</a>
            </div>
          </div>
          <div className="product-hero-image">
            <img src="/images/iphone/iphone_17_pro.jpg" alt="iPhone 17 Pro" />
          </div>
        </div>
      </section>
    </div>
  )
}

export default IPhone
