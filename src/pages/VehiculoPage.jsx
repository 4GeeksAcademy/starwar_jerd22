// pages/VehiculoPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getVehicleById } from "../services/api";
import { getImage } from "../utils/getImage";

export default function VehiculoPage() {
    const { id } = useParams();
    const [v, setV] = useState(null);
    const [loading, setLoading] = useState(true);
    const [img, setImg] = useState("");

    const [resolved, setResolved] = useState({
        films: [],
        pilots: [],
    });

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await getVehicleById(id); // debe devolver properties
                setV(data);
                setImg(getImage(data?.name));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    // Helpers para resolver nombres/títulos desde URLs
    const normalize = (u) => (u ? u.replace("http://", "https://") : u);
    const fetchName = async (url) => {
        try {
            const r = await fetch(normalize(url));
            const j = await r.json();
            const props = j?.result?.properties || {};
            return props.name || props.title || "—";
        } catch {
            return "—";
        }
    };

    useEffect(() => {
        if (!v) return;
        const run = async () => {
            const films = await Promise.all((v.films || []).map(fetchName));
            const pilots = await Promise.all((v.pilots || []).map(fetchName));
            setResolved({ films, pilots });
        };
        run();
    }, [v]);

    if (loading) return <div className="bg-black min-vh-100 text-white p-4">Cargando…</div>;
    if (!v) return <div className="bg-black min-vh-100 text-white p-4">No encontrado</div>;


    const manufacturer =  v.manufacturer; 
    const passengers =  v.passengers;  
    const maxSpeed =  v.max_atmosphering_speed;

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
                                    alt={v.name}
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
                            <h1 className="h3 mb-3">{v.name}</h1>

                            <dl className="row gy-2 mb-0">
                                <DtDd dt="Model" dd={v.model} />
                                <DtDd dt="Class" dd={v.vehicle_class} />
                                <DtDd dt="Manufacturer" dd={manufacturer} />
                                <DtDd dt="Cost (credits)" dd={v.cost_in_credits} />
                                <DtDd dt="Passengers" dd={passengers} />
                                <DtDd dt="Speed" dd={maxSpeed} />
                                <DtDd dt="Length" dd={v.length} />
                            </dl>
                        </div>
                    </div>
                </div>

                <div className="row row-cols-1 row-cols-md-2 g-4 mt-4">
                    <InfoColumn title="Films" items={resolved.films} />
                    <InfoColumn title="Pilots" items={resolved.pilots} />
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
                                <span className="link-warning">{n}</span>
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