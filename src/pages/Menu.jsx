import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

const PROFILE_STORAGE_KEY = 'recipes-only-profile'

const menuItems = [
  { to: '/home', icon: '🏠', title: 'Home', subtitle: 'Search tasty meal ideas' },
  { to: '/add', icon: '➕', title: 'Add Recipe', subtitle: 'Submit your own recipe' },
  { to: '/my-recipes', icon: '🍱', title: 'My Recipes', subtitle: 'Manage saved submissions' },
  { to: '/favorites', icon: '💗', title: 'Favorites', subtitle: 'See your hearted recipes' },
  { to: '/profile', icon: '👤', title: 'Profile', subtitle: 'Update your local account' },
]

function Menu() {
  const navigate = useNavigate()

  const profile = useMemo(() => {
    try {
      const savedValue = localStorage.getItem(PROFILE_STORAGE_KEY)
      return savedValue ? JSON.parse(savedValue) : null
    } catch {
      return null
    }
  }, [])

  const profileName = profile?.name?.trim() || 'Foodie'
  const profileEmail = profile?.email?.trim() || 'Your recipe journey starts here'

  return (
    <main className="app-screen">
      <section className="phone-shell overflow-hidden bg-[linear-gradient(180deg,#e7f3ff_0%,#fff4fb_45%,#fffdf4_100%)]">
        <div className="relative px-5 pb-28 pt-5">
          <div className="pointer-events-none absolute inset-0 opacity-80">
            <div className="absolute left-4 top-8 text-2xl">☁️</div>
            <div className="absolute right-5 top-8 text-2xl">✨</div>
            <div className="absolute left-6 top-40 text-xl">🍓</div>
            <div className="absolute right-6 top-58 text-xl">🧁</div>
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <button type="button" className="icon-bubble" onClick={() => navigate('/home')}>
              ←
            </button>
            <h1 className="text-lg font-black text-slate-800">Menu</h1>
            <div className="icon-bubble text-xl">📋</div>
          </div>

          <section className="soft-card relative z-10 mt-5 overflow-hidden border border-sky-100 bg-white/92 p-5">
            <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,#dff0ff,#ffffff00)]"></div>
            <div className="relative flex items-center gap-4">
              {profile?.image ? (
                <img
                  src={profile.image}
                  alt={profileName}
                  className="h-18 w-18 rounded-full border-4 border-white object-cover shadow-[0_16px_28px_rgba(148,163,184,0.22)]"
                />
              ) : (
                <div className="flex h-18 w-18 items-center justify-center rounded-full border-4 border-white bg-[linear-gradient(135deg,#f9a8d4,#93c5fd,#fde68a)] text-2xl font-black text-white shadow-[0_16px_28px_rgba(148,163,184,0.22)]">
                  {profileName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-pink-400">Hello</p>
                <h2 className="truncate text-2xl font-black text-slate-800">{profileName}</h2>
                <p className="truncate text-sm text-slate-500">{profileEmail}</p>
              </div>
            </div>
          </section>

          <div className="relative z-10 mt-5 space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.to}
                type="button"
                onClick={() => navigate(item.to)}
                className="menu-tile"
              >
                <div className="menu-tile-icon">{item.icon}</div>
                <div className="min-w-0 text-left">
                  <p className="text-lg font-black text-slate-800">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.subtitle}</p>
                </div>
                <span className="text-xl text-slate-300">›</span>
              </button>
            ))}
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <BottomNav />
        </div>
      </section>
    </main>
  )
}

export default Menu
