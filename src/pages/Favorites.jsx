import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import RecipeCard from '../components/RecipeCard'
import useFavorites from '../hooks/useFavorites'

function Favorites() {
  const navigate = useNavigate()
  const { error, favorites, isFavorite, toggleFavorite } = useFavorites()

  return (
    <main className="app-screen">
      <section className="phone-shell overflow-hidden bg-[linear-gradient(180deg,#fff2f8_0%,#f3f7ff_40%,#fffdf4_100%)]">
        <div className="relative px-4 pb-28 pt-5">
          <div className="pointer-events-none absolute inset-0 opacity-80">
            <div className="absolute left-5 top-7 text-2xl">💗</div>
            <div className="absolute right-5 top-8 text-2xl">✨</div>
            <div className="absolute right-9 top-16 text-xl">🧁</div>
          </div>

          <div className="relative z-10">
            <header className="mb-5 text-center">
              <h1 className="text-3xl font-black text-slate-800">Favorites</h1>
              <p className="mt-1 text-sm text-slate-500">The recipes you hearted live here.</p>
            </header>

            {error ? <ErrorMessage message={error} /> : null}

            {favorites.length === 0 ? (
              <EmptyState
                emoji="💖"
                title="No favorites yet"
                message="Tap the heart on any recipe card or details page to save it here."
              />
            ) : (
              <div className="space-y-3">
                {favorites.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    variant="list"
                    onView={() => navigate(`/recipe/${recipe.id}`, { state: { recipe } })}
                    onToggleFavorite={() => toggleFavorite(recipe)}
                    isFavorite={isFavorite(recipe.id)}
                    favoriteMode
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <BottomNav />
        </div>
      </section>
    </main>
  )
}

export default Favorites
