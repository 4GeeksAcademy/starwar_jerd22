import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import CategoryGridPage from "./pages/CategoryGridPage";
import PersonajePage from "./pages/PersonajePage";
import VehiculoPage from "./pages/VehiculoPage";
import PlanetaPage from "./pages/PlanetaPage";

export const router = createBrowserRouter(
  createRoutesFromElements(
    // Ruta principal que envuelve todas las demás rutas
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      <Route index element={<Home />} />

      <Route path="/personajes" element={<CategoryGridPage type="personajes" />} />  
      <Route path="/vehiculos" element={<CategoryGridPage type="vehiculos" />} />     
      <Route path="/planetas" element={<CategoryGridPage type="planetas" />} />        

      <Route path="/personajes/:id" element={<PersonajePage />} />
      <Route path="/vehiculos/:id" element={<VehiculoPage />} />
      <Route path="/planetas/:id" element={<PlanetaPage />} />

    </Route>
  )
);