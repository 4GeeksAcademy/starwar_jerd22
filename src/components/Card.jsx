import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getImage } from "../utils/getImage";
import useGlobalReducer from "../hooks/useGlobalReducer";

const Card = ({ name, id, type, className = "" }) => {
    const [imageSrc, setImageSrc] = useState(getImage(name));
    const handleImageError = () => {
        setImageSrc("https://purodiseno.lat/wp-content/uploads/2022/05/STAR-WARS-828x621.jpg");
    };

    const routeByType = {
        people: "/personajes", personajes: "/personajes",
        vehicles: "/vehiculos", vehiculos: "/vehiculos",
        planets: "/planetas", planetas: "/planetas",
    };
    const detailLink = `${routeByType[type] || `/detalle/${type}`}/${id}`;

    const { store, dispatch } = useGlobalReducer();
    const isFav = store.favorites.some(f => f.id === id && f.type === type);
    const toggleFav = () => dispatch({ type: "FAV_TOGGLE", payload: { id, type, name } });

    return (
        <div className={`card bg-dark text-white h-100 ${className}`} style={{ border: "1px solid yellow" }}>
            <div className="ratio ratio-16x9 bg-light">
                <img
                    src={imageSrc}
                    alt={name}
                    onError={handleImageError}
                    className="w-100 h-100 object-fit-cover"
                />
            </div>

            <div className="card-body d-flex flex-column">
                <h5 className="card-title text-start">{name}</h5>
                <div className="d-flex justify-content-end gap-2 mt-auto">
                    <Link to={detailLink} className="btn btn-outline-danger">Learn More</Link>

                    {/* Botón favoritos (toggle) */}
                    <button
                        type="button"
                        onClick={toggleFav}
                        className={`btn ${isFav ? "btn-warning" : "btn-outline-warning"}`}
                        aria-pressed={isFav}
                        aria-label={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
                        title={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
                    >
                        <i className={isFav ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;