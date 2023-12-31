import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { checkToken, postRefreshToken} from "./Authorize";
import PostContext from "./Post";
import PostCard from "./PostCard";
import { v4 as uuid } from 'uuid';

function Posts() {

  const [posts, setPosts] = useState([])
  const navigate = useNavigate()

  const get_posts = (post_token) => {
    fetch('/api/v1/posts', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${post_token}`
      }
    })
    .then(res => {
      if (res.ok) {
        return res.json()
      }
    })
    .then(data => {
      if (data) {
        setPosts(data)
      }
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
          get_posts(data["access_token"])
        })
        .catch(err => toast(err))
      }
    })
    .then(data => {
      if (data) {
        get_posts(token)
      }
    })
    .catch(err => toast(err))
    
    }, [])
  
    if (posts.length === 0) {
      return (
        <div id="loading">
          <h2 className="headerH2">Loading...</h2>
        </div>
      )
    }

  return (
    <>
      <Toaster />
      <h2 className="headerH2">Posts</h2>
      <div id="postsMain">
      <div id="postsContainer" className="outerContainer">{posts.map((item, idx) => {
          if (idx < Math.ceil(posts.length / 3)) {
            return (
              <PostContext.Provider key={uuid()} value={item}>
                <PostCard />
              </PostContext.Provider>
            )
          }
        })}</div>
        <div id="postsContainer" className="innerContainer">{posts.map((item, idx) => {
          if (idx >= Math.ceil(posts.length / 3) && idx < (posts.length - Math.ceil(posts.length / 3))) {
            return (
              <PostContext.Provider key={uuid()} value={item}>
                <PostCard />
              </PostContext.Provider>
            )
          }
        })}</div>
        <div id="postsContainer" className="outerContainer">{posts.map((item, idx) => {
          if (idx >= (posts.length - Math.ceil(posts.length / 3))) {
            return (
              <PostContext.Provider key={uuid()} value={item}>
                <PostCard />
              </PostContext.Provider>
            )
          }
        })}</div>
      </div>
    </>
  );
}

export default Posts;