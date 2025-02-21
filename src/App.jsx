import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./component/LoginForm";
import ProcessPage from "./component/ProcessPage";
import Navbar from "./component/Navbar";
import SearchPage from "./component/SearchPage";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/searchpage" element={<SearchPage />} />
      </Routes>
    </Router>
  );
};

export default App;