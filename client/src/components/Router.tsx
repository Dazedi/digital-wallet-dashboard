import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { routes } from "./Routes";
import { Nav } from "./Nav";

export const Router = () => {
  return (
    <HashRouter>
      <Nav />
      <Routes>
        {routes.map((route, idx) => (
          <Route key={idx} path={route.path} element={route.component} />
        ))}
      </Routes>
    </HashRouter>
  )
};

export default Router;