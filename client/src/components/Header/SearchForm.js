import React, { useState } from 'react';
import { recipesApi } from '../../utils/api/recepies';
import "./Header.scss";
import { BsSearch } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import Alert from '../Alert/Alert';
import { CSSTransition } from 'react-transition-group';

const SearchForm = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setShowAlert(false);

    try {
      const data = await recipesApi.searchRecipes(searchTerm);
      
      if (!data || data.length === 0) {
        setAlertMessage("No se encontraron recetas para tu búsqueda");
        setShowAlert(true);
        return;
      }

      navigate(`/search?query=${encodeURIComponent(searchTerm)}`, { 
        state: { searchResults: data }
      });
    } catch (error) {
      console.error('Error al buscar recetas:', error);
      setAlertMessage("Error al buscar recetas");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form className='search-form flex align-center' onSubmit={handleSearch}>
        <input
          type="text"
          className='form-control-input text-dark-gray fs-15'
          placeholder='Busca tu receta aquí ...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className='form-submit-btn text-white text-uppercase fs-14'
          disabled={isLoading}
        >
          <BsSearch className='btn-icon' size={20} />
        </button>
      </form>

      <CSSTransition
        in={showAlert}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <Alert
          message={alertMessage}
          type="error"
          onClose={() => setShowAlert(false)}
        />
      </CSSTransition>
    </>
  );
};

export default SearchForm;