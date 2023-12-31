import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import PostContext from "./Post";
import UserContext from "./User";
import { v4 as uuid } from 'uuid';

function PostCard() {
    const navigate = useNavigate();
    const value = useContext(PostContext);
    const userValue = useContext(UserContext);
    const user = userValue[2];
    const description = value.description.length > 100 ? (value.description.slice(0, 97) + "...") : value.description;
    const displayPost = () => {
        navigate(`/posts/${value.id}`)
    }
    return (
        <div className="postBox posts" onClick={displayPost}>
            <div id="postCardBox">
                <h2 className={user.id === value.honoree.id ? "myPost" : ""}>Honoring: {value.honoree["user_name"]} / Id: {value.honoree["id"]}</h2>
                <img src={value.image} alt="post image" />
                <p>{value.description}</p>
                <h3 className={user.id === value.post_author.id ? "myPost" : ""}>Author: {value.post_author.user_name} / Id: {value.post_author.id}</h3> 
                <h4>Comments: {value.comments.length}</h4>
            </div>
        </div>
    )
}

export default PostCard;