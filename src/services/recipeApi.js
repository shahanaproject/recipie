const API_KEY = import.meta.env.VITE_THEMEALDB_API_KEY || '1'
const API_BASE_URL = `https://www.themealdb.com/api/json/v1/${API_KEY}`
const POPULAR_SEARCHES = ['pasta', 'cake', 'chicken']

export const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400/fce7f3/7c3aed?text=Recipes+Only'

async function fetchMealDb(endpoint) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`)

  if (!response.ok) {
    throw new Error('MealDB request failed')
  }

  const data = await response.json()

  return data.meals || []
}

function getDescription(meal) {
  const descriptionParts = [
    meal.strCategory ? `${meal.strCategory} comfort food` : '',
    meal.strArea ? `with a ${meal.strArea} touch` : '',
  ].filter(Boolean)

  return descriptionParts.length > 0
    ? `${descriptionParts.join(' ')} made for cheerful home cooking.`
    : 'A cozy recipe idea made for delightful home cooking.'
}

function getIngredients(meal) {
  return Array.from({ length: 20 }, (_, index) => {
    const ingredient = meal[`strIngredient${index + 1}`]?.trim()
    const measure = meal[`strMeasure${index + 1}`]?.trim()

    if (!ingredient) {
      return null
    }

    return measure ? `${measure} ${ingredient}`.trim() : ingredient
  }).filter(Boolean)
}

export function mapMealDbRecipe(meal) {
  return {
    id: `api-${meal.idMeal}`,
    mealId: meal.idMeal,
    source: 'api',
    title: meal.strMeal,
    image: meal.strMealThumb || PLACEHOLDER_IMAGE,
    description: getDescription(meal),
    ingredients: getIngredients(meal),
    instructions: meal.strInstructions || 'Instructions are not available for this recipe yet.',
    prepTime: '30 mins',
    servings: 2,
    status: 'api',
    category: meal.strCategory || 'Featured',
    area: meal.strArea || '',
  }
}

function mapIngredientSearchResult(meal, ingredient) {
  return {
    id: `api-${meal.idMeal}`,
    mealId: meal.idMeal,
    source: 'api',
    title: meal.strMeal,
    image: meal.strMealThumb || PLACEHOLDER_IMAGE,
    description: `A tasty idea featuring ${ingredient}.`,
    ingredients: ingredient ? [ingredient] : [],
    instructions: '',
    prepTime: '30 mins',
    servings: 2,
    status: 'api',
    category: 'Ingredient Match',
    area: '',
    isPartial: true,
  }
}

function dedupeRecipes(recipes) {
  const seenRecipeIds = new Set()

  return recipes.filter((recipe) => {
    if (seenRecipeIds.has(recipe.id)) {
      return false
    }

    seenRecipeIds.add(recipe.id)
    return true
  })
}

export async function searchRecipesByKeyword(query) {
  if (!query.trim()) {
    return []
  }

  const meals = await fetchMealDb(`search.php?s=${encodeURIComponent(query)}`)
  return meals.map(mapMealDbRecipe)
}

export async function searchRecipesByIngredient(ingredient) {
  if (!ingredient.trim()) {
    return []
  }

  const meals = await fetchMealDb(`filter.php?i=${encodeURIComponent(ingredient)}`)
  return meals.map((meal) => mapIngredientSearchResult(meal, ingredient))
}

export async function lookupRecipeById(id) {
  const mealId = id.replace('api-', '')
  const meals = await fetchMealDb(`lookup.php?i=${encodeURIComponent(mealId)}`)
  const meal = meals[0]

  return meal ? mapMealDbRecipe(meal) : null
}

export async function fetchPopularRecipes() {
  const results = await Promise.all(POPULAR_SEARCHES.map((query) => searchRecipesByKeyword(query)))

  return dedupeRecipes(
    results
      .map((recipes) => recipes[0])
      .filter(Boolean)
      .slice(0, 6),
  )
}

export async function fetchSimilarityCandidates({ title, ingredients }) {
  const firstIngredient = ingredients[0] || ''
  const titleSearch = title.trim() ? searchRecipesByKeyword(title) : Promise.resolve([])
  const ingredientSearch = firstIngredient
    ? searchRecipesByIngredient(firstIngredient)
    : Promise.resolve([])

  const [titleResult, ingredientResult] = await Promise.allSettled([titleSearch, ingredientSearch])

  const titleMatches = titleResult.status === 'fulfilled' ? titleResult.value : []
  const ingredientMatches = ingredientResult.status === 'fulfilled' ? ingredientResult.value : []

  const partialMatches = ingredientMatches.filter((recipe) => recipe.isPartial).slice(0, 4)
  const enrichedMatches = await Promise.allSettled(partialMatches.map((recipe) => lookupRecipeById(recipe.id)))

  const enrichedRecipes = enrichedMatches
    .filter((result) => result.status === 'fulfilled' && result.value)
    .map((result) => result.value)

  return dedupeRecipes([...titleMatches, ...enrichedRecipes, ...ingredientMatches])
}
