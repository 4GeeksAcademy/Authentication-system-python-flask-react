const getState = ({getStore, getActions, setStore}) => {
    return {
        store: {
            name: "",
            email: "",
            token: "",
            message: null,
            demo: [{
                    title: "FIRST",
                    background: "white",
                    initial: "white",
                },
                {
                    title: "SECOND",
                    background: "white",
                    initial: "white",
                },
            ],
        },
        actions: {
            // Use getActions to call a function within a fuction
            exampleFunction: () => {
                getActions().changeColor(0, "green");
            },

            createUser: async (name, email, password) => {
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password,
                    }),
                };

                try {
                    const resp = await fetch(
                        "https://3001-divrobles-sistemadeaute-cwi81tn8rme.ws-eu51.gitpod.io/api/user",
                        options
                    );

                    if (resp.status !== 200) {
                        let data = await resp.json();
                        alert(data.msg);
                        return false;
                    }

                    const data = await resp.json();
                    alert(data.msg);
                    return true; // Devuelve true para que se ejecute la acción que llamamos en Login
                } catch (error) {
                    console.error("error");
                    console.log(error);
                }
            },

            login: async (email, password) => {
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                };

                try {
                    const resp = await fetch(
                        "https://3001-divrobles-sistemadeaute-cwi81tn8rme.ws-eu51.gitpod.io/api/login",
                        options
                    );

                    if (resp.status !== 200) {
                        const data = await resp.json();
                        alert(data.msg);
                    }

                    const data = await resp.json();
                    localStorage.setItem("token", data.access_token.token); // accedemos a la key acces_token de data
                    setStore({
                        token: data.access_token.token,
                        name: data.access_token.name,
                        email: data.access_token.email,
                    });
                    return true; // Devuelve true para que se ejecute la acción que llamamos en Login
                } catch (error) {
                    console.log(error);
                }
            },

            syncToken: () => {
                const token = localStorage.getItem("token");
                if (token && token != "" && token != undefined)
                    setStore({
                        token: token,
                    });
            },

            getMessage: async () => {
                try {
                    // fetching data from the backend
                    const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
                    const data = await resp.json();
                    setStore({
                        message: data.message,
                    });
                    // don't forget to return something, that is how the async resolves
                    return data;
                } catch (error) {
                    console.log("Error loading message from backend", error);
                }
            },
            changeColor: (index, color) => {
                //get the store
                const store = getStore();

                //we have to loop the entire demo array to look for the respective index
                //and change its color
                const demo = store.demo.map((elm, i) => {
                    if (i === index) elm.background = color;
                    return elm;
                });

                //reset the global store
                setStore({
                    demo: demo,
                });
            },
        },
    };
};

export default getState;