import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/home', label: 'Home', icon: '🏠' },
  { to: '/add', label: 'Add Recipe', icon: '➕' },
  { to: '/my-recipes', label: 'My Recipes', icon: '🍱' },
  { to: '/favorites', label: 'Favorites', icon: '💗' },
  { to: '/profile', label: 'Profile', icon: '👤' },
]

function BottomNav() {
  return (
    <nav className="border-t border-white/70 bg-white/88 px-3 py-3 backdrop-blur-xl">
      <div className="grid grid-cols-5 gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'nav-item-active' : 'nav-item-idle'}`
            }
          >
            <span className="text-lg" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav
