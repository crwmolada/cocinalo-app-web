import React from 'react';
import { useLocation } from 'react-router-dom';
import MealList from '../../components/Meal/MealList';
import './SearchResultsPage.scss';

const SearchResultsPage = () => {
    const location = useLocation();
    const searchResults = location.state?.searchResults || [];
    const searchQuery = new URLSearchParams(location.search).get('query');

    return (
        <div className="search-results-page">
            <div className="container">
                {searchResults.length > 0 ? (
                    <MealList meals={searchResults} />
                ) : (
                    <p className="no-results">
                        No se encontraron resultados para tu búsqueda.
                    </p>
                )}
            </div>
        </div>
    );
};

export default SearchResultsPage;