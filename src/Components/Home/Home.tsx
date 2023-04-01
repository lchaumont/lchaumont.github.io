import React from "react";
import {Outlet} from "react-router-dom";

const Home = () => {
    return (
        <div>
            Hello
            <div>
                <Outlet />
            </div>
        </div>
    );
};

export default Home;
