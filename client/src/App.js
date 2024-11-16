import './App.scss';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { SidebarProvider } from './context/sidebarContext';
import { MealProvider } from './context/mealContext';
import AppRoutes from './routes/AppRoutes';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <MealProvider>
                    <SidebarProvider>
                        <AppRoutes />
                    </SidebarProvider>
                </MealProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;