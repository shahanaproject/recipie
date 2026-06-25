import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import splashReference from '../assets/images/splash-reference.png'

function Splash() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate('/home')
    }, 5000)

    const startedAt = Date.now()
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startedAt
      const nextProgress = Math.min((elapsed / 5000) * 100, 100)
      setProgress(nextProgress)
    }, 50)

    return () => {
      window.clearTimeout(timer)
      window.clearInterval(interval)
    }
  }, [navigate])

  return (
    <main className="app-screen bg-[radial-gradient(circle_at_top,#ffe7f5_0%,#ffd4ea_28%,#f9d7ff_58%,#ffffff_100%)]">
      <section className="phone-shell overflow-hidden bg-[linear-gradient(180deg,#ffd2eb_0%,#fdf0fb_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff66_0%,transparent_28%)]"></div>
        <img
          src={splashReference}
          alt="Recipes Only splash screen"
          className="absolute inset-0 h-full w-full scale-[1.14] object-cover object-[center_36%]"
        />
        <div className="absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,#ffd2eb_0%,#ffd9ef_55%,transparent_100%)]"></div>
        <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,transparent_0%,#fff4fb_42%,#fff7fc_100%)]"></div>

        <div className="absolute inset-x-5 bottom-7 z-20 rounded-[28px] bg-white/92 px-4 py-3 shadow-[0_18px_36px_rgba(250,168,212,0.28)]">
          <p className="text-center text-sm font-black text-[#d86ba9]">Loading delicious recipes...</p>
          <div className="mt-2 h-4 overflow-hidden rounded-full border border-pink-200 bg-white">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#f472b6,#fb7185,#facc15)] transition-[width] duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </section>
    </main>
  )
}

export default Splash
