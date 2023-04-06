import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { getPost } from "../services/posts";

const Context = React.createContext()

export const usePost = () => {
    return useContext(Context)
}

const PostProvider = ({ children }) => {
    const { id } = useParams()
    const { loading, error, value: post } = useAsync(() => getPost(id), [id])
    const [comments, setComments] = useState([]);
    const commentsByParentId = useMemo(() => {
        const group = {}
        if (comments == null) return []
        comments.forEach(comment => {
            group[comment?.parentId] ||= []
            group[comment?.parentId].push(comment)
        })
        return group
    }, [comments])

    useEffect(() => {
        if (post?.comments === null) return
        else setComments(post?.comments)
        console.log(post?.comments)
    }, [post?.comments])

    const getReplies = (parentId) => {
        return commentsByParentId[parentId]
    }

    const createLocalComment = (comment) => {
        setComments(prevComments => {
            return [comment, ...prevComments]
        })
    }

    const updateLocalComment = ({ id, message }) => {
        setComments(prevComments => {
            return prevComments.map(comment => {
                if (comment.id === id) {
                    return { ...comment, message }
                } else {
                    return comment
                }
            })
        })
    }

    const deleteLocalComment = (id) => {
        setComments(prevComments => {
            return prevComments.filter(comment => comment.id !== id)
        })
    }

    return <Context.Provider
        value={{
            post: { id, ...post },
            getReplies,
            rootComments: commentsByParentId[null],
            createLocalComment,
            updateLocalComment,
            deleteLocalComment,
        }} >
        {
            loading ? <h1>Loading...</h1>
                : error ? (
                    <h1 className="error-msg">{error}</h1>
                ) : children
        }
    </Context.Provider>
}

export default PostProvider;