import './App.scss';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/index";
import ErrorPage from './pages/ErrorPage/ErrorPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import Calendar from "./components/Calendar/calendar";

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta principal - ErrorPage (temporalmente) */}
          <Route path="/" element={<ErrorPage />} />

          {/* Ruta de login */}
          <Route path="/login" element={<Login />} />

          {/* Ruta protegida: Calendario */}
          <Route 
            path="/calendar" 
            element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            } 
          />

          {/* Ruta de error para rutas no existentes */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
