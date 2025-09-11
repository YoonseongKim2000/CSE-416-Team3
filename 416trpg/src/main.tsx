import { createHashRouter, RouterProvider,} from "react-router-dom";
import ErrorPage from './error-page.tsx';

import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import HomePage from "./routes/homepage.tsx";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />
      }
    ]
  }
  
]);

createRoot(document.getElementById('root')!).render(
  <>
    <RouterProvider router={router} />
  </>
)
