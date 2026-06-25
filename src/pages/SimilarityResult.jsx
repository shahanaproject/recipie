import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const SIMILARITY_RESULT_KEY = 'recipes-only-last-similarity-result'

function SimilarityResult() {
  const location = useLocation()
  const navigate = useNavigate()

  const result = useMemo(() => {
    if (location.state?.result) {
      return location.state.result
    }

    try {
      const savedValue = sessionStorage.getItem(SIMILARITY_RESULT_KEY)
      return savedValue ? JSON.parse(savedValue) : null
    } catch {
      return null
    }
  }, [location.state])

  const isApproved = result?.status === 'approved'

  return (
    <main className="app-screen">
      <section className="phone-shell overflow-hidden bg-[linear-gradient(180deg,#ddf8fb_0%,#f0fffb_36%,#ffffff_100%)] px-5 py-6">
        <div className="pointer-events-none absolute inset-x-0 top-6 text-center text-3xl">☁️ ✨ ☁️</div>

        <div className="relative z-10 pt-10 text-center">
          <h1 className="text-[2rem] font-black text-slate-800">Recipe Submitted! 🎉</h1>
          <p className="mt-2 text-sm text-slate-600">We&apos;re checking your recipe for similarities...</p>
        </div>

        <section className="soft-card mt-6 flex items-center justify-between gap-3 p-5">
          <div>
            <p className="text-sm font-bold text-slate-700">Similarity Score</p>
            <p className={`mt-3 text-6xl font-black ${isApproved ? 'text-emerald-500' : 'text-rose-500'}`}>
              {result ? `${result.similarityScore}%` : '--'}
            </p>
          </div>
          <div className="text-7xl">{isApproved ? '🥣' : '🚫'}</div>
        </section>

        <section className="soft-card mt-4 px-5 py-6 text-center">
          <p className="text-xl font-black text-slate-800">{isApproved ? 'Great news! 🎉' : 'Too similar! 🥲'}</p>
          <p className="mt-2 text-sm text-slate-600">
            {result?.matchedRecipeTitle
              ? `Closest match: ${result.matchedRecipeTitle}`
              : 'Your recipe was compared with saved and API recipes.'}
          </p>
          <p className={`mt-4 text-2xl font-black ${isApproved ? 'text-emerald-600' : 'text-rose-500'}`}>
            {isApproved ? 'Your recipe has been APPROVED ✅' : 'Your recipe has been REJECTED ❌'}
          </p>
        </section>

        <section className="soft-card mt-4 px-5 py-6">
          <h2 className="text-lg font-black text-slate-800">What happens next?</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-600">
            <li>Your recipe is now stored in your local cookbook.</li>
            <li>You can manage it any time from My Recipes.</li>
          </ol>
        </section>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" className="primary-button bg-[linear-gradient(135deg,#8b5cf6,#ec4899)]" onClick={() => navigate('/my-recipes')}>
            View My Recipes
          </button>
          <button type="button" className="secondary-button" onClick={() => navigate('/home')}>
            Back to Home
          </button>
        </div>
      </section>
    </main>
  )
}

export default SimilarityResult
