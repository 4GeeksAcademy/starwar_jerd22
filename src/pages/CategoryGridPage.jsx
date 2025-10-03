import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { getPeople, getPlanets, getVehicles } from "../services/api";
import "./CategoryGridPage.css";

const fetchers = { people: getPeople, planets: getPlanets, vehicles: getVehicles };
const typeMap = { personajes: "people", vehiculos: "vehicles", planetas: "planets" };
const titleMap = { personajes: "Personajes", vehiculos: "Vehículos", planetas: "Planetas" };

export default function CategoryGridPage({ type }) {
    const apiType = typeMap[type] || type;
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const fetcher = fetchers[apiType];
                const data = fetcher ? await fetcher() : [];
                setItems(data || []);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [apiType]);

    const GAP = 4;

    return (
        <div className="grid-page bg-black min-vh-100">
            <div className="container py-2">
                <div className="d-flex align-items-end text-white">
                    <h1 className="h3 m-0">{titleMap[type] || apiType}</h1>
                </div>
                <hr className="border-secondary opacity-25" />

                {loading ? (
                    <p className="text-white-50">Cargando…</p>
                ) : (
                    <div className={`row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xxl-5 g-${GAP}`}>
                        {items.map((it) => (
                            <div className="col d-flex justify-content-center" key={it.uid}>
                                <Card name={it.name} id={it.uid} type={apiType} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}