import {Outlet} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Navigation from "./pages/Auth/Navigation.jsx";
function App() {

  return (
    <> <Navigation />
      <ToastContainer />
       <main className="pt-20 pb-3 sm:pt-20">
        <Outlet />
      </main>
    </>
  )
}

export default App
