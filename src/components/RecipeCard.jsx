const statusClasses = {
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-600',
  api: 'bg-sky-100 text-sky-700',
}

function formatDate(value) {
  if (!value) {
    return 'Fresh pick'
  }

  return new Date(value).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function RecipeCard({
  recipe,
  variant = 'grid',
  onView,
  onEdit,
  onDelete,
  onToggleFavorite,
  isFavorite = false,
  favoriteMode = false,
  showActions = false,
  showStatus = false,
}) {
  const badgeClass = statusClasses[recipe.status] || 'bg-violet-100 text-violet-700'

  if (variant === 'list') {
    return (
      <article className="soft-card flex items-center gap-3 p-3">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="h-20 w-20 rounded-[22px] object-cover shadow-[0_10px_22px_rgba(250,168,212,0.25)]"
        />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-start justify-between gap-3">
            <div>
              <h3 className="line-clamp-1 text-base font-extrabold text-slate-800">{recipe.title}</h3>
              <p className="text-xs text-slate-500">Submitted on {formatDate(recipe.submittedAt)}</p>
            </div>
            {showStatus ? (
              <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.15em] ${badgeClass}`}>
                {recipe.status}
              </span>
            ) : null}
          </div>
          <p className="line-clamp-2 text-sm text-slate-600">{recipe.description}</p>
          {showActions || favoriteMode ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className="mini-action-button bg-violet-100 text-violet-700" onClick={onView}>
                View
              </button>
              {showActions ? (
                <button type="button" className="mini-action-button bg-sky-100 text-sky-700" onClick={onEdit}>
                  Edit
                </button>
              ) : null}
              {showActions ? (
                <button type="button" className="mini-action-button bg-rose-100 text-rose-600" onClick={onDelete}>
                  Delete
                </button>
              ) : null}
              {favoriteMode ? (
                <button
                  type="button"
                  className="mini-action-button bg-pink-100 text-pink-600"
                  onClick={onToggleFavorite}
                >
                  Remove
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </article>
    )
  }

  return (
    <article className="soft-card min-w-[170px] max-w-[190px] overflow-hidden p-3">
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="h-28 w-full rounded-[22px] object-cover shadow-[0_14px_26px_rgba(250,168,212,0.28)]"
        />
        <button
          type="button"
          onClick={onToggleFavorite}
          className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full text-sm shadow-md transition ${
            isFavorite ? 'bg-pink-500 text-white' : 'bg-white/90 text-pink-500'
          }`}
          aria-label={`${isFavorite ? 'Remove' : 'Add'} ${recipe.title} favorite`}
        >
          💗
        </button>
      </div>
      <div className="pt-3">
        <h3 className="line-clamp-2 text-base font-extrabold text-slate-800">{recipe.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
          {recipe.description || `${recipe.category || 'Tasty'} favorite for cozy cooking.`}
        </p>
        <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>{recipe.prepTime || '30 mins'}</span>
          <button type="button" onClick={onView} className="text-pink-500">
            View
          </button>
        </div>
      </div>
    </article>
  )
}

export default RecipeCard
