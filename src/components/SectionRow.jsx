import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "./Card";

export default function SectionRow({ title, items = [], type, seeAllTo }) {
    const scrollerRef = useRef(null);
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(false);
    const [rowImgHeight, setRowImgHeight] = useState(null); // px de la imagen más alta

    const updateArrows = () => {
        const el = scrollerRef.current;
        if (!el) return;
        const maxScrollLeft = el.scrollWidth - el.clientWidth;
        setCanLeft(el.scrollLeft > 0);
        setCanRight(maxScrollLeft - el.scrollLeft > 1);
    };

    const handleNext = () => {
        const el = scrollerRef.current;
        if (!el) return;
        el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
    };

    const handlePrev = () => {
        const el = scrollerRef.current;
        if (!el) return;
        el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
    };

    // Calcular la altura máxima de las imágenes dentro de las cards
    const computeMaxImgHeight = () => {
        const el = scrollerRef.current;
        if (!el) return;
        const imgs = el.querySelectorAll("img");
        let maxH = 0;
        imgs.forEach((img) => {
            const h = img.naturalHeight || img.clientHeight || 0;
            if (h > maxH) maxH = h;
        });
        if (maxH === 0) maxH = 240;
        setRowImgHeight(maxH);
    };

    // Recalcular cuando cambien los items
    useEffect(() => {
        computeMaxImgHeight();
        updateArrows();

        const el = scrollerRef.current;
        if (!el) return;

        // Recalcular cuando se haga scroll para mostrar/ocultar flechas
        const onScroll = () => updateArrows();
        el.addEventListener("scroll", onScroll);

        // Recalcular en resize
        const onResize = () => {
            updateArrows();
            computeMaxImgHeight();
        };
        window.addEventListener("resize", onResize);

        const imgs = el.querySelectorAll("img");
        const handlers = [];
        imgs.forEach((img) => {
            const fn = () => computeMaxImgHeight();
            img.addEventListener("load", fn);
            handlers.push({ img, fn });
        });

        // Primer tick por si aún no había layout listo
        const t = setTimeout(() => {
            computeMaxImgHeight();
            updateArrows();
        }, 50);

        return () => {
            clearTimeout(t);
            el.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            handlers.forEach(({ img, fn }) => img.removeEventListener("load", fn));
        };
    }, [items]);

    const showAny = items.length > 0;

    const pathByType = {
        people: "/personajes",
        planets: "/planetas",
        vehicles: "/vehiculos",
    };

    const seeAllPath = pathByType[type] || "/";

    return (
        <section className="mb-5">
            <div className="d-flex align-items-end justify-content-between">
                <h2 className="h4 m-0">{title}</h2>
                <Link to={seeAllPath} className="btn btn-link text-decoration-none" style={{ color: "white" }}>
                    SEE ALL <i className="fa-solid fa-chevron-right"></i>
                </Link>
            </div>
            <hr className="mt-2 mb-3" />

            <div className="position-relative">
                <div
                    ref={scrollerRef}
                    className="d-flex align-items-stretch gap-3 overflow-auto py-2 no-scrollbar"
                    style={{ scrollSnapType: "x mandatory" }}
                >
                    {items.map((it) => (
                        <div
                            key={it.uid}
                            className="flex-shrink-0"
                            style={{ width: "18rem", scrollSnapAlign: "start" }}
                        >
                            <Card name={it.name} id={it.uid} type={type} className="h-100" />
                        </div>
                    ))}
                </div>

                {/* Flecha izquierda: solo aparece si ya te has desplazado */}
                {showAny && canLeft && (
                    <button
                        type="button"
                        onClick={handlePrev}
                        className="btn btn-dark rounded-circle shadow position-absolute top-50 start-0 translate-middle-y ms-2"
                        aria-label={`Scroll back ${title}`}
                        style={{ width: 44, height: 44, zIndex: 2 }}
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                )}

                {/* Flecha derecha: solo aparece si hay más contenido */}
                {showAny && canRight && (
                    <button
                        type="button"
                        onClick={handleNext}
                        className="btn btn-dark rounded-circle shadow position-absolute top-50 end-0 translate-middle-y me-2"
                        aria-label={`Scroll ${title}`}
                        style={{ width: 44, height: 44, zIndex: 2 }}
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                )}
            </div>
        </section>
    );
}