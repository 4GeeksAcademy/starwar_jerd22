import { Link } from "react-router-dom";
import logo from "../assets/img/logo.png";
import useGlobalReducer from "../hooks/useGlobalReducer";

const routeByType = {
	people: "/personajes", personajes: "/personajes",
	vehicles: "/vehiculos", vehiculos: "/vehiculos",
	planets: "/planetas", planetas: "/planetas",
};

const labelByType = { people: "personaje", personajes: "personaje", vehicles: "vehículo", vehiculos: "vehículo", planets: "planeta", planetas: "planeta" };

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const favs = store.favorites;

	return (
		<nav className="navbar border-bottom border-body" data-bs-theme="dark" style={{ backgroundColor: "black", color: "white" }}>
			<div className="container">
				<Link to="/">
					<img src={logo} alt="Logo" style={{ width: "100px" }} />
				</Link>

				<div className="ms-auto">
					<div className="dropdown">
						<button
							className="btn btn-primary dropdown-toggle"
							type="button"
							data-bs-toggle="dropdown"
							aria-expanded="false"
						>
							Favorites 
						</button>

						<ul className="dropdown-menu dropdown-menu-end ">
							{favs.length === 0 && (
								<li><span className="dropdown-item-text text-secondary">Without favorites</span></li>
							)}

							{favs.map(f => (
								<li key={`${f.type}-${f.id}`} className="d-flex align-items-center">
									<Link
										className="dropdown-item flex-grow-1 text-truncate"
										to={`${routeByType[f.type] || `/detalle/${f.type}`}/${f.id}`}
										title={`${f.name} (${labelByType[f.type] || f.type})`}
									>
										{f.name}
									</Link>
									<button
										className="btn btn-sm btn-danger ms-2 me-2"
										onClick={() => dispatch({ type: "FAV_REMOVE", payload: f })}
										title="Quitar"
									>
										&times;
									</button>
								</li>
							))}

							{favs.length > 0 && <li><hr className="dropdown-divider" /></li>}
							{favs.length > 0 && (
								<li>
									<button
										className="dropdown-item text-danger"
										onClick={() => dispatch({ type: "FAV_CLEAR" })}
									>
										Clean Favorites
									</button>
								</li>
							)}
						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};