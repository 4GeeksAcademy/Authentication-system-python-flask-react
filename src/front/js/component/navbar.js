import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/navbar.css";

export const Navbar = () => {
	const { store, actions } = useContext(Context);

	const navegate = useNavigate();

	const borrarToken = () => {
		localStorage.removeItem("token");
		store.token = null;
		navegate("/login");
		console.log(store.name);
	};

	const login = () => {
		navegate("/login");
	};

	return (
		<nav className="navbar ">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="boton-log">
					{store.token ? (
						// <button type="button" className="btn btn-primary" onClick={localStorage.removeItem("token")}>Log out</button>
						<button
							type="button"
							className="btn btn-primary"
							onClick={borrarToken}
						>
							Log out
						</button>
					) : (
						<button type="button" className="btn btn-primary" onClick={login}>
							Log in
						</button>
					)}
				</div>
				<div className="ml-auto">
					<Link to="/demo">
						<button className="btn btn-primary">
							Check the Context in action
						</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};
