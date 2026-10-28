import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Mac from './pages/Mac'
import iPad from './pages/iPad'
import iPhone from './pages/iPhone'
import Watch from './pages/Watch'
import AirPods from './pages/AirPods'
import Vision from './pages/Vision'
import TVHome from './pages/TVHome'
import Entertainment from './pages/Entertainment'
import Accessories from './pages/Accessories'
import Store from './pages/Store'
import Support from './pages/Support'
import './styles/App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mac" element={<Mac />} />
          <Route path="/ipad" element={<iPad />} />
          <Route path="/iphone" element={<iPhone />} />
          <Route path="/watch" element={<Watch />} />
          <Route path="/airpods" element={<AirPods />} />
          <Route path="/apple-vision-pro" element={<Vision />} />
          <Route path="/home" element={<TVHome />} />
          <Route path="/entertainment" element={<Entertainment />} />
          <Route path="/us/shop/goto/buy_accessories" element={<Accessories />} />
          <Route path="/us/shop/goto/store" element={<Store />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
