import { makeRequest } from "./makeRequest"

export const createComment = ({ postId, message, parentId }) => {
    return makeRequest(`posts/${postId}/comments`, {
        method: "POST",
        data: { message, parentId },
    })
}

export const updateComment = ({ postId, message, id }) => {
    return makeRequest(`posts/${postId}/comments/${id}`, {
        method: "PUT",
        data: { message },
    })
}

export const deleteComment = ({ postId, id }) => {
    return makeRequest(`posts/${postId}/comments/${id}`, {
        method: "DELETE"
    })
}