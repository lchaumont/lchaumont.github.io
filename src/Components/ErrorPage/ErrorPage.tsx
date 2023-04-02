import React from "react";
import "./ErrorPage.css";
import {Link} from "react-router-dom";

const ErrorPage = () => {
    return (
        <div className="main_container">
            <h1>404 - Not Found</h1>
            <div className="error_gif"></div>
            <Link className="waves-effect waves-light btn-large" to="/">
                <i className="material-icons left">arrow_back</i>
                Retour à l'acceuil
            </Link>
        </div>
    );
};

export default ErrorPage;
