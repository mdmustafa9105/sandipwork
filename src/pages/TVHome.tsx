import './Page.css'
import './ProductPage.css'

const TVHome = () => {
  return (
    <div className="page product-page">
      <section className="product-hero">
        <div className="product-hero-content">
          <div className="product-hero-text">
            <h1 className="product-hero-title">TV & Home</h1>
            <p className="product-hero-subtitle">The future hits home.</p>
            <div className="product-hero-ctas">
              <a href="/us/shop/goto/buy_tv" className="product-hero-cta">Shop Apple TV 4K</a>
              <a href="/home" className="product-hero-cta">Explore HomePod</a>
            </div>
          </div>
          <div className="product-hero-image">
            <img src="/images/tv-home/tv_home.jpg" alt="Apple TV & Home" />
          </div>
        </div>
      </section>
    </div>
  )
}

export default TVHome
