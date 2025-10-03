import React, { useState, useEffect } from "react";
import SectionRow from "../components/SectionRow";
import { getPeople, getVehicles, getPlanets } from "../services/api";
import "./Home.css";

export const Home = () => {
	const [people, setPeople] = useState([]);
	const [vehicles, setVehicles] = useState([]);
	const [planets, setPlanets] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const [peopleData, vehiclesData, planetsData] = await Promise.all([
					getPeople(),
					getVehicles(),
					getPlanets(),
				]);
				setPeople(peopleData);
				setVehicles(vehiclesData);
				setPlanets(planetsData);
			} catch (err) {
				console.error("Error fetching data:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	return (
		<div className="text-center" style={{ backgroundColor: "black", color: "white" }}>
			{loading ? (
				<p className="py-5">Loading...</p>
			) : (
				<div className="container py-4">
					<SectionRow title="People" items={people} type="people"  />
					<SectionRow title="Planets" items={planets} type="planets" />
					<SectionRow title="Vehicles" items={vehicles} type="vehicles"  />
				</div>
			)}
		</div>
	);
};

export default Home;