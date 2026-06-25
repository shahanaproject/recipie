import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
import useFavorites from '../hooks/useFavorites'
import useRecipes from '../hooks/useRecipes'
import { lookupRecipeById } from '../services/recipeApi'

function RecipeDetails() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { getRecipeById, loading: localLoading } = useRecipes()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [recipe, setRecipe] = useState(location.state?.recipe || null)
  const [loading, setLoading] = useState(id.startsWith('api-'))
  const [error, setError] = useState('')

  useEffect(() => {
    const loadRecipe = async () => {
      if (location.state?.recipe && !location.state.recipe.isPartial) {
        setRecipe(location.state.recipe)
        setLoading(false)
        return
      }

      const localRecipe = getRecipeById(id)

      if (localRecipe) {
        setRecipe(localRecipe)
        setLoading(false)
        return
      }

      if (!id.startsWith('api-')) {
        setError('We could not find this recipe.')
        setLoading(false)
        return
      }

      try {
        const apiRecipe = await lookupRecipeById(id)

        if (!apiRecipe) {
          setError('This API recipe is unavailable right now.')
          return
        }

        setRecipe(apiRecipe)
      } catch {
        setError('We could not load recipe details right now.')
      } finally {
        setLoading(false)
      }
    }

    if (!localLoading) {
      loadRecipe()
    }
  }, [getRecipeById, id, localLoading, location.state?.recipe])

  if (loading || localLoading) {
    return (
      <main className="app-screen">
        <Loading label="Plating up recipe details..." />
      </main>
    )
  }

  if (error) {
    return (
      <main className="app-screen">
        <section className="phone-shell flex flex-col justify-center gap-4 bg-[linear-gradient(180deg,#fff0f3_0%,#f7fbff_100%)] px-5 py-10">
          <ErrorMessage message={error} />
          <button type="button" className="primary-button" onClick={() => navigate('/home')}>
            Back to Home
          </button>
        </section>
      </main>
    )
  }

  if (!recipe) {
    return (
      <main className="app-screen">
        <section className="phone-shell flex flex-col justify-center gap-5 bg-[linear-gradient(180deg,#fff0f3_0%,#f7fbff_100%)] px-5 py-10">
          <EmptyState title="Recipe missing" message="This recipe could not be loaded." emoji="🥞" />
          <button type="button" className="primary-button" onClick={() => navigate('/home')}>
            Back to Home
          </button>
        </section>
      </main>
    )
  }

  const favoriteActive = isFavorite(recipe.id)

  return (
    <main className="app-screen">
      <section className="phone-shell overflow-hidden bg-[linear-gradient(180deg,#fff1f4_0%,#ffffff_44%,#fffaf0_100%)]">
        <div className="relative">
          <div className="absolute left-4 top-4 z-20">
            <button type="button" className="icon-bubble bg-white/90" onClick={() => navigate(-1)}>
              ←
            </button>
          </div>
          <div className="absolute right-4 top-4 z-20">
            <button
              type="button"
              className={`icon-bubble text-xl transition ${
                favoriteActive ? 'bg-pink-500 text-white' : 'bg-white/90 text-pink-500'
              }`}
              onClick={() => toggleFavorite(recipe)}
            >
              💗
            </button>
          </div>

          <div className="relative h-72 w-full overflow-hidden bg-[linear-gradient(180deg,#ffe6f1_0%,#fff3cf_100%)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff_0%,transparent_58%)] opacity-70"></div>
            <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,#ffd1df55)]"></div>
            <img src={recipe.image} alt={recipe.title} className="h-full w-full object-cover" />
          </div>

          <div className="-mt-6 rounded-t-[36px] bg-white px-5 pb-8 pt-6 shadow-[0_-12px_30px_rgba(250,168,212,0.15)]">
            <h1 className="text-[2.35rem] font-black leading-none text-slate-800">{recipe.title}</h1>
            <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-slate-500">
              <span className="meta-pill">⏱️ {recipe.prepTime || '30 mins'}</span>
              <span className="meta-pill">🍽️ {recipe.servings || 2} servings</span>
              <span className="meta-pill">⭐ 4.8 (120)</span>
            </div>

            <section className="mt-5">
              <h2 className="section-title">Description</h2>
              <p className="text-sm leading-7 text-slate-600">{recipe.description}</p>
            </section>

            <section className="mt-5">
              <h2 className="section-title">Ingredients</h2>
              <ul className="space-y-2 text-sm leading-6 text-slate-700">
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient} className="flex gap-2">
                    <span className="mt-1 text-pink-500">•</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-5">
              <h2 className="section-title">Instructions</h2>
              <div className="space-y-3 text-sm leading-7 text-slate-600">
                {recipe.instructions
                  .split(/\n+/)
                  .filter(Boolean)
                  .map((step, index) => (
                    <p key={`${recipe.id}-step-${index}`}>{step}</p>
                  ))}
              </div>
            </section>

            <div className="mt-8 grid grid-cols-[1fr_auto] gap-3">
              <button type="button" className="primary-button" onClick={() => navigate('/add')}>
                Try this Recipe
              </button>
              <button
                type="button"
                className={`favorite-cta ${favoriteActive ? 'favorite-cta-active' : 'favorite-cta-idle'}`}
                onClick={() => toggleFavorite(recipe)}
              >
                {favoriteActive ? 'Saved' : 'Add to Fav'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default RecipeDetails
