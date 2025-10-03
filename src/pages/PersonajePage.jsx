import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPersonById } from "../services/api";
import { getImage } from "../utils/getImage";

export default function PersonajePage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [img, setImg] = useState(null);

    // Nombres derivados de URLs
    const [resolved, setResolved] = useState({
        homeworld: null,
        films: [],
        starships: [],
        vehicles: [],
        species: [],
    });

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const p = await getPersonById(id);     // debe devolver properties del personaje
                setData(p);
                setImg(getImage(p.name));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    // Helper: normaliza y saca el "nombre" de cualquier recurso
    const normalize = (u) => (u ? u.replace("http://", "https://") : u);
    const fetchName = async (url) => {
        try {
            const res = await fetch(normalize(url));
            const json = await res.json();
            const props = json?.result?.properties || {};
            return props.name || props.title || "—";
        } catch {
            return "—";
        }
    };

    // Cuando llega "data", resolvemos nombres de homeworld y arrays (films, etc.)
    useEffect(() => {
        if (!data) return;
        const run = async () => {
            const [homeworldName, films, starships, vehicles, species] = await Promise.all([
                data.homeworld ? fetchName(data.homeworld) : Promise.resolve("—"),
                Promise.all((data.films || []).map(fetchName)),
                Promise.all((data.starships || []).map(fetchName)),
                Promise.all((data.vehicles || []).map(fetchName)),
                Promise.all((data.species || []).map(fetchName)),
            ]);
            setResolved({ homeworld: homeworldName, films, starships, vehicles, species });
        };
        run();
    }, [data]);

    if (loading) return <div className="bg-black min-vh-100 text-white p-4">Cargando…</div>;
    if (!data) return <div className="bg-black min-vh-100 text-white p-4">No encontrado</div>;

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
                                    alt={data.name}
                                    className="w-100 h-100"
                                    style={{ objectFit: "cover" }}
                                    onError={(e) => {
                                        e.currentTarget.src = "https://purodiseno.lat/wp-content/uploads/2022/05/STAR-WARS-828x621.jpg";
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-xl-5">
                        <div className="p-4 bg-dark rounded-4 h-100 shadow">
                            <div className="small text-secondary mb-1">— •</div>
                            <h1 className="h3 mb-3">{data.name}</h1>

                            <dl className="row gy-2 mb-0">
                                <DtDd dt="Homeworld" dd={resolved.homeworld} />
                                <DtDd dt="Birth year" dd={data.birth_year} />
                                <DtDd dt="Gender" dd={data.gender} />
                                <DtDd dt="Height" dd={data.height ? `${data.height} cm` : "—"} />
                                <DtDd dt="Mass" dd={data.mass ? `${data.mass} kg` : "—"} />
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-4 mt-4">
                    <InfoColumn title="Films" items={resolved.films} />
                    <InfoColumn title="Starships" items={resolved.starships} />
                    <InfoColumn title="Vehicles" items={resolved.vehicles} />
                    <InfoColumn title="Species" items={resolved.species} />
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

function InfoColumn({ title, items }) {
    const has = items && items.length > 0;
    return (
        <div className="col">
            <div className="p-4 bg-dark rounded-4 h-100 border border-secondary-subtle">
                <div className="text-secondary small text-uppercase fw-semibold mb-2">{title}</div>
                {has ? (
                    <ul className="list-unstyled mb-0">
                        {items.map((n, i) => (
                            <li key={`${title}-${i}`} className="mb-1">
                                <span className="link-warning ">{n}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-white-50">—</div>
                )}
            </div>
        </div>
    );
}