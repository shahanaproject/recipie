import { useEffect, useState } from 'react'

export const RECIPES_STORAGE_KEY = 'recipes-only-user-recipes'
const RECIPES_UPDATED_EVENT = 'recipes-only-recipes-updated'

function readRecipesFromStorage() {
  const savedValue = localStorage.getItem(RECIPES_STORAGE_KEY)

  if (!savedValue) {
    return []
  }

  const parsedValue = JSON.parse(savedValue)

  return Array.isArray(parsedValue) ? parsedValue : []
}

function broadcastRecipesUpdate() {
  window.dispatchEvent(new CustomEvent(RECIPES_UPDATED_EVENT))
}

function useRecipes() {
  const initialState = (() => {
    try {
      return {
        recipes: readRecipesFromStorage(),
        error: '',
      }
    } catch {
      return {
        recipes: [],
        error: 'We could not read your saved recipes.',
      }
    }
  })()

  const [recipes, setRecipes] = useState(initialState.recipes)
  const [error] = useState(initialState.error)
  const [loading] = useState(false)

  useEffect(() => {
    const syncRecipes = () => {
      try {
        setRecipes(readRecipesFromStorage())
      } catch {
        console.error('We could not sync your recipes.')
      }
    }

    window.addEventListener('storage', syncRecipes)
    window.addEventListener(RECIPES_UPDATED_EVENT, syncRecipes)

    return () => {
      window.removeEventListener('storage', syncRecipes)
      window.removeEventListener(RECIPES_UPDATED_EVENT, syncRecipes)
    }
  }, [])

  const saveRecipes = (nextRecipes) => {
    setRecipes(nextRecipes)
    localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(nextRecipes))
    broadcastRecipesUpdate()
  }

  const addRecipe = (recipe) => {
    saveRecipes([recipe, ...recipes])
    return recipe
  }

  const updateRecipe = (id, updates) => {
    let updatedRecipe = null

    const nextRecipes = recipes.map((recipe) => {
      if (recipe.id !== id) {
        return recipe
      }

      updatedRecipe = {
        ...recipe,
        ...updates,
        updatedAt: new Date().toISOString(),
      }

      return updatedRecipe
    })

    saveRecipes(nextRecipes)

    return updatedRecipe
  }

  const deleteRecipe = (id) => {
    saveRecipes(recipes.filter((recipe) => recipe.id !== id))
  }

  const getRecipeById = (id) => recipes.find((recipe) => recipe.id === id)

  return {
    recipes,
    loading,
    error,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeById,
  }
}

export default useRecipes
