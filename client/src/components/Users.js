import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "./User";
import UserCard from "./UserCard";
import { v4 as uuid } from 'uuid'

function Users() {

  const [users, setUsers] = useState([])
  const navigate = useNavigate()

  const adminUser = useContext(UserContext)

  const checkToken = (acc_token) => fetch("/check_token", {
    headers: {
      "Authorization": `Bearer ${acc_token}`
    }
  })

  const postRefreshToken = (ref_token) => {
    return fetch("/refresh", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ref_token}`
      }
    })
  }

  const get_users = (user_token) => {
    fetch('/users', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user_token}`
      }
    })
    .then(res => {
      if (res.ok) {
        return res.json()
      }
    })
    .then(data => {
        if (data) {
            setUsers(data)
        }
    })
    .catch(err => alert(err))
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
            alert("Access Has Expired, Please Login Again")
          }
        })
        .then(data => {
          localStorage.setItem("access_token", JSON.stringify(data["access_token"]))
          get_users(data["access_token"])
        })
        .catch(err => alert(err))
      }
    })
    .then(data => {
      if (data) {
        get_users(token)
      }
    })
    .catch(err => alert(err))
    
    }, [])

    if (!adminUser[2] || !adminUser[2].admin) {
        return <h1>You are not authorized to view this page!</h1>
    }

    return (
        <>
            <h2>Users</h2>
            <div>{users.map((item, idx) => {
                return (
                // <UserContext.Provider>
                    <UserCard  key={uuid()} user={item} />
                // </UserContext.Provider>
                )

            })}</div>
        </>
    );
}

export default Users;