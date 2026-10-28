import './Page.css'
import './ProductPage.css'

const Accessories = () => {
  return (
    <div className="page product-page">
      <section className="product-hero">
        <div className="product-hero-content">
          <div className="product-hero-text">
            <h1 className="product-hero-title">Accessories</h1>
            <p className="product-hero-subtitle">Mix. Match. MagSafe.</p>
            <div className="product-hero-ctas">
              <a href="/us/shop/goto/buy_accessories" className="product-hero-cta">Shop all accessories</a>
              <a href="/us/shop/goto/buy_magsafe" className="product-hero-cta">Shop MagSafe</a>
            </div>
          </div>
          <div className="product-hero-image">
            <img src="/images/accessories/accessories.jpg" alt="Apple Accessories" />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Accessories
