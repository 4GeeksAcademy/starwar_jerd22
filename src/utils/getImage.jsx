export const getImage = (name) => {
    // Convertir el nombre a minúsculas y reemplazar los espacios por guiones
    let formattedName = name.toLowerCase().replace(/\s+/g, "-");
    formattedName = formattedName.replace(/\//g, "-");
     console.log(formattedName); //------> lo utilizo para debugar las imganes y poner bien el nombre para cumplir con la constante
    

    // Intentamos importar la imagen de manera estática desde la carpeta de imágenes
    try {
        const imagePath = `/images/${formattedName}.jpeg`;
        return imagePath; 
    } catch (error) {
        // Si no encontramos la imagen, devolvemos la imagen por defecto
        return "https://purodiseno.lat/wp-content/uploads/2022/05/STAR-WARS-828x621.jpg";
    }
};