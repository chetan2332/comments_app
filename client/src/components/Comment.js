import IconBtn from "./IconBtn";
import { FaEdit, FaHeart, FaReply, FaTrash } from "react-icons/fa"
import { usePost } from "../contexts/PostContexts";
import CommentList from "./CommentList"
import { useState } from "react";
import CommentForm from "./CommentForm";
import { useAsyncFn } from "../hooks/useAsync";
import { createComment, deleteComment, updateComment } from "../services/comments";
// import { useUser } from "../hooks/useUser";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
})

const Comment = ({ id, message, user, createdAt }) => {
    const { post, getReplies, createLocalComment, updateLocalComment, deleteLocalComment } = usePost();
    const childComments = getReplies(id);
    const [isReplying, setIsReplying] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [areChildrenHidden, setAreChildrenHidden] = useState(false);
    const createCommentFn = useAsyncFn(createComment)
    const updateCommentFn = useAsyncFn(updateComment)
    const deleteCommentFn = useAsyncFn(deleteComment)
    // const currentUser = useUser()

    const onCommentReply = (message) => {
        return createCommentFn.execute(
            {
                postId: post.id,
                message,
                parentId: id
            }
        ).then(
            async comment => {
                await comment
                setIsReplying(false)
                createLocalComment(comment)
            }
        )
    }

    const onCommentUpdate = (message) => {
        return updateCommentFn.execute(
            {
                postId: post.id,
                message,
                id
            }
        ).then(
            async comment => {
                await comment
                setIsEditing(false)
                console.log(comment)
                updateLocalComment({ id, message: comment.message })
            }
        )
    }

    const onCommentDelete = (_) => {
        return deleteCommentFn.execute(
            {
                postId: post.id,
                id
            }
        ).then(comment => deleteLocalComment(comment.id))
    }

    return (
        <>
            <div className="comment">
                <div className="header">
                    <span className="name">{user.name}</span>
                    <span className="date">
                        {dateFormatter.format(Date.parse(createdAt))}
                    </span>
                </div>
                {isEditing ?
                    <CommentForm
                        autoFocus
                        inititlaValue={message}
                        onSubmit={onCommentUpdate}
                        loading={updateCommentFn.loading}
                        error={updateCommentFn.error}
                    /> :
                    (<div className="message">{message}</div>)
                }
                <div className="footer">
                    <IconBtn Icon={FaHeart} aria-label="Like">
                        2
                    </IconBtn>
                    <IconBtn
                        onClick={() => setIsReplying(prev => !prev)}
                        isActive={isReplying}
                        Icon={FaReply}
                        aria-label={isReplying ? "Cancel Reply" : "Reply"}
                    />
                    {(
                        <>
                            <IconBtn
                                onClick={() => setIsEditing(prev => !prev)}
                                isActive={isEditing}
                                Icon={FaEdit}
                                aria-label={isEditing ? "Cancel Edit" : "Edit"}
                            />
                            <IconBtn
                                Icon={FaTrash}
                                aria-label="delete"
                                color="danger"
                                onClick={onCommentDelete}
                                isActive={!deleteCommentFn.loading}
                            />
                        </>
                    )}
                </div>
            </div>
            {deleteCommentFn.error && (
                <div className="error-msg mt-1">{deleteCommentFn.error}</div>
            )}
            {isReplying && (
                <div className="mt-1">
                    <CommentForm
                        autoFocus={true}
                        onSubmit={onCommentReply}
                        loading={createCommentFn.loading}
                        error={createCommentFn.error}
                    />
                </div>
            )}
            {childComments?.length > 0 && (
                <>
                    <div className={`nested-comments-stack ${areChildrenHidden ? "hide" : ""}`}>
                        <button className="collapse-line" aria-label="Hide Replies" onClick={() => setAreChildrenHidden(true)} />
                        <div className="nested-comments">
                            <CommentList comments={childComments} />
                        </div>
                    </div>
                    <button className={`btn mt-1 ${!areChildrenHidden ? "hide" : ""}`} onClick={() => setAreChildrenHidden(false)}>
                        Show Replies
                    </button>
                </>
            )}
        </>
    )
}

export default Comment;