import React from 'react';
import "./Header.scss";
import SearchForm from "./SearchForm";

const Header = () => {
  return (
    <header className='header'>
      <div className='header-content flex align-center justify-center flex-column text-center'>
        <SearchForm />
        <h1 className='text-white header-title ls-2'>¿Cuáles son tus Recetas favoritas?</h1>
        <p className='text-uppercase text-white my-3 ls-1'>Personaliza tu experiencia</p>
      </div>
    </header>
  )
}

export default Header