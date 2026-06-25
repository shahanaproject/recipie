import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
import RecipeCard from '../components/RecipeCard'
import useFavorites from '../hooks/useFavorites'
import { fetchPopularRecipes, searchRecipesByIngredient, searchRecipesByKeyword } from '../services/recipeApi'

const categories = [
  { label: 'Breakfast', emoji: '🍳' },
  { label: 'Lunch', emoji: '🍔' },
  { label: 'Dinner', emoji: '🍜' },
  { label: 'Dessert', emoji: '🍰' },
  { label: 'Snack', emoji: '🧁' },
]

function Home() {
  const navigate = useNavigate()
  const [searchMode, setSearchMode] = useState('keyword')
  const [query, setQuery] = useState('')
  const [recipes, setRecipes] = useState([])
  const [popularRecipes, setPopularRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()

  useEffect(() => {
    const loadPopularRecipes = async () => {
      try {
        const results = await fetchPopularRecipes()
        setPopularRecipes(results)
        setRecipes(results)
      } catch {
        setError('We could not load popular recipes right now.')
      } finally {
        setLoading(false)
      }
    }

    loadPopularRecipes()
  }, [])

  const runSearch = async (value = query, mode = searchMode) => {
    const trimmedValue = value.trim()

    if (!trimmedValue) {
      setRecipes(popularRecipes)
      setHasSearched(false)
      return
    }

    setSearching(true)
    setError('')
    setHasSearched(true)

    try {
      const results =
        mode === 'keyword'
          ? await searchRecipesByKeyword(trimmedValue)
          : await searchRecipesByIngredient(trimmedValue)

      setRecipes(results)
    } catch {
      setError('Search failed. Please check your connection and try again.')
      setRecipes([])
    } finally {
      setSearching(false)
    }
  }

  const handleCategoryClick = async (category) => {
    setSearchMode('keyword')
    setQuery(category)
    await runSearch(category, 'keyword')
  }

  const viewRecipe = (recipe) => navigate(`/recipe/${recipe.id}`, { state: { recipe } })

  return (
    <main className="app-screen">
      <section className="phone-shell overflow-hidden bg-[linear-gradient(180deg,#dff0ff_0%,#f6f5ff_34%,#fffdfa_100%)]">
        <div className="relative px-4 pb-28 pt-4">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="cloud cloud-one"></div>
            <div className="cloud cloud-two"></div>
            <div className="cloud cloud-three"></div>
          </div>

          <div className="relative z-10">
            <div className="mb-5 flex items-center justify-between">
              <button
                type="button"
                className="icon-bubble border border-white/80 bg-white/90 text-xl"
                onClick={() => navigate('/menu')}
                aria-label="Open menu"
              >
                ☰
              </button>
              <div className="rounded-full border border-white/70 bg-white/90 px-3 py-2 shadow-[0_12px_24px_rgba(148,163,184,0.16)]">
                <span className="text-3xl">👩‍🍳</span>
              </div>
            </div>

            <header className="mb-5 space-y-1">
              <h1 className="text-3xl font-black text-slate-800">Hi, Foodie! 👋</h1>
              <p className="text-lg text-slate-700">What do you want to cook today?</p>
            </header>

            <section className="soft-card space-y-4 border border-pink-100 bg-white/92 p-3">
              <div className="grid grid-cols-2 gap-2 rounded-[26px] bg-pink-50 p-2">
                {['keyword', 'ingredient'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setSearchMode(mode)}
                    className={`rounded-[20px] px-4 py-3 text-sm font-extrabold transition ${
                      searchMode === mode
                        ? 'bg-white text-pink-500 shadow-[0_12px_24px_rgba(251,113,133,0.15)]'
                        : 'text-violet-500'
                    }`}
                  >
                    {mode === 'keyword' ? 'Search by Keyword' : 'Search by Ingredient'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={
                    searchMode === 'keyword'
                      ? 'e.g. pasta, chicken, dessert...'
                      : 'e.g. egg, rice, tomato...'
                  }
                  className="input-field flex-1"
                />
                <button type="button" onClick={() => runSearch()} className="search-button" disabled={searching}>
                  {searching ? '...' : '🔎'}
                </button>
              </div>
            </section>

            <section className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-800">
                  {hasSearched ? 'Search Results' : 'Popular Recipes'}
                </h2>
                <button type="button" className="text-sm font-bold text-violet-500" onClick={() => setRecipes(popularRecipes)}>
                  View All
                </button>
              </div>

              {error ? <ErrorMessage message={error} /> : null}
              {loading ? <Loading label="Loading sweet recipe picks..." /> : null}
              {!loading && searching ? <Loading label="Searching the recipe cloud..." /> : null}
              {!loading && !searching && !error && recipes.length === 0 ? (
                <EmptyState
                  emoji="🍲"
                  title="No recipe found"
                  message="Try a different keyword or ingredient for more delicious matches."
                />
              ) : null}

              {!loading && !searching && recipes.length > 0 ? (
                <div className="scrollbar-hidden -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
                  {recipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onView={() => viewRecipe(recipe)}
                      onToggleFavorite={() => toggleFavorite(recipe)}
                      isFavorite={isFavorite(recipe.id)}
                    />
                  ))}
                </div>
              ) : null}
            </section>

            <section className="mt-6">
              <h2 className="mb-3 text-xl font-black text-slate-800">Categories</h2>
              <div className="grid grid-cols-5 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.label}
                    type="button"
                    className="soft-card flex min-h-24 flex-col items-center justify-center gap-2 border border-orange-100 bg-white/95 p-2 text-center"
                    onClick={() => handleCategoryClick(category.label)}
                  >
                    <span className="text-3xl">{category.emoji}</span>
                    <span className="text-xs font-bold text-slate-700">{category.label}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <BottomNav />
        </div>
      </section>
    </main>
  )
}

export default Home
