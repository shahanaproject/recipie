import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
import RecipeCard from '../components/RecipeCard'
import useRecipes from '../hooks/useRecipes'

const tabs = ['All', 'Approved', 'Rejected']

function MyRecipes() {
  const navigate = useNavigate()
  const { deleteRecipe, error, loading, recipes } = useRecipes()
  const [activeTab, setActiveTab] = useState('All')
  const [recipeToDelete, setRecipeToDelete] = useState(null)

  const filteredRecipes = useMemo(() => {
    if (activeTab === 'All') {
      return recipes
    }

    return recipes.filter((recipe) => recipe.status === activeTab.toLowerCase())
  }, [activeTab, recipes])

  const counts = useMemo(
    () => ({
      All: recipes.length,
      Approved: recipes.filter((recipe) => recipe.status === 'approved').length,
      Rejected: recipes.filter((recipe) => recipe.status === 'rejected').length,
    }),
    [recipes],
  )

  const handleDelete = () => {
    if (!recipeToDelete) {
      return
    }

    deleteRecipe(recipeToDelete.id)
    setRecipeToDelete(null)
  }

  return (
    <main className="app-screen">
      <section className="phone-shell overflow-hidden bg-[linear-gradient(180deg,#efe0ff_0%,#fff4ff_45%,#fffdf8_100%)]">
        <div className="relative px-4 pb-28 pt-5">
          <div className="pointer-events-none absolute inset-0 opacity-80">
            <div className="absolute left-4 top-5 text-2xl">🧁</div>
            <div className="absolute right-5 top-6 text-2xl">🍴</div>
            <div className="absolute right-10 top-14 text-lg">✨</div>
          </div>

          <div className="relative z-10">
            <header className="mb-5 text-center">
              <h1 className="text-3xl font-black text-slate-800">My Recipes</h1>
              <p className="mt-1 text-sm text-slate-500">Your approved and rejected submissions live here.</p>
            </header>

            <div className="mb-4 flex flex-wrap gap-2 rounded-[24px] bg-white/45 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-sm font-extrabold ${
                    activeTab === tab
                      ? 'bg-pink-500 text-white shadow-[0_12px_24px_rgba(244,114,182,0.28)]'
                      : 'bg-white/80 text-violet-600'
                  }`}
                >
                  {tab} ({counts[tab]})
                </button>
              ))}
            </div>

            {error ? <ErrorMessage message={error} /> : null}
            {loading ? <Loading label="Checking your recipe shelf..." /> : null}

            {!loading && filteredRecipes.length === 0 ? (
              <EmptyState
                emoji="🍪"
                title="No saved recipes yet"
                message="Add your first recipe to start building your personal cookbook."
              />
            ) : null}

            {!loading && filteredRecipes.length > 0 ? (
              <div className="space-y-3">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    variant="list"
                    showActions
                    showStatus
                    onView={() => navigate(`/recipe/${recipe.id}`)}
                    onEdit={() => navigate(`/edit/${recipe.id}`)}
                    onDelete={() => setRecipeToDelete({ id: recipe.id, title: recipe.title })}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {recipeToDelete ? (
          <div className="absolute inset-0 z-30 flex items-end bg-slate-900/25 p-4">
            <div className="soft-card w-full rounded-[30px] border border-rose-100 bg-white/96 p-5">
              <p className="text-lg font-black text-slate-800">Delete recipe?</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Remove &quot;{recipeToDelete.title}&quot; from My Recipes?
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button type="button" className="secondary-button" onClick={() => setRecipeToDelete(null)}>
                  Cancel
                </button>
                <button type="button" className="primary-button bg-[linear-gradient(135deg,#fb7185,#f43f5e)] shadow-[0_16px_26px_rgba(251,113,133,0.25)]" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="absolute inset-x-0 bottom-0">
          <BottomNav />
        </div>
      </section>
    </main>
  )
}

export default MyRecipes
