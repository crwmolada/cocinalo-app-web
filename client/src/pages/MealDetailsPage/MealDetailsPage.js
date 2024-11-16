import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./MealDetailsPage.scss";
import CategoryList from '../../components/Category/CategoryList';
import MealSingle from "../../components/Meal/MealSingle";
import { useMealContext } from '../../context/mealContext';
import { fetchSingleMeal } from '../../actions/mealAction';
import Loader from '../../components/Loader/Loader';

const MealDetailsPage = () => {
  const { id } = useParams();
  const { categories, dispatch, meal, categoryLoading, mealLoading } = useMealContext();

  useEffect(() => {
    fetchSingleMeal(id)(dispatch);
  }, [dispatch, id]);

  if (mealLoading) {
    return <Loader />;
  }

  if (!meal) {
    return <div>No se encontraron detalles de la receta.</div>;
  }

  // Preparar los datos para MealSingle
  const singleMeal = {
    id: meal.id_receta,
    nombre_receta: meal.nombre_receta,
    nombre_categoria: meal.nombre_categoria,
    imagen_url: meal.imagen_url,
    dificultad: meal.dificultad,
    ingredientes: meal.ingredientes,
    instrucciones: meal.instrucciones
  };

  return (
    <main className='main-content bg-whitesmoke'>
      <MealSingle meal={singleMeal} />
      {categoryLoading ? <Loader /> : <CategoryList categories={categories} />}
    </main>
  );
}

export default MealDetailsPage;
