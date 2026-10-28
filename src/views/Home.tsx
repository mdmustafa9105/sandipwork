import './Home.css'

const Home = () => {
  return (
    <div className="homepage">
      <section className="hero-section hero-iphone-17-pro">
        <div className="hero-content">
          <div className="hero-copy">
            <h2 className="hero-headline">iPhone 17 Pro</h2>
            <p className="hero-subhead">All out Pro.</p>
            <div className="hero-ctas">
              <a href="/iphone-17-pro" className="hero-cta-link">Learn more</a>
              <a href="/us/shop/goto/buy_iphone/iphone_17_pro" className="hero-cta-link">Buy</a>
            </div>
          </div>
        </div>
        <div className="hero-image-wrapper">
          <img src="/images/homepage/hero_iphone_17_pro.jpg" alt="iPhone 17 Pro" />
        </div>
      </section>

      <section className="hero-section hero-iphone-air">
        <div className="hero-content">
          <div className="hero-copy">
            <h2 className="hero-headline">iPhone Air</h2>
            <p className="hero-subhead">The thinnest iPhone ever. With the power of pro inside.</p>
            <div className="hero-ctas">
              <a href="/iphone-air" className="hero-cta-link">Learn more</a>
              <a href="/us/shop/goto/buy_iphone/iphone_air" className="hero-cta-link">Buy</a>
            </div>
          </div>
        </div>
        <div className="hero-image-wrapper">
          <img src="/images/homepage/hero_iphone_air.jpg" alt="iPhone Air" />
        </div>
      </section>

      <section className="hero-section hero-iphone-17">
        <div className="hero-content">
          <div className="hero-copy">
            <h2 className="hero-headline">iPhone 17</h2>
            <p className="hero-subhead">Magichromatic.</p>
            <div className="hero-ctas">
              <a href="/iphone-17" className="hero-cta-link">Learn more</a>
              <a href="/us/shop/goto/buy_iphone/iphone_17" className="hero-cta-link">Buy</a>
            </div>
          </div>
        </div>
        <div className="hero-image-wrapper">
          <img src="/images/homepage/hero_iphone_17.jpg" alt="iPhone 17" />
        </div>
      </section>

      <section className="promo-grid">
        <div className="promo-item promo-watch-series-11">
          <div className="promo-content">
            <h3 className="promo-headline">WATCH SERIES 11</h3>
            <p className="promo-subhead">The ultimate way to watch your health.</p>
            <div className="promo-ctas">
              <a href="/apple-watch-series-11" className="promo-cta-link">Learn more</a>
              <a href="/us/shop/goto/buy_watch/apple_watch_series_11" className="promo-cta-link">Buy</a>
            </div>
          </div>
          <div className="promo-image-wrapper">
            <img src="/images/homepage/promo_watch_series_11.jpg" alt="Apple Watch Series 11" />
          </div>
        </div>
        <div className="promo-item promo-airpods-pro-3">
          <div className="promo-content">
            <h3 className="promo-headline">AirPods Pro 3</h3>
            <p className="promo-subhead">The world's best in-ear Active Noise Cancellation.</p>
            <div className="promo-ctas">
              <a href="/airpods-pro" className="promo-cta-link">Learn more</a>
              <a href="/us/shop/goto/buy_airpods/airpods_pro_3" className="promo-cta-link">Buy</a>
            </div>
          </div>
          <div className="promo-image-wrapper">
            <img src="/images/homepage/promo_airpods_pro_3.jpg" alt="AirPods Pro 3" />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
