import './Page.css'
import './ProductPage.css'

const Watch = () => {
  return (
    <div className="page product-page">
      <section className="product-hero">
        <div className="product-hero-content">
          <div className="product-hero-text">
            <h1 className="product-hero-title">Apple Watch</h1>
            <p className="product-hero-subtitle">The ultimate device for a healthy life.</p>
            <div className="product-hero-ctas">
              <a href="/us/shop/goto/buy_watch" className="product-hero-cta">Shop Apple Watch</a>
              <a href="/apple-watch-ultra-3" className="product-hero-cta">Learn more</a>
            </div>
          </div>
          <div className="product-hero-image">
            <img src="/images/watch/apple_watch.jpg" alt="Apple Watch" />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Watch
