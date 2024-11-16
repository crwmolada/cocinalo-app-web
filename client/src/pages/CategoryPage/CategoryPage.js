import React, { useEffect } from 'react';
import "./CategoryPage.scss";
import { useMealContext } from '../../context/mealContext';
import MealList from '../../components/Meal/MealList';
import { useParams } from 'react-router-dom';
import { fetchMealsByCategory } from '../../actions/mealAction';

const CategoryPage = () => {
  const { name } = useParams();
  const { 
    categoryMeals, 
    categories, 
    categoryMealsLoading, 
    categoryMealsError,
    dispatch 
  } = useMealContext();

  // Descripción de la categoría
  let catDescription = "";
  if (categories) {
    const category = categories.find(cat => cat.nombre_categoria === name);
    catDescription = category ? category.descripcion : "";
  }

  useEffect(() => {
    if (name) {
      fetchMealsByCategory(name)(dispatch);
    }
  }, [name, dispatch]);

  // Manejar estados de carga y error
  if (categoryMealsLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Cargando...</div>
      </div>
    );
  }

  if (categoryMealsError) {
    return (
      <div className="error-container">
        <p className="error-message">Error: {categoryMealsError}</p>
      </div>
    );
  }

  return (
    <main className='main-content py-5'>
      <div className='container'>
        <div className='cat-description px-4 py-4'>
          <h2 className='text-orange fw-8'>{name}</h2>
          <p className='fs-18 op-07'>{catDescription}</p>
        </div>
        
        {/* Verificar si hay recetas para mostrar */}
        {Array.isArray(categoryMeals) && categoryMeals.length > 0 ? (
          <MealList meals={categoryMeals} />
        ) : (
          <div className="no-meals-message">
            <p>No se encontraron recetas en esta categoría.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default CategoryPage;