import React from 'react'
import "./Forbidden.css";
import { NavLink } from 'react-router-dom';


const Forbidden = () => {
    return (
        <>
            <div className="body">
                <div className="scene">
                    <div className="overlay"></div>
                    <div className="overlay"></div>
                    <div className="overlay"></div>
                    <div className="overlay"></div>
                    <span className="bg-403">403</span>
                    <div className="text">
                        <span className="hero-text"></span>
                        <span className="msg">can't let <span>you</span> in.</span>
                        <span className="support">
                            <span>unexpected?</span>
                            <NavLink to="/" className=" w-37.5 inline-flex items-center justify-center
 text-center  rounded-full bg-linear-to-r from-amber-500 to-yellow-400
  text-gray-500 font-bold text-lg shadow-lg shadow-amber-500/30 transition-all 
  duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-amber-500/50 active:scale-95">
                                🏠 Go Home
                            </NavLink>
                        </span>
                    </div>
                    <div className="lock"></div>
                </div>
            </div>
        </>
    )
}

export default Forbidden