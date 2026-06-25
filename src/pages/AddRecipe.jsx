import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
import useRecipes from '../hooks/useRecipes'
import { readImageAsDataUrl, validateImageFile } from '../services/imageUtils'
import { fetchSimilarityCandidates, PLACEHOLDER_IMAGE } from '../services/recipeApi'
import { getSimilarityResult } from '../services/similarityChecker'

const initialForm = {
  title: '',
  description: '',
  ingredients: '',
  instructions: '',
  prepTime: '',
  servings: '',
  image: '',
}

const SIMILARITY_RESULT_KEY = 'recipes-only-last-similarity-result'

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

  if (!form.servings.trim()) {
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

function AddRecipe() {
  const navigate = useNavigate()
  const { addRecipe, error, loading, recipes } = useRecipes()
  const fileInputRef = useRef(null)
  const [form, setForm] = useState(initialForm)
  const [formErrors, setFormErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const descriptionCount = useMemo(() => form.description.trim().length, [form.description])
  const instructionCount = useMemo(() => form.instructions.trim().length, [form.instructions])

  const updateField = (field) => (event) => {
    const { value } = event.target
    setForm((currentForm) => ({ ...currentForm, [field]: value }))
    setFormErrors((currentErrors) => ({ ...currentErrors, [field]: '' }))
  }

  const handleReset = () => {
    setForm(initialForm)
    setFormErrors({})
    setSubmitError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    const imageError = validateImageFile(file)

    if (imageError) {
      setFormErrors((currentErrors) => ({ ...currentErrors, image: imageError }))
      return
    }

    if (!file) {
      setForm((currentForm) => ({ ...currentForm, image: '' }))
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

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = buildErrors(form)

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors)
      return
    }

    setSubmitting(true)
    setSubmitError('')

    try {
      const ingredients = parseIngredients(form.ingredients)
      const apiCandidates = await fetchSimilarityCandidates({
        title: form.title,
        ingredients,
      })

      const similarityResult = getSimilarityResult(
        {
          title: form.title,
          ingredients,
          instructions: form.instructions,
        },
        [...recipes, ...apiCandidates],
      )

      const recipe = {
        id: `local-${crypto.randomUUID?.() || Date.now()}`,
        source: 'local',
        title: form.title.trim(),
        description: form.description.trim(),
        ingredients,
        instructions: form.instructions.trim(),
        prepTime: form.prepTime.trim(),
        servings: Number(form.servings),
        image: form.image.trim() || PLACEHOLDER_IMAGE,
        submittedAt: new Date().toISOString(),
        status: similarityResult.status,
        similarityScore: similarityResult.similarityScore,
        matchedRecipeTitle: similarityResult.matchedRecipe?.title || '',
      }

      addRecipe(recipe)

      const resultPayload = {
        recipeId: recipe.id,
        recipeTitle: recipe.title,
        similarityScore: similarityResult.similarityScore,
        status: similarityResult.status,
        matchedRecipeTitle: recipe.matchedRecipeTitle,
      }

      sessionStorage.setItem(SIMILARITY_RESULT_KEY, JSON.stringify(resultPayload))

      navigate('/similarity-result', {
        state: {
          result: resultPayload,
        },
      })
    } catch {
      setSubmitError('We could not check recipe similarity right now. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="app-screen">
        <Loading label="Preparing your recipe notebook..." />
      </main>
    )
  }

  return (
    <main className="app-screen">
      <section className="phone-shell overflow-hidden bg-[linear-gradient(180deg,#effadf_0%,#fff7ea_48%,#fff6fb_100%)]">
        <div className="relative px-5 pb-28 pt-5">
          <div className="pointer-events-none absolute inset-0 opacity-80">
            <div className="absolute left-0 top-44 text-2xl">🥬</div>
            <div className="absolute right-2 top-6 text-5xl">👩‍🍳</div>
            <div className="absolute right-2 top-54 text-2xl">🍓</div>
            <div className="absolute bottom-12 right-2 text-2xl">🍀</div>
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <button type="button" className="icon-bubble" onClick={() => navigate('/home')}>
              ←
            </button>
            <div className="text-center">
              <p className="text-lg font-black text-slate-800">Add New Recipe</p>
            </div>
            <div className="icon-bubble text-xl">🍳</div>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 mt-5 space-y-4">
            <section className="soft-card space-y-4 border border-lime-100 bg-white/93 p-4 shadow-[0_24px_48px_rgba(177,239,174,0.22)]">
              {error ? <ErrorMessage message={error} /> : null}
              {submitError ? <ErrorMessage message={submitError} /> : null}

              <label className="form-group">
                <span className="form-label">Recipe Title *</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={updateField('title')}
                  placeholder="e.g. Spaghetti Bolognese"
                  className="input-field"
                />
                {formErrors.title ? <span className="form-error">{formErrors.title}</span> : null}
              </label>

              <label className="form-group">
                <span className="form-label">Description *</span>
                <textarea
                  value={form.description}
                  onChange={updateField('description')}
                  placeholder="Tell us about your recipe..."
                  className="textarea-field min-h-24"
                />
                <div className="form-meta">
                  <span>{formErrors.description || ''}</span>
                  <span>{descriptionCount}/500</span>
                </div>
              </label>

              <label className="form-group">
                <span className="form-label">Ingredients *</span>
                <textarea
                  value={form.ingredients}
                  onChange={updateField('ingredients')}
                  placeholder="Enter ingredients, one per line"
                  className="textarea-field min-h-28"
                />
                {formErrors.ingredients ? <span className="form-error">{formErrors.ingredients}</span> : null}
              </label>

              <label className="form-group">
                <span className="form-label">Instructions *</span>
                <textarea
                  value={form.instructions}
                  onChange={updateField('instructions')}
                  placeholder="Step by step instructions..."
                  className="textarea-field min-h-32"
                />
                <div className="form-meta">
                  <span>{formErrors.instructions || ''}</span>
                  <span>{instructionCount}/1000</span>
                </div>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="form-group">
                  <span className="form-label">Prep Time *</span>
                  <input
                    type="text"
                    value={form.prepTime}
                    onChange={updateField('prepTime')}
                    placeholder="e.g. 20 mins"
                    className="input-field"
                  />
                  {formErrors.prepTime ? <span className="form-error">{formErrors.prepTime}</span> : null}
                </label>

                <label className="form-group">
                  <span className="form-label">Servings *</span>
                  <input
                    type="text"
                    value={form.servings}
                    onChange={updateField('servings')}
                    placeholder="e.g. 2"
                    className="input-field"
                  />
                  {formErrors.servings ? <span className="form-error">{formErrors.servings}</span> : null}
                </label>
              </div>

              <div className="form-group">
                <span className="form-label">Image</span>
                <div className="grid grid-cols-[1.2fr_1fr] gap-3 max-sm:grid-cols-1">
                  <label className="upload-panel cursor-pointer">
                    {form.image ? (
                      <img src={form.image} alt="Recipe preview" className="h-full w-full rounded-[22px] object-cover" />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                        <span className="text-3xl">☁️</span>
                        <span className="text-sm font-bold text-slate-500">Upload a photo of your dish</span>
                        <span className="text-xs text-slate-400">Tap to open gallery or camera</span>
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
                  <div className="grid grid-rows-2 gap-3">
                    <button
                      type="button"
                      className="secondary-button min-h-[64px] rounded-[20px]"
                      onClick={handleReset}
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="primary-button min-h-[64px] rounded-[20px]"
                      disabled={submitting}
                    >
                      {submitting ? 'Checking...' : 'Submit Recipe'}
                    </button>
                  </div>
                </div>
                {formErrors.image ? <span className="form-error">{formErrors.image}</span> : null}
                {!form.image ? (
                  <span className="text-xs text-slate-400">Leave blank to use the pastel placeholder image.</span>
                ) : null}
              </div>
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

export default AddRecipe
