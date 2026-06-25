import { useEffect, useState } from 'react'
import { PLACEHOLDER_IMAGE } from '../services/recipeApi'

const FAVORITES_STORAGE_KEY = 'recipes-only-favorites'
const FAVORITES_UPDATED_EVENT = 'recipes-only-favorites-updated'

function readFavoritesFromStorage() {
  const savedValue = localStorage.getItem(FAVORITES_STORAGE_KEY)

  if (!savedValue) {
    return []
  }

  const parsedValue = JSON.parse(savedValue)
  return Array.isArray(parsedValue) ? parsedValue : []
}

function normalizeFavoriteRecipe(recipe) {
  return {
    id: recipe.id,
    mealId: recipe.mealId || '',
    source: recipe.source || 'api',
    title: recipe.title || 'Untitled Recipe',
    image: recipe.image || PLACEHOLDER_IMAGE,
    description: recipe.description || `${recipe.category || 'Tasty'} favorite for cozy cooking.`,
    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
    instructions: recipe.instructions || '',
    prepTime: recipe.prepTime || '30 mins',
    servings: recipe.servings || 2,
    category: recipe.category || '',
    area: recipe.area || '',
    isPartial: Boolean(recipe.isPartial),
    status: recipe.status || 'api',
    savedAt: new Date().toISOString(),
  }
}

function broadcastFavoritesUpdate() {
  window.dispatchEvent(new CustomEvent(FAVORITES_UPDATED_EVENT))
}

function useFavorites() {
  const initialState = (() => {
    try {
      return {
        favorites: readFavoritesFromStorage(),
        error: '',
      }
    } catch {
      return {
        favorites: [],
        error: 'We could not read your favorites.',
      }
    }
  })()

  const [favorites, setFavorites] = useState(initialState.favorites)
  const [error] = useState(initialState.error)

  useEffect(() => {
    const syncFavorites = () => {
      try {
        setFavorites(readFavoritesFromStorage())
      } catch {
        console.error('We could not sync favorites.')
      }
    }

    window.addEventListener('storage', syncFavorites)
    window.addEventListener(FAVORITES_UPDATED_EVENT, syncFavorites)

    return () => {
      window.removeEventListener('storage', syncFavorites)
      window.removeEventListener(FAVORITES_UPDATED_EVENT, syncFavorites)
    }
  }, [])

  const saveFavorites = (nextFavorites) => {
    setFavorites(nextFavorites)
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(nextFavorites))
    broadcastFavoritesUpdate()
  }

  const isFavorite = (id) => favorites.some((recipe) => recipe.id === id)

  const addFavorite = (recipe) => {
    if (isFavorite(recipe.id)) {
      return
    }

    saveFavorites([normalizeFavoriteRecipe(recipe), ...favorites])
  }

  const removeFavorite = (id) => {
    saveFavorites(favorites.filter((recipe) => recipe.id !== id))
  }

  const toggleFavorite = (recipe) => {
    if (isFavorite(recipe.id)) {
      removeFavorite(recipe.id)
      return false
    }

    addFavorite(recipe)
    return true
  }

  return {
    favorites,
    error,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  }
}

export default useFavorites
