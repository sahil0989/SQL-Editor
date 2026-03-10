import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import AssignmentAttempt from "./pages/assignment-attempt";
import AssignmentListing from "./pages/assignment-listing";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />

        <Routes>
          {/* Define your routes here */}
          <Route path="/" element={<AssignmentListing />} />
          <Route path="/assignment-listing" element={<AssignmentListing />} />
          <Route path="/assignment-attempt" element={<AssignmentAttempt />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;