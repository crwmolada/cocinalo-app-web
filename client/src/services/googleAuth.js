import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import api from '../utils/axios.js';

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        
        // enviamos datos al backend
        const response = await api.post('/auth/google-login', {
            email: result.user.email,
            nombre: result.user.displayName.split(' ')[0],
            apellido: result.user.displayName.split(' ').slice(1).join(' '),
            googleId: result.user.uid
        });

        return response.data; 
    } catch (error) {
        throw error;
    }
};