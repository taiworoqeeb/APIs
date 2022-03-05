import { Routes, Route } from "react-router-dom";
import { getUser } from "./utils/utils";
import LandingPage from "./pages/landing/Landingpage.component";
import Login from "./pages/login/Login.component";
import Baseview from "./pages/baseview/Baseview.component";
import Dashboard from "./pages/dashboard/Dashboard.component";

const App = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={!getUser("name") ? <LandingPage /> : <Baseview />}
        />
        <Route
          path="/login"
          element={
            !getUser("name") ? (
              <Login logAcc="Login as Help Desktop Agent" />
            ) : (
              <Baseview />
            )
          }
        />
        <Route
          path="/login-ad"
          element={
            !getUser("name") ? <Login logAcc="Login as Admin" /> : <Baseview />
          }
        />
        <Route
          path="/dashboard"
          element={getUser("name") ? <Baseview /> : <LandingPage />}
        />
        <Route
          path="/home"
          element={getUser("name") ? <Dashboard /> : <LandingPage />}
        />
      </Routes>
    </>
  );
};

export default App;
