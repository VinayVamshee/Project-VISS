import React, { useEffect, useState } from "react";

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Index() {

  const navigate = useNavigate();

  const [loggedInAdmin, setLoggedInAdmin] = useState(null);
  const [ActivateEditMode, setActivateEditMode] = useState(false);

  // Form states for register, login, update
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    phoneNo: "",
    username: "",
    password: "",
  });
  const [updateForm, setUpdateForm] = useState({
    username: "",
    fullName: "",
    phoneNo: "",
    password: "",
  });

  const themes = [
    { name: "☀️ light", value: "light" },
    { name: "🌲 forest", value: "forest" },
    { name: "🌊 ocean", value: "ocean" },
    { name: "✨ skyshine", value: "skyshine" },
    { name: "🌞 sunshine", value: "sunshine" },
    { name: "🪵 wood", value: "wood" },
    { name: "💜 lavender", value: "lavender" },
    { name: "🌹 rose", value: "rose" },
    { name: "🌿 mint", value: "mint" },
    { name: "🪸 coral", value: "coral" },
    { name: "🪨 slate", value: "slate" },
    { name: "🍇 grape", value: "grape" },
    { name: "☕ mocha", value: "mocha" },
    { name: "🌌 nebula", value: "nebula" },
    { name: "🪐 andromeda", value: "andromeda" },
    { name: "💥 supernova", value: "supernova" },
    { name: "🐠 ocean-depths", value: "ocean-depths" },
    { name: "🌈 aurora", value: "aurora" },
    { name: "🍬 cotton-candy", value: "cotton-candy" },
    { name: "🌙 midnight-mirage", value: "midnight-mirage" },
    { name: "⚫ obsidian-core", value: "obsidian-core" },
    { name: "🟩 neon-matrix", value: "neon-matrix" },
    { name: "⚙️ starforge-steel", value: "starforge-steel" },
    { name: "🔥 deep-ember", value: "deep-ember" },
    { name: "🌀 cyber-blue-noir", value: "cyber-blue-noir" },
    { name: "🍍 tropical-punch", value: "tropical-punch" },
    { name: "⚡ electric-dream", value: "electric-dream" },
    { name: "🌈 rainbow-cascade", value: "rainbow-cascade" },
    { name: "🍉 jungle-fruit", value: "jungle-fruit" }
  ];

  const [theme, setTheme] = useState("light");

  // On mount, load saved theme or default to light
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const handleChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
    document.documentElement.setAttribute("data-theme", selectedTheme);
    localStorage.setItem("theme", selectedTheme);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const adminData = localStorage.getItem("admin");

    if (token && adminData) {
      setLoggedInAdmin(JSON.parse(adminData));
      // You can also verify token validity with backend if needed here
    }
  }, []);

  // Handle input change for all forms
  const handleInputChange = (e, formSetter) => {
    const { name, type, value, checked } = e.target;
    formSetter((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Login handler
  const handleLogin = async () => {
    try {
      const res = await axios.post("https://viss-server.vercel.app/admin-login", {
        username: loginForm.username,
        password: loginForm.password,
      });

      if (res.data.admin && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("admin", JSON.stringify(res.data.admin));

        // Set admin to state
        setLoggedInAdmin(res.data.admin);
        alert("Login successful");
      } else {
        alert("Login failed: No token or admin data returned");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  // Register handler
  const handleRegister = async () => {
    try {
      const res = await axios.post(
        "https://viss-server.vercel.app/admin-register",
        registerForm
      );
      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  // Update handler
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        "https://viss-server.vercel.app/admin-details-update",
        updateForm
      );
      alert(res.data.message);
      setLoggedInAdmin(res.data.admin);
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setLoggedInAdmin(null);
    alert("Logged out successfully");
    navigate('/');
  };

  const [categoryForm, setCategoryForm] = useState({ sNo: "", name: "" });
  const [subCategoryForm, setSubCategoryForm] = useState({
    sNo: "",
    name: "",
    category: "",
  });
  const [itemForm, setItemForm] = useState({
    name: "",
    iconUrl: "",
    link: "",
    document: false,
    category: "",
    subCategory: "",
  });

  // POST handlers

  const handleAddCategory = async () => {
    try {
      await axios.post("https://viss-server.vercel.app/add-category", categoryForm);
      alert("Category added successfully");
      fetchAllData();
      setCategoryForm({ sNo: "", name: "" });
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add category");
    }
  };

  const handleAddSubCategory = async () => {
    try {
      await axios.post(
        "https://viss-server.vercel.app/add-subcategory",
        subCategoryForm
      );
      alert("SubCategory added successfully");
      fetchAllData();
      setSubCategoryForm({ sNo: "", name: "", category: "" });
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add subcategory");
    }
  };

  const handleAddItem = async () => {
    try {
      await axios.post("https://viss-server.vercel.app/add-item", itemForm);
      alert("Item added successfully");
      fetchAllData();
      setItemForm({
        name: "",
        iconUrl: "",
        link: "",
        document: false,
        category: "",
        subCategory: "",
      });
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add item");
    }
  };

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [catRes, subCatRes, itemRes] = await Promise.all([
        axios.get("https://viss-server.vercel.app/categories"),
        axios.get("https://viss-server.vercel.app/subcategories"),
        axios.get("https://viss-server.vercel.app/items"),
      ]);

      setCategories(catRes.data);
      setSubCategories(subCatRes.data);
      setItems(itemRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const [filterType, setFilterType] = useState(null);

  const handleFilterClick = (id) => {
    setFilterType(id);
  };

  const [userLoginData, setUserLoginData] = useState({
    name: "",
    password: "",
  });
  const [userRegisterData, setUserRegisterData] = useState({
    name: "",
    password: "",
    category: "",
  });

  const [loggedInUser, setLoggedInUser] = useState(null);

  // Check login status on page load
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setLoggedInUser(JSON.parse(userData)); // set full user object
    }
  }, []);

  // Login function
  const userLogin = async () => {
    try {
      const res = await axios.post("https://viss-server.vercel.app/user-login", {
        username: userLoginData.name,
        password: userLoginData.password,
      });

      if (res.data.user && res.data.token) {
        // Don't include password when storing user data
        const { password, ...safeUserData } = res.data.user;

        localStorage.setItem("user", JSON.stringify(safeUserData)); // Save full user data (safe)
        localStorage.setItem("userToken", res.data.token); // Save token

        setLoggedInUser(safeUserData); // Update state with full user data
        alert("Logged in successfully");
        fetchAllData();
      } else {
        alert("Login failed: Missing user or token");
      }
    } catch (err) {
      alert("Login error: " + (err.response?.data?.message || err.message));
    }
  };

  // Logout function
  const userLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userToken");
    setLoggedInUser(null);
    navigate('/');
  };

  const userRegister = async () => {
    try {
      await axios.post("https://viss-server.vercel.app/user-register", {
        username: userRegisterData.name,
        password: userRegisterData.password,
        category: userRegisterData.category, // send the array directly
      });
      alert("Registered successfully");
    } catch (err) {
      alert("Register error: " + (err.response?.data?.message || err.message));
    }
  };

  // State for users and selected user for editing
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://viss-server.vercel.app/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editCategory, setEditCategory] = useState([]);

  useEffect(() => {
    if (selectedUser) {
      setEditUsername(selectedUser.username);
      setEditPassword(selectedUser.password);
      setEditCategory(selectedUser.category.map((cat) => cat._id || cat)); // in case category is populated
    }
  }, [selectedUser]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    iconUrl: "",
    link: "",
    document: false,
    category: "",
    subCategory: ""
  });
  const [searchText, setSearchText] = useState('');


  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <div className="loading-sign">Loading...</div>
      </div>
    );
  }

  return (
    <div className="index">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <form className="ms-2" autoComplete="off"><input type="text" placeholder="Search" name="searchText" autoComplete="new-password" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="form-control" />  </form>
          <select
            value={theme}
            onChange={handleChange}
            className="btn"
          >
            {themes.map((th) => (
              <option key={th.value} value={th.value}>
                {th.name.charAt(0).toUpperCase() + th.name.slice(1)}
              </option>
            ))}
          </select>
          <a className="navbar-brand ms-2" href="/">VISS</a>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {loggedInUser && !loggedInAdmin ? (
                <li className="nav-item">
                  <div className="">{loggedInUser.username}</div>
                  <button className="" onClick={userLogout}>
                    User Logout
                  </button>
                </li>
              ) : !loggedInAdmin ? (
                <li
                  className="nav-item"
                  data-bs-target="#UserLoginModalToggle"
                  data-bs-toggle="modal"
                >
                  User Login
                </li>
              ) : null}


              {loggedInAdmin ? (
                <li className="nav-item" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <button
                    className=" btn"
                    data-bs-toggle="modal"
                    data-bs-target="#AdminPanelModalToggle"
                    style={{ width: 'fit-content' }}
                  >

                    {loggedInAdmin.username}
                  </button>

                  <button className="btn" style={{ width: 'fit-content' }} onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              ) : (
                <button
                  className="btn"
                  data-bs-target="#AdminModalToggle"
                  data-bs-toggle="modal"
                >
                  <i className="fa-solid fa-user-tie fa-lg me-2"></i>Admin Login
                </button>
              )}



              {loggedInAdmin ? (
                <div className="dropdown">
                  <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" > Register </button>
                  <ul className="dropdown-menu">
                    <li data-bs-target="#RegisterModal" data-bs-toggle="modal" data-bs-dismiss="modal" className="dropdown-item" > Admin </li>
                    <li type="button" data-bs-target="#UserLoginModalToggle2" data-bs-toggle="modal" className="dropdown-item" > User </li>
                  </ul>
                </div>
              ) : null}

              <button type="button" className="btn" style={{ width: 'fit-content' }} data-bs-toggle="modal" data-bs-target="#AboutModal">
                About
              </button>


              {
                loggedInAdmin ?
                  <>
                    <button style={{ width: 'fit-content' }} className="btn nav-item nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                      Modify
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <div className="form-check ms-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="editModeToggle"
                            onChange={(e) => setActivateEditMode(e.target.checked)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="editModeToggle"
                          >
                            Edit Mode
                          </label>
                        </div>
                      </li>
                      <li> <button className="dropdown-item" data-bs-toggle="modal" data-bs-target="#AddCategoryModal" >Add Category </button> </li>
                      <li> <button className="dropdown-item" data-bs-toggle="modal" data-bs-target="#AddSubCategoryModal" > Add SubCategory </button> </li>
                      <li> <button className="dropdown-item" data-bs-toggle="modal" data-bs-target="#AddItemModal" >Add Item </button> </li>
                    </ul>
                  </>
                  :
                  null
              }
            </ul>
          </div>
        </div>
      </nav>


      <div className="navigation">
        <Link to='/' className="logo">VISS</Link>
        <form autoComplete="off"><input type="text" placeholder="Search" name="searchText" autoComplete="new-password" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="form-control" />  </form>

        <div className="controls">
          {loggedInAdmin ? (
            <div className="dropdown">
              <button className="btn btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" ><i className="fa-solid fa-pen-nib fa-lg me-2"></i>Modify </button>

              <ul className="dropdown-menu">
                <li>
                  <div className="form-check ms-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="editModeToggle"
                      onChange={(e) => setActivateEditMode(e.target.checked)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="editModeToggle"
                    >
                      Edit Mode
                    </label>
                  </div>
                </li>
                <li> <button className="dropdown-item" data-bs-toggle="modal" data-bs-target="#AddCategoryModal" >Add Category </button> </li>
                <li> <button className="dropdown-item" data-bs-toggle="modal" data-bs-target="#AddSubCategoryModal" > Add SubCategory </button> </li>
                <li> <button className="dropdown-item" data-bs-toggle="modal" data-bs-target="#AddItemModal" >Add Item </button> </li>
              </ul>
            </div>
          ) : null}

          <div
            className="modal fade"
            id="UserLoginModalToggle"
            tabIndex="-1"
            aria-labelledby="loginModalLabel"
            aria-hidden="true"
            data-bs-backdrop="false"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="loginModalLabel">
                    Login
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div
                      className="mb-3"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <input
                        type="text"
                        value={userLoginData.name}
                        onChange={(e) =>
                          setUserLoginData({
                            ...userLoginData,
                            name: e.target.value,
                          })
                        }
                      />
                      <input
                        type="password"
                        value={userLoginData.password}
                        onChange={(e) =>
                          setUserLoginData({
                            ...userLoginData,
                            password: e.target.value,
                          })
                        }
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={userLogin}
                  >

                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Register Modal */}
          <div
            className="modal fade"
            id="UserLoginModalToggle2"
            tabIndex="-1"
            aria-labelledby="registerModalLabel"
            aria-hidden="true"
            data-bs-backdrop="false"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="registerModalLabel">

                    Register
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div
                      className="mb-3"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <input
                        type="text"
                        value={userRegisterData.name}
                        onChange={(e) =>
                          setUserRegisterData({
                            ...userRegisterData,
                            name: e.target.value,
                          })
                        }
                      />
                      <input
                        type="password"
                        value={userRegisterData.password}
                        onChange={(e) =>
                          setUserRegisterData({
                            ...userRegisterData,
                            password: e.target.value,
                          })
                        }
                      />
                      <div className="mb-3">
                        <label className="form-label">Select Categories</label>
                        <div>
                          {categories.map((cat) => (
                            <div key={cat._id} className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`category-${cat._id}`}
                                value={cat._id}
                                checked={userRegisterData.category.includes(
                                  cat._id
                                )}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setUserRegisterData({
                                      ...userRegisterData,
                                      category: [
                                        ...userRegisterData.category,
                                        cat._id,
                                      ],
                                    });
                                  } else {
                                    setUserRegisterData({
                                      ...userRegisterData,
                                      category:
                                        userRegisterData.category.filter(
                                          (id) => id !== cat._id
                                        ),
                                    });
                                  }
                                }}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`category-${cat._id}`}
                              >
                                {cat.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </form>
                  <p>Already have an account? Click below to Login.</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={userRegister}
                  >

                    Register
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    data-bs-target="#UserLoginModalToggle"
                    data-bs-toggle="modal"
                  >

                    Back to Login
                  </button>
                </div>
              </div>
            </div>
          </div>

          {loggedInUser ? (
            <>
              <div className="loggedIn">{loggedInUser.username}</div>
              <button className="logout" onClick={userLogout}>
                User logout
              </button>
            </>
          ) : (
            <button
              className="btn btn-sm"
              data-bs-target="#UserLoginModalToggle"
              data-bs-toggle="modal"
            >
              User Login
            </button>
          )}

          {loggedInAdmin ? (
            <>


              <button
                className="loggedIn"
                data-bs-toggle="modal"
                data-bs-target="#AdminPanelModalToggle"
              >

                {loggedInAdmin.username}
              </button>

              <button className="logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button
              className="btn btn-sm"
              data-bs-target="#AdminModalToggle"
              data-bs-toggle="modal"
            >
              <i className="fa-solid fa-user-tie fa-lg me-2"></i>Admin Login
            </button>
          )}

          {loggedInAdmin ? (
            <div className="dropdown">
              <button className="btn btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" > Register </button>
              <ul className="dropdown-menu">
                <li data-bs-target="#RegisterModal" data-bs-toggle="modal" data-bs-dismiss="modal" className="dropdown-item" > Admin </li>
                <li type="button" data-bs-target="#UserLoginModalToggle2" data-bs-toggle="modal" className="dropdown-item" > User </li>
              </ul>
            </div>
          ) : null}

          <button type="button" className="btn btn-sm" data-bs-toggle="modal" data-bs-target="#AboutModal">
            About
          </button>

          <select
            value={theme}
            onChange={handleChange}
            className="btn btn-sm btn-dark"
          >
            {themes.map((th) => (
              <option key={th.value} value={th.value}>
                {th.name.charAt(0).toUpperCase() + th.name.slice(1)}
              </option>
            ))}
          </select>

          {/* Users Info Modal */}
          <div
            className="modal fade"
            id="AdminPanelModalToggle"
            aria-hidden="true"
            aria-labelledby="AdminPanelModalToggleLabel"
            tabIndex="-1"
            data-bs-backdrop="false"
          >
            <div
              className="modal-dialog modal-dialog-centered modal-lg"
              data-bs-backdrop="false"
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h1
                    className="modal-title fs-5"
                    id="AdminPanelModalToggleLabel"
                  >
                    All Users
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  {users.map((user) => (
                    <div
                      key={user._id}
                      className="d-flex justify-content-between align-items-center mb-2 border p-2"
                    >
                      <span>{user.username}</span>
                      <div>
                        <button
                          className="btn btn-sm me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#editUserModal"
                          onClick={() => setSelectedUser(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm"
                          onClick={async () => {
                            if (window.confirm("Delete user?")) {
                              await axios.delete(
                                `https://viss-server.vercel.app/user-delete/${user._id}`
                              );
                              setUsers(
                                users.filter((u) => u._id !== user._id)
                              );
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal fade"
            id="editUserModal"
            aria-hidden="true"
            aria-labelledby="editUserModalLabel"
            tabIndex="-1"
            data-bs-backdrop="false"
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="editUserModalLabel">
                    Edit User
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Categories</label>
                    {categories.map((cat) => (
                      <div key={cat._id} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`edit-cat-${cat._id}`}
                          value={cat._id}
                          checked={editCategory.includes(cat._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditCategory([...editCategory, cat._id]);
                            } else {
                              setEditCategory(
                                editCategory.filter((id) => id !== cat._id)
                              );
                            }
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`edit-cat-${cat._id}`}
                        >
                          {cat.name}
                        </label>
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn btn-success"
                    onClick={async () => {
                      await axios.put(
                        `https://viss-server.vercel.app/user-update/${selectedUser._id}`,
                        {
                          username: editUsername,
                          password: editPassword,
                          category: editCategory,
                        }
                      );
                      alert("User updated!");
                    }}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>


          <div
            className="modal fade"
            id="AboutModal"
            tabIndex="-1"
            aria-labelledby="AboutModalLabel"
            aria-hidden="true"
            data-bs-backdrop="false"
          >
            <div className="modal-dialog modal-dialog-scrollable modal-xl">
              <div className="modal-content shadow-lg rounded-4">
                <div className="modal-header border-bottom shadow-sm">
                  <h1 className="modal-title fs-4 fw-bold text-primary" id="AboutModalLabel">About VISS</h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>

                <div className="modal-body">
                  <section className="mb-4 p-3 border rounded shadow-sm bg-light">
                    <p>
                      <strong>VISS</strong> stands for <strong>Vigilance Information Sharing Software</strong>. It is a modern, visually appealing platform designed for secure information sharing and role-based access.
                    </p>
                  </section>

                  <section className="mb-4 p-3 border-start border-4 border-primary bg-white shadow-sm rounded">
                    <h5 className="text-secondary fw-semibold mb-3">Key Features:</h5>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">🔐 <strong>Admin Control:</strong> Register users, assign designations, manage access.</li>
                      <li className="list-group-item">👤 <strong>User Access:</strong> Users only see assigned profiles or categories.</li>
                      <li className="list-group-item">🗂️ <strong>Category Management:</strong> Full control over creating/editing/deleting categories, sub-categories, and items.</li>
                      <li className="list-group-item">📄 <strong>Item Types:</strong> Redirects to external websites or opens stylish flipbook-style documents.</li>
                      <li className="list-group-item">🎨 <strong>Themes:</strong> Over 5 colorful and modern visual themes to choose from.</li>
                    </ul>
                  </section>

                  <section className="mb-4 p-3 border rounded bg-light shadow-sm">
                    <h6 className="fw-bold text-dark">Contact Admin</h6>
                    <p className="mb-1">
                      <strong>Srinivas Rao</strong><br />
                      Chief Vigilance Enquiry Inspector<br />
                      📞 <a href="tel:9752375075">9752375075</a>
                    </p>
                  </section>

                  <section className="text-center  mt-4">
                    <p className="text-muted mb-2">Application developed by:</p>
                    <div className="blink-box px-3 py-2 border border-2 rounded d-inline-block blink-box">
                      <a
                        href="https://vinayvamsheeresume.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fw-bold text-decoration-none text-dark"
                      >
                        Vinay Vamshee
                      </a>
                    </div>
                  </section>
                </div>

                <div className="modal-footer border-top shadow-sm">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>



          {/* Admin Login Modal */}
          <div
            className="modal fade"
            id="AdminModalToggle"
            aria-hidden="true"
            aria-labelledby="AdminModalToggleLabel"
            tabIndex="-1"
            data-bs-backdrop="false"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="AdminModalToggleLabel">
                    Admin Login
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    name="username"
                    className="form-control mb-2"
                    placeholder="Username"
                    value={loginForm.username}
                    onChange={(e) => handleInputChange(e, setLoginForm)}
                  />
                  <input
                    name="password"
                    type="password"
                    className="form-control mb-2"
                    placeholder="Password"
                    value={loginForm.password}
                    onChange={(e) => handleInputChange(e, setLoginForm)}
                  />
                </div>
                <div className="modal-footer d-flex justify-content-between">
                  <div>
                    <button
                      className="btn btn-warning btn-sm me-3"
                      data-bs-target="#UpdatePasswordModal"
                      data-bs-toggle="modal"
                      data-bs-dismiss="modal"
                    >

                      Update Password
                    </button>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleLogin}
                    data-bs-dismiss="modal"
                  >

                    Login
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Update Password Modal */}
          <div
            className="modal fade"
            id="UpdatePasswordModal"
            aria-hidden="true"
            aria-labelledby="UpdatePasswordLabel"
            tabIndex="-1"
            data-bs-backdrop="false"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="UpdatePasswordLabel">

                    Update Password
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    name="username"
                    className="form-control mb-2"
                    placeholder="Enter your username"
                    value={updateForm.username}
                    onChange={(e) => handleInputChange(e, setUpdateForm)}
                  />
                  <input
                    name="password"
                    type="password"
                    className="form-control mb-2"
                    placeholder="New password"
                    value={updateForm.password}
                    onChange={(e) => handleInputChange(e, setUpdateForm)}
                  />
                  <input
                    name="confirmPassword"
                    type="password"
                    className="form-control mb-2"
                    placeholder="Confirm password"
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-primary btn-sm"
                    data-bs-target="#AdminModalToggle"
                    data-bs-toggle="modal"
                    data-bs-dismiss="modal"
                  >
                    Back to Login
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={handleUpdate}
                    data-bs-dismiss="modal"
                  >

                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Register Modal */}
          <div
            className="modal fade"
            id="RegisterModal"
            aria-hidden="true"
            aria-labelledby="RegisterModalLabel"
            tabIndex="-1"
            data-bs-backdrop="false"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="RegisterModalLabel">

                    New Admin Registration
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    name="fullName"
                    className="form-control mb-2"
                    placeholder="Full Name"
                    value={registerForm.fullName}
                    onChange={(e) => handleInputChange(e, setRegisterForm)}
                  />
                  <input
                    name="phoneNo"
                    className="form-control mb-2"
                    placeholder="Phone Number"
                    value={registerForm.phoneNo}
                    onChange={(e) => handleInputChange(e, setRegisterForm)}
                  />
                  <input
                    name="username"
                    className="form-control mb-2"
                    placeholder="Username"
                    value={registerForm.username}
                    onChange={(e) => handleInputChange(e, setRegisterForm)}
                  />
                  <input
                    name="password"
                    type="password"
                    className="form-control mb-2"
                    placeholder="Password"
                    value={registerForm.password}
                    onChange={(e) => handleInputChange(e, setRegisterForm)}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-primary btn-sm"
                    data-bs-target="#AdminModalToggle"
                    data-bs-toggle="modal"
                    data-bs-dismiss="modal"
                  >

                    Back to Login
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={handleRegister}
                    data-bs-dismiss="modal"
                  >

                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      <div
        className="modal fade"
        id="AddCategoryModal"
        tabIndex="-1"
        aria-labelledby="AddCategoryModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="AddCategoryModalLabel">
                Add Category
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="number"
                name="sNo"
                placeholder="S.No"
                value={categoryForm.sNo}
                onChange={(e) => handleInputChange(e, setCategoryForm)}
                className="form-control mb-2"
              />
              <input
                type="text"
                name="name"
                placeholder="Category Name"
                value={categoryForm.name}
                onChange={(e) => handleInputChange(e, setCategoryForm)}
                className="form-control mb-2"
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={handleAddCategory}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Sub-Category Modal */}
      <div
        className="modal fade"
        id="AddSubCategoryModal"
        tabIndex="-1"
        aria-labelledby="AddSubCategoryModalLabel"
        aria-hidden="true"
        data-bs-backdrop="false"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="AddSubCategoryModalLabel">
                Add SubCategory
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="number"
                name="sNo"
                placeholder="S.No"
                value={subCategoryForm.sNo}
                onChange={(e) => handleInputChange(e, setSubCategoryForm)}
                className="form-control mb-2"
              />
              <input
                type="text"
                name="name"
                placeholder="SubCategory Name"
                value={subCategoryForm.name}
                onChange={(e) => handleInputChange(e, setSubCategoryForm)}
                className="form-control mb-2"
              />
              <select
                name="category"
                value={subCategoryForm.category}
                onChange={(e) => handleInputChange(e, setSubCategoryForm)}
                className="form-select mb-2"
              >
                <option value="">Select Parent Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={handleAddSubCategory}
                data-bs-dismiss="modal"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      <div
        className="modal fade"
        id="AddItemModal"
        tabIndex="-1"
        aria-labelledby="AddItemModalLabel"
        aria-hidden="true"
        data-bs-backdrop="false"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="AddItemModalLabel">
                Add Item
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                name="name"
                placeholder="Item Name"
                value={itemForm.name}
                onChange={(e) => handleInputChange(e, setItemForm)}
                className="form-control mb-2"
              />
              <input
                type="text"
                name="iconUrl"
                placeholder="Icon URL"
                value={itemForm.iconUrl}
                onChange={(e) => handleInputChange(e, setItemForm)}
                className="form-control mb-2"
              />
              <input
                type="text"
                name="link"
                placeholder="Link"
                value={itemForm.link}
                onChange={(e) => handleInputChange(e, setItemForm)}
                className="form-control mb-2"
              />
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  name="document"
                  id="documentCheck"
                  checked={itemForm.document}
                  onChange={(e) => handleInputChange(e, setItemForm)}
                  className="form-check-input"
                />
                <label htmlFor="documentCheck" className="form-check-label">
                  Document
                </label>
              </div>

              {/* Category dropdown */}
              <select
                name="category"
                value={itemForm.category}
                onChange={(e) => {
                  handleInputChange(e, setItemForm);
                  // Clear subCategory when category changes
                  setItemForm((prev) => ({ ...prev, subCategory: "" }));
                }}
                className="form-select mb-2"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* SubCategory dropdown: filter subcategories by selected category */}
              <select
                name="subCategory"
                value={itemForm.subCategory}
                onChange={(e) => handleInputChange(e, setItemForm)}
                className="form-select mb-2"
                disabled={!itemForm.category}
              >
                <option value="">Select SubCategory</option>
                {subCategories
                  .filter((sub) => sub.category === itemForm.category)
                  .map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={handleAddItem}
                data-bs-dismiss="modal"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="Categories">
        {(loggedInAdmin
          ? categories
          : categories.filter((cat) =>
            loggedInUser?.category?.includes(cat._id)
          )
        )
          .sort((a, b) => a.sNo - b.sNo)
          .map((cat) => (
            <div key={cat._id} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="category position-relative">
                {/* Main category name button */}
                <button
                  className={`btn btn-sm ${filterType === cat._id ? "active" : ""}`}
                  onClick={() => handleFilterClick(cat._id)}
                >
                  {cat.name}
                </button>

                {/* Toggle button to show subcategories */}
                <button
                  className={`btn btn-sm ${filterType === cat._id ? "active" : ""}`}
                  style={{ padding: '3px' }}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${cat._id}`}
                  aria-expanded="false"
                  aria-controls={`collapse-${cat._id}`}
                >
                  <i className="fa-solid fa-caret-down"></i>
                </button>

                {/* Subcategory collapsible menu */}

              </div>

              {
                loggedInAdmin && ActivateEditMode ? (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="btn btn-sm btn-info"
                      style={{ width: "fit-content" }}
                      onClick={async () => {
                        const newName = prompt("Enter new name:", cat.name);
                        const newSNo = prompt("Enter new serial number:", cat.sNo);
                        if (newName && newSNo) {
                          try {
                            await axios.put(`https://viss-server.vercel.app/update-category/${cat._id}`, {
                              name: newName,
                              sNo: Number(newSNo),
                            });
                            alert("Category updated.");
                            fetchAllData();
                          } catch (err) {
                            alert("Update failed.");
                          }
                        }
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      style={{ width: "fit-content" }}
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to delete this category?")) {
                          try {
                            await axios.delete(`https://viss-server.vercel.app/delete-category/${cat._id}`);
                            alert("Category deleted.");
                            fetchAllData();
                          } catch (err) {
                            alert("Delete failed.");
                          }
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )
                  :
                  null
              }

            </div>
          ))}
      </div>

      {
        categories.sort((a, b) => a.sNo - b.sNo)
          .map((cat) => {
            return (
              <div
                className="collapse"
                id={`collapse-${cat._id}`}
                style={{ width: "95%" }}
              >
                <ul className="list-group list-group-flush shadow rounded overflow-hidden">
                  {subCategories
                    .filter((sub) => sub.category === cat._id)
                    .sort((a, b) => a.sNo - b.sNo)
                    .map((element) => (
                      <a href={`#sub-${element._id}`}
                        key={element._id}
                        className="list-group-item py-1 px-2 dropDown-item"
                        style={{ cursor: "pointer" }}
                      >
                        {element.name}
                      </a>
                    ))}
                </ul>
              </div>
            )
          })
      }

      {/* {searchText.trim() !== '' && (
        <div className="search-results my-3">
          {
            items
              .filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()))
              .map((item) => {
                const isDocument = item.document === true;
                const link = isDocument
                  ? `/documentation?file=${encodeURIComponent(item.link)}`
                  : item.link;

                return (
                  <div key={item._id} style={{ display: "flex",flexDirection: "column",gap: "5px", width:'23.9%'}}>
                       <a href={link} target="_blank" rel="noreferrer" className="item" >
                      <img src={item.iconUrl} alt={item.name} />
                      <div>{item.name}</div>
                    </a>
                  </div>
                );
              })
          }
        </div>
      )} */}

      <div className="all-items">
        {subCategories
          .filter((sub) => sub.category === filterType)
          .sort((a, b) => a.sNo - b.sNo)
          .map((sub) => (
            <div className="sub-categories" id={`sub-${sub._id}`} key={sub._id}>
              <p className="sub-category-name">
                {sub.name}
                {loggedInAdmin && ActivateEditMode ? (
                  <>
                    <button
                      className="btn btn-outline-info btn-sm ms-1"
                      onClick={async () => {
                        const newName = prompt(
                          "Enter new subcategory name:",
                          sub.name
                        );
                        const newSNo = prompt(
                          "Enter new serial number:",
                          sub.sNo
                        );
                        if (newName && newSNo) {
                          try {
                            await axios.put(
                              `https://viss-server.vercel.app/update-subcategory/${sub._id}`,
                              {
                                name: newName,
                                sNo: Number(newSNo),
                                category: sub.category,
                              }
                            );
                            alert("SubCategory updated");
                            fetchAllData();
                          } catch (err) {
                            alert("Update failed: " + err.message);
                          }
                        }
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="ms-1 btn btn-outline-danger btn-sm"
                      onClick={async () => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this subcategory?"
                          )
                        ) {
                          try {
                            await axios.delete(
                              `https://viss-server.vercel.app/delete-subcategory/${sub._id}`
                            );
                            alert("SubCategory deleted");
                            fetchAllData();
                          } catch (err) {
                            alert("Delete failed: " + err.message);
                          }
                        }
                      }}
                    >
                      Delete
                    </button>
                  </>
                ) : null}
              </p>

              <div className="items">
                {items
                  .filter(item => item.name.toLowerCase().includes(searchText.toLowerCase())).filter((item) => item.subCategory === sub._id)
                  .map((item) => {
                    const isDocument = item.document === true;
                    const link = isDocument
                      ? `/documentation?file=${encodeURIComponent(item.link)}`
                      : item.link;

                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }} >
                        <a
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          className="item"
                          key={item._id}
                        >
                          <img src={item.iconUrl} alt={item.name} />
                          <div className="item-name">{item.name}</div>
                        </a>
                        {loggedInAdmin && ActivateEditMode ? (
                          <div style={{ display: "flex", gap: "5px" }}>
                            <button
                              className="btn btn-sm btn-outline-info"
                              data-bs-toggle="modal"
                              data-bs-target="#ItemEditModal"
                              style={{ width: "fit-content" }}
                              onClick={() => {
                                setSelectedItem(item);
                                setEditForm({
                                  name: item.name,
                                  iconUrl: item.iconUrl,
                                  link: item.link,
                                  document: item.document,
                                  category: item.category,
                                  subCategory: item.subCategory
                                });
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              style={{ width: "fit-content" }}
                              onClick={async () => {
                                const confirmDelete = window.confirm(
                                  `Are you sure you want to delete "${item.name}"?`
                                );
                                if (confirmDelete) {
                                  try {
                                    const res = await axios.delete(
                                      `https://viss-server.vercel.app/delete-item/${item._id}`
                                    );
                                    if (res.status === 200) {
                                      fetchAllData();
                                    } else {
                                      alert("Delete failed");
                                    }
                                  } catch (err) {
                                    alert("Something went wrong.");
                                  }
                                }
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}

                <div className="modal fade" id="ItemEditModal" tabIndex="-1" aria-hidden="true" data-bs-backdrop='false' >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5">Edit Item</h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <input
                          type="text"
                          className="form-control mb-2"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          placeholder="Name"
                        />
                        <input
                          type="text"
                          className="form-control mb-2"
                          value={editForm.iconUrl}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              iconUrl: e.target.value,
                            })
                          }
                          placeholder="Icon URL"
                        />
                        <input
                          type="text"
                          className="form-control mb-2"
                          value={editForm.link}
                          onChange={(e) =>
                            setEditForm({ ...editForm, link: e.target.value })
                          }
                          placeholder="Link"
                        />
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={editForm.document}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                document: e.target.checked,
                              })
                            }
                          />
                          <label className="form-check-label">
                            Is Document
                          </label>
                        </div>
                        {/* Category dropdown */}
                        <select
                          name="category"
                          value={editForm.category}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              category: e.target.value,
                              subCategory: "", // reset subCategory when category changes
                            })
                          }
                          className="form-select mb-2"
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>

                        {/* SubCategory dropdown */}
                        <select
                          name="subCategory"
                          value={editForm.subCategory}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              subCategory: e.target.value,
                            })
                          }
                          className="form-select mb-2"
                          disabled={!editForm.category}
                        >
                          <option value="">Select SubCategory</option>
                          {subCategories
                            .filter((sub) => sub.category === editForm.category)
                            .map((sub) => (
                              <option key={sub._id} value={sub._id}>
                                {sub.name}
                              </option>
                            ))}
                        </select>


                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={async () => {
                            try {
                              const res = await axios.put(
                                `https://viss-server.vercel.app/update-item/${selectedItem._id}`,
                                {
                                  ...editForm,
                                }
                              );
                              if (res.status === 200) {
                                fetchAllData();
                              } else {
                                alert("Update failed");
                              }
                            } catch (err) {
                              alert("Something went wrong.");
                            }
                          }}
                        >
                          Save changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
