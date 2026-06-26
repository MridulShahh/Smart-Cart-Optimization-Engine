import { Routes, Route } from "react-router-dom";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<h1>Home Page</h1>} />
    </Routes>
  );
}

export default AppRoutes;