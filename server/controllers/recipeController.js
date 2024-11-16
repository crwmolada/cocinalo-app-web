const db = require('../config/db'); 

// Obtener todas las categorías
const getCategories = async (req, res) => {
    console.log('Iniciando obtención de categorías...');
    let connection;
    try {
        connection = await db.getConnection(); 
        console.log('Conexión obtenida');

        const [rows] = await connection.query(
            'SELECT id_categoria, nombre_categoria, imagen_url, descripcion FROM categorias'
        );
        console.log('Categorías encontradas:', rows);

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ 
            message: 'Error al obtener categorías',
            error: error.message 
        });
    } finally {
        if (connection) {
            connection.release();
            console.log('Conexión liberada');
        }
    }
};

// Buscar recetas por nombre
const searchRecipes = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        const [results] = await connection.query(
            'SELECT id_receta, nombre_receta, descripcion, ingredientes, instrucciones, imagen_url, tiempo_preparacion, dificultad, id_categoria FROM recetas WHERE nombre_receta LIKE ?',
            [`%${req.query.name}%`]
        );
        res.json(results);
    } catch (error) {
        console.error('Error al buscar recetas:', error);
        res.status(500).json({ 
            message: 'Error al buscar recetas',
            error: error.message 
        });
    } finally {
        if (connection) connection.release();
    }
};

// Obtener receta por ID
const getRecipeById = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        const [results] = await connection.query(`
            SELECT r.*, c.nombre_categoria 
            FROM recetas r
            JOIN categorias c ON r.id_categoria = c.id_categoria 
            WHERE r.id_receta = ?
        `, [req.params.id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Receta no encontrada' });
        }
        res.json(results[0]);
    } catch (error) {
        console.error('Error al obtener receta:', error);
        res.status(500).json({ 
            message: 'Error al obtener la receta',
            error: error.message 
        });
    } finally {
        if (connection) connection.release();
    }
};

// Buscar recetas por categoría
const searchRecipesByCategory = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        const [recipes] = await connection.query(`
            SELECT 
                r.*,
                c.descripcion AS categoria_descripcion,
                c.nombre_categoria
            FROM recetas r
            JOIN categorias c ON r.id_categoria = c.id_categoria
            WHERE c.nombre_categoria = ?
        `, [req.params.category]);
        
        res.json(recipes);
    } catch (error) {
        console.error('Error al buscar recetas por categoría:', error);
        res.status(500).json({ 
            message: 'Error al buscar recetas por categoría',
            error: error.message 
        });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    searchRecipes,
    getCategories,
    getRecipeById,
    searchRecipesByCategory
};