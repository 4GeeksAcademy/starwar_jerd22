import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPlanetById } from "../services/api";
import { getImage } from "../utils/getImage";

export default function PlanetaPage() {
    const { id } = useParams();
    const [p, setP] = useState(null);
    const [loading, setLoading] = useState(true);
    const [img, setImg] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await getPlanetById(id);
                setP(data);
                setImg(getImage(data?.name));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) return <div className="bg-black min-vh-100 text-white p-4">Cargando…</div>;
    if (!p) return <div className="bg-black min-vh-100 text-white p-4">No encontrado</div>;

    return (
        <div className="bg-black min-vh-100">
            <div className="container py-4 text-white">
                <Link to={-1} className="btn btn-outline-light mb-3"><i className="fa-solid fa-arrow-left"></i></Link>

                <div className="row g-4 align-items-stretch">
                    <div className="col-12 col-xl-7">
                        <div className="bg-dark rounded-4 overflow-hidden shadow">
                            <div className="ratio ratio-16x9">
                                <img
                                    src={img}
                                    alt={p.name}
                                    className="w-100 h-100"
                                    style={{ objectFit: "cover" }}
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "https://purodiseno.lat/wp-content/uploads/2022/05/STAR-WARS-828x621.jpg";
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-xl-5">
                        <div className="p-4 bg-dark rounded-4 h-100 shadow">
                            <div className="small text-secondary mb-1">— •</div>
                            <h1 className="h3 mb-3">{p.name}</h1>

                            <dl className="row gy-2 mb-0">
                                <DtDd dt="Climate" dd={p.climate} />
                                <DtDd dt="Diameter" dd={p.diameter} />
                                <DtDd dt="Population" dd={p.population} />
                                <DtDd dt="Terrain" dd={p.terrain} />
                                <DtDd dt="Orbital period" dd={p.orbital_period} />
                                <DtDd dt="Rotation period" dd={p.rotation_period} />
                                <DtDd dt="Surface water" dd={p.surface_water} />
                                <DtDd dt="Gravity" dd={p.gravity} />
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DtDd({ dt, dd }) {
    return (
        <>
            <dt className="col-5 col-sm-4 text-secondary small">{dt}</dt>
            <dd className="col-7 col-sm-8 mb-0">{dd || "—"}</dd>
        </>
    );
}