import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';


function Login () {

    const [loginError, setLoginError] = useState("")

    const navigate = useNavigate();

    const LoginSchema = Yup.object().shape({
        password: Yup.string()
          .min(2, 'Too Short!')
          .max(50, 'Too Long!')
          .required('Required'),
        email: Yup.string().email('Invalid email').required('Required'),
      });

    return (
        <div>
            <h2>Login</h2>
            <Formik
                initialValues={{
                password: '',
                email: '',
                }}
                validationSchema={LoginSchema}
                onSubmit={async (values) => {
                    fetch("/user_login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(values)
                    })
                    .then(res => {
                        return res.json();
                    })
                    .then(data => {
                        if (!data.access_token) {
                            setLoginError("Invalid Creditials");
                            throw ("Access Denied");
                        }
                        console.log("User -", data)
                        setLoginError("Successful Login");
                        // alert("Thank you for being you!");
                        // navigate('/main');
                    })
                    .catch(err => {
                        alert(err)
                    })
                    // navigate('/main')
                }}
            >

                {({ errors, touched }) => (
                    <Form>

                        <div>
                            <label htmlFor="email">Email</label>
                            <Field
                                id="email"
                                name="email"
                                placeholder="john@blaze.com"
                                type="email"
                                autoComplete="off"
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
                            />
                        </div>

                        <button type="submit">Submit</button>

                    </Form>
                )}

            </Formik>

            <div>{loginError}</div>
        </div>
    )
};

export default Login;