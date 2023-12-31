import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { checkToken, postRefreshToken} from "./Authorize";
import UserContext from "./User";
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

function UserDetails() {
    const value = useContext(UserContext)
    const [adminUser, setAdminUser] = useState(value[2])
    const [user, setUser] = useState({})
    const [updateError, setUpdateError] = useState("")
    const updateUser = value[0]
    const navigate = useNavigate()

    const UpdateSchema = Yup.object().shape({
        user_name: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!'),
        password: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!'),
        email: Yup.string().email('Invalid email'),
        admin: Yup.boolean()
    });
    const user_name = user.user_name || ""
    const email = user.email || ""
    const { id } = useParams()

    const deleteProfile = () => {
        const confirm = prompt("Are you sure you want to delete this profile? (y)es or (n)o?")
        if (confirm.toLowerCase() === "y" || confirm.toLowerCase() === "yes") {
        fetch(`/api/v1/users/${id}`, {
            method: "DELETE"
        })
        .then(() => {
            navigate('/user')
        })
        } else {
            toast("No changes made")
        }
    }

    const updateProfile = (values) => {
        const confirm = prompt("Are you sure you want to update this profile? (y)es or (n)o?")
        if (confirm.toLowerCase() === "y" || confirm.toLowerCase() === "yes") {
            fetch(`/api/v1/users/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            })
            .then(res => {
                return res.json();
            })
            .then(data => {
                if (data.errors) {
                    setUpdateError(data.errors);
                    throw (data.errors);
                    return
                }
                toast("This account has been updated!");
            })
            .catch(err => {
                toast(err)
            })
        }
    }

    const get_user = (id) => {
        fetch(`/api/v1/users/${id}`)
        .then(res => {
            if (res.ok) {
                return res.json()
            } else {
                throw (res.statusText)
            }
        })
        .then(data => {
            setUser(data)
        })
        .catch(err => toast(err))
    }
      
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('access_token'))
        if (!token) {
            localStorage.clear()
            navigate('/')
            return
            }
        const refresh_token = JSON.parse(localStorage.getItem('refresh_token'))
        checkToken(token)

        checkToken(token)
        .then(res => {
            if (res.ok) {
            return res.json()
            } else if (res.status === 401) {
            postRefreshToken(refresh_token)
            .then(resp => {
                if (resp.ok) {
                return resp.json()
                } else {
                localStorage.clear()
                toast("Access Has Expired, Please Login Again")
                }
            })
            .then(data => {
                localStorage.setItem("access_token", JSON.stringify(data["access_token"]))
                get_user(id)
            })
            .catch(err => toast(err))
            }
        })
        .then(data => {
            if (data) {
                get_user(id)
            } 
        })
        .catch(err => toast(err))
        
    }, [])
    const toggleChecked = (e) => {
        const temp_user = {...user}
        temp_user.admin = !temp_user.admin
        setUser(temp_user)
    }
    if (!adminUser && !adminUser.admin) {
        return <h1>You are not authorized to view this page!</h1>
    }
    return (
        /*
            <div id="profileContainer">
                <div className="formBox profileBoxRight">
                    <Formik
                        initialValues={{
                        user_name: '',
                        password: '',
                        email: '',
                        }}
                        validationSchema={UpdateSchema}
                        onSubmit={async (values) => {
                            updateProfile(values)
                        }}
                    >
                        {({errors, touched}) => (
                            <Form
                                className="loginForm"
                            >
                                <div>
                                    <label htmlFor="user_name">User Name</label>
                                    <Field
                                        id="user_name"
                                        name="user_name"
                                        placeholder={user_name}
                                        autoComplete="off"
                                        className="loginInput"
                                    />
                                        {errors.user_name && touched.user_name ? (
                                        <span> {errors.user_name}</span>
                                    ) : null}
                                </div>
                                
                                <div>
                                    <label htmlFor="email">Email</label>
                                    <Field
                                        id="email"
                                        name="email"
                                        placeholder={email}
                                        type="email"
                                        autoComplete="off"
                                        className="loginInput"
                                    />
                                    {errors.email && touched.email ? (
                                        <span> {errors.email}</span>
                                    ) : null}
                                </div>

                                <div>
                                    <label htmlFor="password">Password</label>
                                    <Field
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="password"
                                        autoComplete="off"
                                        className="loginInput"
                                    />
                                    {errors.password && touched.password ? (
                                        <span> {errors.password}</span>
                                    ) : null}
                                </div>
                
                                <button
                                    type="submit"
                                    className="submitBtn"
                                >Update</button>


                            </Form>
                        )}
                    </Formik>
                    <button
                        className="deleteBtn"
                        onClick={() => deleteProfile()}
                        >Delete</button>
                    <div>{updateError}</div>
                </div>
            </div>
        */
        <div className="formBackgroundDiv">
        <h2 className="headerH2">User: {user.user_name} / Id: {id}</h2>
        <div className="formBox">
            <Formik
                initialValues={{
                user_name: '',
                password: '',
                email: '',
                admin: user.admin
                }}
                validationSchema={UpdateSchema}
                onSubmit={async (values) => {
                    updateProfile(values)
                }}
            >
                {({errors, touched}) => (
                    <Form
                        className="loginForm"
                    >

                        <div>
                            <label htmlFor="user_name">User Name</label>
                            <Field
                                id="user_name"
                                name="user_name"
                                placeholder={user_name}
                                autoComplete="off"
                                className="loginInput"
                            />
                            {errors.user_name && touched.user_name ? (
                                <span> {errors.user_name}</span>
                            ) : null}
                        </div>
                        
                        <div>
                            <label htmlFor="email">Email</label>
                            <Field
                                id="email"
                                name="email"
                                placeholder={email}
                                type="email"
                                autoComplete="off"
                                className="loginInput"
                            />
                            {errors.email && touched.email ? (
                                <span> {errors.email}</span>
                            ) : null}
                        </div>

                        <div>
                            <label htmlFor="password">Password</label>
                            <Field
                                id="password"
                                name="password"
                                type="password"
                                placeholder="password"
                                autoComplete="off"
                                className="loginInput"
                            />
                            {errors.password && touched.password ? (
                                <span> {errors.password}</span>
                            ) : null}
                        </div>
                        <div>
                            <label htmlFor="admin">Admin</label>
                            <Field
                                id="admin"
                                name="admin"
                                type="checkbox"
                                checked={user.admin}
                                autoComplete="off"
                                onClick={(e) => toggleChecked(e)}
                            />
                            {errors.admin && touched.admin ? (
                                <span> {errors.admin}</span>
                            ) : null}
                        </div>
        
                        <button
                            type="submit"
                            className="submitBtn"
                        >Update</button>

                    </Form>
                )}
            </Formik>
            <button
                className="deleteBtn"
                onClick={() => deleteProfile()}
                >Delete</button>
            <div>{updateError}</div>
            <div>{updateError}</div>
        </div>
        </div>
    )
};

export default UserDetails;