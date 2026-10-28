'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import './NavDropdown.css'

interface NavDropdownProps {
  isOpen: boolean
  activeMenu: string | null
  onClose: () => void
}

const menuData: Record<string, any> = {
  store: {
    sections: [
      {
        title: 'Shop',
        links: [
          { label: 'Shop the Latest', path: '/us/shop/goto/store' },
          { label: 'Mac', path: '/mac' },
          { label: 'iPad', path: '/ipad' },
          { label: 'iPhone', path: '/iphone' },
          { label: 'Apple Watch', path: '/watch' },
          { label: 'Apple Vision Pro', path: '/apple-vision-pro' },
          { label: 'AirPods', path: '/airpods' },
          { label: 'Accessories', path: '/us/shop/goto/buy_accessories' },
        ]
      },
      {
        title: 'Quick Links',
        links: [
          { label: 'Find a Store', path: '/retail' },
          { label: 'Order Status', path: '/us/shop/goto/order/list' },
          { label: 'Apple Trade In', path: '/us/shop/goto/trade_in' },
          { label: 'Financing', path: '/us/shop/goto/payment_plan' },
        ]
      }
    ]
  },
  mac: {
    sections: [
      {
        title: 'Explore Mac',
        links: [
          { label: 'Explore All Mac', path: '/mac' },
          { label: 'MacBook Air', path: '/macbook-air' },
          { label: 'MacBook Pro', path: '/macbook-pro' },
          { label: 'iMac', path: '/imac' },
          { label: 'Mac mini', path: '/mac-mini' },
          { label: 'Mac Studio', path: '/mac-studio' },
          { label: 'Mac Pro', path: '/mac-pro' },
          { label: 'Displays', path: '/displays' },
        ]
      },
      {
        title: 'Shop Mac',
        links: [
          { label: 'Shop Mac', path: '/us/shop/goto/buy_mac' },
          { label: 'Mac Accessories', path: '/us/shop/goto/buy_mac/mac_accessories' },
          { label: 'Apple Trade In', path: '/us/shop/goto/trade_in' },
          { label: 'Financing', path: '/us/shop/goto/payment_plan' },
        ]
      }
    ]
  },
  iphone: {
    sections: [
      {
        title: 'Explore iPhone',
        links: [
          { label: 'Explore All iPhone', path: '/iphone' },
          { label: 'iPhone 17 Pro', path: '/iphone-17-pro' },
          { label: 'iPhone 17', path: '/iphone-17' },
          { label: 'iPhone Air', path: '/iphone-air' },
          { label: 'iPhone 16', path: '/iphone-16' },
          { label: 'iPhone 16e', path: '/iphone-16e' },
        ]
      },
      {
        title: 'Shop iPhone',
        links: [
          { label: 'Shop iPhone', path: '/us/shop/goto/buy_iphone' },
          { label: 'iPhone Accessories', path: '/us/shop/goto/buy_iphone/iphone_accessories' },
          { label: 'Apple Trade In', path: '/us/shop/goto/trade_in' },
          { label: 'Financing', path: '/us/shop/goto/payment_plan' },
        ]
      }
    ]
  }
}

const NavDropdown = ({ isOpen, activeMenu, onClose }: NavDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        const header = document.querySelector('.globalnav')
        if (header && !header.contains(e.target as Node)) {
          onClose()
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const data = activeMenu && menuData[activeMenu] ? menuData[activeMenu] : null

  return (
    <>
      <div className={`nav-dropdown-backdrop ${isOpen ? 'is-open' : ''}`} onClick={onClose}></div>
      <div ref={dropdownRef} className={`nav-dropdown ${isOpen && data ? 'is-open' : ''}`}>
        <div className="nav-dropdown-content">
          {data?.sections.map((section: any, idx: number) => (
            <div key={idx} className="nav-dropdown-section">
              <h3 className="nav-dropdown-section-title">{section.title}</h3>
              <ul className="nav-dropdown-list">
                {section.links.map((link: any, linkIdx: number) => (
                  <li key={linkIdx}>
                    <Link 
                      href={link.path} 
                      className={idx === 0 && section.links.length > 4 ? 'nav-dropdown-link' : 'nav-dropdown-link nav-dropdown-link-small'}
                      onClick={onClose}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default NavDropdown
