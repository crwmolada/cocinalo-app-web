import React from 'react'
import { Link } from 'react-router-dom'
import './ErrorPage.scss'

const ErrorPage = () => {
  return (
    <div className='error-page'>
      <h1>404</h1>
      <p>Página no encontrada</p>
      <Link to="/login">Regresar a ver más recetas</Link>


    </div>
  )
}

export default ErrorPage
