import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import GPACalculator from "./pages/GPACalculator";
import GradeConverter from "./pages/GradeConverter";
import CumulativeGPA from "./pages/CumulativeGPA";
import GraduationCalculator from "./pages/GraduationCalculator";
import CreditCalculator from "./pages/CreditCalculator";
import ToeicPage from "./pages/ToeicPage";
import ToolPage from "./pages/ToolPage";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/gpa"
            element={<GPACalculator />}
          />

          <Route
            path="/grade-converter"
            element={<GradeConverter />}
          />

          <Route
            path="/cumulative-gpa"
            element={<CumulativeGPA />}
          />

          <Route
            path="/graduation-calculator"
            element={<GraduationCalculator />}
          />

          <Route
            path="/credit-calculator"
            element={<CreditCalculator />}
          />

          <Route
            path="/toeic"
            element={<ToeicPage />}
          />

          <Route
            path="/tools/:toolId"
            element={<ToolPage />}
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;