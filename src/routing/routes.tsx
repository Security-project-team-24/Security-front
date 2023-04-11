import { RouteObject } from "react-router-dom";
import App from "../App";
import { CertificatesDisplayPage } from "../pages/CertificatesDisplayPage";
import { CertificatePage } from "../pages/CertificatePage";
import { HomePage } from "../pages/HomePage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/display-certificates",
        element: <CertificatesDisplayPage />,
      },
      {
        path: "/create-certificate",
        element: <CertificatePage />,
      },
    ],
  },
];
