import React from "react";
import {Outlet, Link, useLocation} from "react-router-dom";
import "./Root.css";

const Root = () => {
    const currentLocation = useLocation();

    const getLocationTitle = (): string => {
        switch (currentLocation.pathname) {
            case "/":
                return "Accueil";
            default:
                return "";
        }
    };

    return (
        <>
            <header>
                <div className="navbar-fixed">
                    <nav className="navbar white">
                        <div className="nav-wrapper">
                            <a href="#!" className="brand-logo grey-text text-darken-4">
                                {getLocationTitle()}
                            </a>
                        </div>
                    </nav>
                </div>

                <ul id="sidenav-left" className="sidenav sidenav-fixed">
                    <div className="container">
                        <img
                            className="circle responsive-img"
                            src="https://github.com/lchaumont.png"
                            alt="github_profile_img"
                        />
                        <div className="author-name">Louis Chaumont</div>
                    </div>

                    <div id="social-icons">
                        <a href="https://www.linkedin.com/in/softvar">
                            <span className="material-icons md-dark">face</span>
                        </a>
                        <a href="http://github.com/softvar">
                            <span className="material-icons md-dark">face</span>
                        </a>
                    </div>
                </ul>
            </header>

            <main>
                <Outlet />
            </main>

            <footer className="page-footer">
                <div className="container">
                    <div className="row">
                        <div className="col l6 s12">
                            <h5 className="white-text">Footer Content</h5>
                            <p className="grey-text text-lighten-4">
                                You can use rows and columns here to organize your footer content.
                            </p>
                        </div>
                        <div className="col l4 offset-l2 s12">
                            <h5 className="white-text">Links</h5>
                            <ul>
                                <li>
                                    <a className="grey-text text-lighten-3" href="#!">
                                        Link 1
                                    </a>
                                </li>
                                <li>
                                    <a className="grey-text text-lighten-3" href="#!">
                                        Link 2
                                    </a>
                                </li>
                                <li>
                                    <a className="grey-text text-lighten-3" href="#!">
                                        Link 3
                                    </a>
                                </li>
                                <li>
                                    <a className="grey-text text-lighten-3" href="#!">
                                        Link 4
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="footer-copyright">
                    <div className="container">
                        © 2014 Copyright Text
                        <a className="grey-text text-lighten-4 right" href="#!">
                            More Links
                        </a>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Root;
