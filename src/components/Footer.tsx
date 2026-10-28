import './Footer.css'

const Footer = () => {
  return (
    <footer className="ac-gf-footer">
      <div className="ac-gf-content">
        <section className="ac-gf-sosumi">
          <ul>
            <li>1. Trade-in values will vary based on the condition, year, and configuration of your eligible trade-in device. Not all devices are eligible for credit. You must be at least 18 years old to be eligible to trade in for credit or for an Apple Gift Card. Trade-in value may be applied toward qualifying new device purchase, or added to an Apple Gift Card. Actual value awarded is based on receipt of a qualifying device matching the description provided when estimate was made. Sales tax may be assessed on full value of a new device purchase. In-store trade-in requires presentation of a valid photo ID (local law may require saving this information). Offer may not be available in all stores, and may vary between in-store and online trade-in. Some stores may have additional requirements. Apple or its trade-in partners reserve the right to refuse or limit quantity of any trade-in transaction for any reason. More details are available from Apple’s trade-in partner for trade-in and recycling of eligible devices. Restrictions and limitations may apply.</li>
          </ul>
        </section>
        <nav className="ac-gf-directory">
          <div className="ac-gf-directory-column">
            <div className="ac-gf-directory-column-section">
              <h3 className="ac-gf-directory-column-section-title">Shop and Learn</h3>
              <ul className="ac-gf-directory-column-section-list">
                <li><a href="/us/shop/goto/store">Store</a></li>
                <li><a href="/mac">Mac</a></li>
                <li><a href="/ipad">iPad</a></li>
                <li><a href="/iphone">iPhone</a></li>
                <li><a href="/watch">Watch</a></li>
                <li><a href="/apple-vision-pro">Vision</a></li>
                <li><a href="/airpods">AirPods</a></li>
                <li><a href="/tv-home">TV & Home</a></li>
                <li><a href="/us/shop/goto/buy_accessories">Accessories</a></li>
              </ul>
            </div>
          </div>
        </nav>
        <section className="ac-gf-footer-legal">
          <div className="ac-gf-footer-legal-copyright">
            Copyright © 2026 Apple Inc. All rights reserved.
          </div>
        </section>
      </div>
    </footer>
  )
}

export default Footer
