import React from 'react';
import "./Meal.scss";
import { Link } from 'react-router-dom';

const MealList = ({ meals }) => {
  return (
    <div className='section-wrapper'>
      <div className='container'>
        <div className='sc-title'>Recetas</div>
        <section className='sc-meal grid'>
          {
            meals?.map(mealItem => {
              const { 
                id_receta: id, 
                nombre_receta: nombre, 
                descripcion, 
                imagen_url: thumbnail, 
                tiempo_preparacion, 
                dificultad 
              } = mealItem;

              return (
                <Link to={`/meal/${id}`} className="meal-itm align-center justify-center" key={id}>
                  <div className='meal-itm-img'>
                    <img src={thumbnail} alt={nombre} />
                    <div className='meal-itm-cat bg-orange text-orange fw-6'>{dificultad}</div>
                  </div>

                  <div className='meal-itm-body'>
                    <div className='meal-itm-body-info flex flex-column'>
                      <div className='area fs-14 ls-1 fw-5'>{tiempo_preparacion} mins</div>
                      <div className='meal fw-15 fw-7 op-09'>{nombre}</div>
                      <div className='description'>{descripcion}</div>
                    </div>
                  </div>
                </Link>
              )
            })
          }
        </section>
      </div>
    </div>
  )
}

export default MealList;
