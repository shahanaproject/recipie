# Recipes Only

A cute mobile-first recipe web app built as a frontend project using React and Vite.

This project was designed as a colorful pastel cooking app with a soft kawaii/cartoon look. It focuses on a phone-style experience where users can search real recipes from TheMealDB, add their own recipes, check similarity before saving, manage personal recipes with full CRUD, and save favorite meals locally on their device.

## About

Recipes Only is a fully frontend recipe management web app with no backend required.

The app mixes two kinds of data:

- real recipe search results from TheMealDB API
- user-created recipes stored locally in the browser with localStorage

The goal of the project is to provide a playful, beginner-friendly cooking app experience while also demonstrating practical frontend features such as routing, API integration, reusable components, custom hooks, validation, loading states, error handling, local persistence, and responsive UI design.

## Features

- Splash screen with mobile-style intro flow and animated loading progress
- Home search screen with:
  - search by keyword
  - search by ingredient
  - popular recipes from TheMealDB
  - category shortcuts
- Add Recipe page with:
  - form validation
  - image upload or camera capture on supported mobile browsers
  - local recipe submission
  - similarity checking before save
- Similarity Result page showing whether the recipe is approved or rejected
- My Recipes page with full CRUD:
  - create
  - read
  - update
  - delete
- Favorites system saved locally on the device
- Recipe Details page for both API recipes and local recipes
- Profile page with local image upload, name, and email storage
- Menu page for quick navigation
- Empty states, loading states, and error states
- Responsive phone-like layout optimized for mobile web use

## Full CRUD Support

User-created recipes are stored in browser localStorage, and the app supports:

- Create:
  Add a new recipe from the Add Recipe form
- Read:
  View saved recipes in My Recipes and open them in Recipe Details
- Update:
  Edit an existing saved recipe from the Edit Recipe screen
- Delete:
  Remove a saved recipe using the in-app delete confirmation sheet

These actions persist locally and remain available after navigation or refresh on the same device/browser.

## Similarity Checker

The app includes a rule-based similarity checker built in src/services/similarityChecker.js.

It compares:

- recipe title
- ingredients
- instructions

It uses normalized text and Jaccard similarity:

- lowercase conversion
- punctuation removal
- word splitting
- intersection / union * 100

If similarity is:

- >= 80% → recipe is rejected
- < 80% → recipe is approved

## API

This project uses [TheMealDB](https://www.themealdb.com/) for real recipe data.

Endpoints used:

- search.php?s= for keyword search
- filter.php?i= for ingredient search
- lookup.php?i= for recipe details

By default, the app uses the free/public TheMealDB key:

env
VITE_THEMEALDB_API_KEY=1


You can place this in a .env file in the project root if you want to make the key explicit.

## Built With

- React
- Vite
- Tailwind CSS
- React Router
- JavaScript
- Fetch API
- Browser localStorage

## Project Structure

text
src/
  assets/
    images/
  components/
    BottomNav.jsx
    EmptyState.jsx
    ErrorMessage.jsx
    Loading.jsx
    RecipeCard.jsx
  hooks/
    useFavorites.js
    useRecipes.js
  pages/
    AddRecipe.jsx
    EditRecipe.jsx
    Favorites.jsx
    Home.jsx
    Menu.jsx
    MyRecipes.jsx
    Profile.jsx
    RecipeDetails.jsx
    SimilarityResult.jsx
    Splash.jsx
  services/
    imageUtils.js
    recipeApi.js
    similarityChecker.js
  App.jsx
  index.css
  main.jsx


## Routes

- / → Splash
- /home → Home
- /menu → Menu
- /add → Add Recipe
- /my-recipes → My Recipes
- /favorites → Favorites
- /profile → Profile
- /edit/:id → Edit Recipe
- /recipe/:id → Recipe Details
- /similarity-result → Similarity Result

## Main Screens

- Splash Screen
- Home Search
- Add Recipe
- My Recipes
- Edit Recipe
- Recipe Details
- Similarity Result
- Favorites
- Profile
- Menu

## Local Use

Install dependencies:

bash
npm install


If needed, also ensure these packages are installed:

bash
npm install react-router-dom tailwindcss @tailwindcss/vite


Start the development server:

bash
npm run dev


Open the Vite local URL shown in the terminal, usually:

text
http://localhost:5173/


## Build

To create a production build:

bash
npm run build


To preview the production build locally:

bash
npm run preview


## Notes

- This project does not require a backend
- Recipes created by the user are saved only in the local browser
- Uploaded recipe images and profile images are also stored locally in the browser
- Favorites are saved locally on the same device/browser
- API recipes come from TheMealDB, while user recipes come from localStorage

## Purpose

This app was created as a frontend practice project with an emphasis on:

- clean component structure
- responsive design
- practical React features
- user-friendly mobile UI
- local data persistence without a server

It is intended as a personal/student-style web application rather than a production commercial platform.
