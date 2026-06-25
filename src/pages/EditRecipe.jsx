import { useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
import useRecipes from '../hooks/useRecipes'
import { readImageAsDataUrl, validateImageFile } from '../services/imageUtils'
import { PLACEHOLDER_IMAGE } from '../services/recipeApi'

function parseIngredientText(ingredients) {
  return Array.isArray(ingredients) ? ingredients.join('\n') : ''
}

function buildErrors(form) {
  const nextErrors = {}

  if (!form.title.trim()) {
    nextErrors.title = 'Recipe title is required.'
  }

  if (!form.description.trim()) {
    nextErrors.description = 'Description is required.'
  }

  if (!form.ingredients.trim()) {
    nextErrors.ingredients = 'Ingredients are required.'
  }

  if (!form.instructions.trim()) {
    nextErrors.instructions = 'Instructions are required.'
  }

  if (!form.prepTime.trim()) {
    nextErrors.prepTime = 'Prep time is required.'
  }

  if (!form.servings.toString().trim()) {
    nextErrors.servings = 'Servings is required.'
  } else if (Number.isNaN(Number(form.servings))) {
    nextErrors.servings = 'Servings must be a number.'
  }

  return nextErrors
}

function parseIngredients(value) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function EditRecipe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { error, getRecipeById, loading, updateRecipe } = useRecipes()
  const fileInputRef = useRef(null)
  const recipe = getRecipeById(id)
  const [form, setForm] = useState(() =>
    recipe
      ? {
      title: recipe.title,
      description: recipe.description,
      ingredients: parseIngredientText(recipe.ingredients),
      instructions: recipe.instructions,
      prepTime: recipe.prepTime,
      servings: recipe.servings,
      image: recipe.image,
        }
      : null,
  )
  const [formErrors, setFormErrors] = useState({})
  const [submitError, setSubmitError] = useState('')

  const descriptionCount = useMemo(() => form?.description.trim().length || 0, [form?.description])
  const instructionCount = useMemo(() => form?.instructions.trim().length || 0, [form?.instructions])

  const updateField = (field) => (event) => {
    const { value } = event.target
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
    setFormErrors((currentErrors) => ({ ...currentErrors, [field]: '' }))
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    const imageError = validateImageFile(file)

    if (imageError) {
      setFormErrors((currentErrors) => ({ ...currentErrors, image: imageError }))
      return
    }

    if (!file) {
      return
    }

    try {
      const imageDataUrl = await readImageAsDataUrl(file)
      setForm((currentForm) => ({ ...currentForm, image: imageDataUrl }))
      setFormErrors((currentErrors) => ({ ...currentErrors, image: '' }))
    } catch {
      setFormErrors((currentErrors) => ({
        ...currentErrors,
        image: 'We could not read that photo. Please try another one.',
      }))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = buildErrors(form)

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors)
      return
    }

    try {
      updateRecipe(id, {
        title: form.title.trim(),
        description: form.description.trim(),
        ingredients: parseIngredients(form.ingredients),
        instructions: form.instructions.trim(),
        prepTime: form.prepTime.trim(),
        servings: Number(form.servings),
        image: form.image.trim() || PLACEHOLDER_IMAGE,
      })

      navigate('/my-recipes')
    } catch {
      setSubmitError('We could not update your recipe. Please try again.')
    }
  }

  if (loading) {
    return (
      <main className="app-screen">
        <Loading label="Loading your saved recipe..." />
      </main>
    )
  }

  if (!recipe || !form) {
    return (
      <main className="app-screen">
        <section className="phone-shell flex flex-col justify-center gap-6 bg-[linear-gradient(180deg,#f2e8ff_0%,#fff5fa_100%)] px-5 py-10">
          <EmptyState
            emoji="🧁"
            title="Recipe not found"
            message="This saved recipe could not be found. It may have been deleted already."
          />
          <button type="button" className="primary-button" onClick={() => navigate('/my-recipes')}>
            Back to My Recipes
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="app-screen">
      <section className="phone-shell overflow-hidden bg-[linear-gradient(180deg,#f6e8ff_0%,#fff3fd_48%,#ffffff_100%)]">
        <div className="px-5 pb-28 pt-5">
          <div className="flex items-center justify-between">
            <button type="button" className="icon-bubble" onClick={() => navigate('/my-recipes')}>
              ←
            </button>
            <h1 className="text-lg font-black text-slate-800">Edit Recipe</h1>
            <div className="icon-bubble text-xl">✏️</div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <section className="soft-card space-y-4 p-4">
              {error ? <ErrorMessage message={error} /> : null}
              {submitError ? <ErrorMessage message={submitError} /> : null}

              <label className="form-group">
                <span className="form-label">Recipe Title *</span>
                <input type="text" value={form.title} onChange={updateField('title')} className="input-field" />
                {formErrors.title ? <span className="form-error">{formErrors.title}</span> : null}
              </label>

              <label className="form-group">
                <span className="form-label">Description *</span>
                <textarea value={form.description} onChange={updateField('description')} className="textarea-field min-h-24" />
                <div className="form-meta">
                  <span>{formErrors.description || ''}</span>
                  <span>{descriptionCount}/500</span>
                </div>
              </label>

              <label className="form-group">
                <span className="form-label">Ingredients *</span>
                <textarea value={form.ingredients} onChange={updateField('ingredients')} className="textarea-field min-h-28" />
                {formErrors.ingredients ? <span className="form-error">{formErrors.ingredients}</span> : null}
              </label>

              <label className="form-group">
                <span className="form-label">Instructions *</span>
                <textarea value={form.instructions} onChange={updateField('instructions')} className="textarea-field min-h-32" />
                <div className="form-meta">
                  <span>{formErrors.instructions || ''}</span>
                  <span>{instructionCount}/1000</span>
                </div>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="form-group">
                  <span className="form-label">Prep Time *</span>
                  <input type="text" value={form.prepTime} onChange={updateField('prepTime')} className="input-field" />
                  {formErrors.prepTime ? <span className="form-error">{formErrors.prepTime}</span> : null}
                </label>

                <label className="form-group">
                  <span className="form-label">Servings *</span>
                  <input type="text" value={form.servings} onChange={updateField('servings')} className="input-field" />
                  {formErrors.servings ? <span className="form-error">{formErrors.servings}</span> : null}
                </label>
              </div>

              <label className="form-group">
                <span className="form-label">Image</span>
                <label className="upload-panel cursor-pointer">
                  {form.image ? (
                    <img src={form.image} alt="Recipe preview" className="h-full w-full rounded-[22px] object-cover" />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                      <span className="text-3xl">📸</span>
                      <span className="text-sm font-bold text-slate-500">Upload or take a fresh recipe photo</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
                {formErrors.image ? <span className="form-error">{formErrors.image}</span> : null}
              </label>

              <button type="submit" className="primary-button">
                Update Recipe
              </button>
            </section>
          </form>
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <BottomNav />
        </div>
      </section>
    </main>
  )
}

export default EditRecipe
