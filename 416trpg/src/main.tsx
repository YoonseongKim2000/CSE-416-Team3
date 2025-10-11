import { createHashRouter, RouterProvider,} from "react-router-dom";
import ErrorPage from './error-page.tsx';
import 'react-toastify/dist/ReactToastify.css';

import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import HomePage from "./routes/homepage.tsx";
import ResultsPage from "./routes/results.tsx";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "results",
        element: <ResultsPage/>
      }
    ]
  }
  
]);

createRoot(document.getElementById('root')!).render(
  <>
    <RouterProvider router={router} />
  </>
)
