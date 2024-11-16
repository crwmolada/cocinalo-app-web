import React, { useState } from 'react';
import { recipesApi } from '../../utils/api/recepies';
import "./Header.scss";
import { BsSearch } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import Alert from '../Alert/Alert';

const SearchForm = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setShowAlert(false);

    try {
      const data = await recipesApi.searchRecipes(searchTerm);
      
      // Se navega a la página de resultados incluso si no hay resultados :v
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`, { 
        state: { searchResults: data || [] }
      });
    } catch (error) {
      console.error('Error al buscar recetas:', error);
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

      {showAlert && (
        <Alert
          message="Error al buscar recetas. Por favor, intenta de nuevo."
          onClose={() => setShowAlert(false)}
        />
      )}
    </>
  );
};

export default SearchForm;