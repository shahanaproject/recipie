import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AddRecipe from './pages/AddRecipe'
import EditRecipe from './pages/EditRecipe'
import Favorites from './pages/Favorites'
import Home from './pages/Home'
import Menu from './pages/Menu'
import MyRecipes from './pages/MyRecipes'
import Profile from './pages/Profile'
import RecipeDetails from './pages/RecipeDetails'
import SimilarityResult from './pages/SimilarityResult'
import Splash from './pages/Splash'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/add" element={<AddRecipe />} />
        <Route path="/my-recipes" element={<MyRecipes />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit/:id" element={<EditRecipe />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
        <Route path="/similarity-result" element={<SimilarityResult />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
