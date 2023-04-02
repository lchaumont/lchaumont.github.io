import React from "react";
import ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./Components/ErrorPage/ErrorPage";
import Home from "./Components/Home/Home";
import Root from "./Components/Root/Root";
import "./index.css";
import ImageConvolution from "./Components/ImageConvolution/ImageConvolution";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/accueil",
                element: <Home />,
            },
            {
                path: "/image_convulution",
                element: <ImageConvolution />,
            },
        ],
    },
]);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

