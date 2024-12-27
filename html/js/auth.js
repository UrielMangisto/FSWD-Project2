const login = (username, password) => {
    // Dummy authentication logic
    if (username === "user" && password === "1234") {
      localStorage.setItem("isLoggedIn", "true");
      alert("Login successful!");
    } else {
      alert("Invalid credentials!");
    }
  };
  