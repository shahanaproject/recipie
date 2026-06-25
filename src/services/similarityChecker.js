function normalizeText(value) {
  return value
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean)
}

function buildRecipeWordSet(recipe) {
  const text = [
    recipe.title || '',
    Array.isArray(recipe.ingredients) ? recipe.ingredients.join(' ') : recipe.ingredients || '',
    recipe.instructions || '',
  ].join(' ')

  return new Set(normalizeText(text))
}

export function getJaccardSimilarity(recipeA, recipeB) {
  const wordsA = buildRecipeWordSet(recipeA)
  const wordsB = buildRecipeWordSet(recipeB)
  const union = new Set([...wordsA, ...wordsB])

  if (union.size === 0) {
    return 0
  }

  let intersectionSize = 0

  wordsA.forEach((word) => {
    if (wordsB.has(word)) {
      intersectionSize += 1
    }
  })

  return Math.round((intersectionSize / union.size) * 100)
}

export function getSimilarityResult(candidateRecipe, recipes) {
  let bestMatch = null
  let highestScore = 0

  recipes.forEach((recipe) => {
    const score = getJaccardSimilarity(candidateRecipe, recipe)

    if (score > highestScore) {
      highestScore = score
      bestMatch = recipe
    }
  })

  return {
    similarityScore: highestScore,
    status: highestScore >= 80 ? 'rejected' : 'approved',
    matchedRecipe: bestMatch
      ? {
          id: bestMatch.id,
          title: bestMatch.title,
        }
      : null,
  }
}
