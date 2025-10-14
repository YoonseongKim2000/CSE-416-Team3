import { createHashRouter, RouterProvider,} from "react-router-dom";
import ErrorPage from './error-page.tsx';
import 'react-toastify/dist/ReactToastify.css';

import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import HomePage from "./routes/homepage.tsx";
import ResultsPage from "./routes/results.tsx";
import Features from "./routes/Features.tsx";
import Pricing from "./routes/Pricing.tsx";
import ApiDocs from "./routes/ApiDocs.tsx";
import Login from "./routes/Login.tsx";
import SignUp from "./routes/SignUp.tsx";
import LandingPage from "./routes/Landing.tsx";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <LandingPage/>
      },
      {
        path: "home",
        element: <HomePage />
      },
      {
        path: "results",
        element: <ResultsPage/>
      },
      {
        path: "features",
        element: <Features/>
      },
      {
        path: "pricing",
        element: <Pricing/>
      },
      {
        path: "api-docs",
        element: <ApiDocs/>
      },
      {
        path: "signup",
        element: <SignUp/>
      },
      {
        path: "login",
        element: <Login/>
      }
    ]
  }
  
]);

createRoot(document.getElementById('root')!).render(
  <>
    <RouterProvider router={router} />
  </>
)
