import { useState } from "react";

const CommentForm = ({ loading, error, onSubmit, autoFocus = false, inititlaValue = "", }) => {

    const [message, setMessage] = useState(inititlaValue);

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(message).then(() => setMessage(""))
    }

    return <form onSubmit={handleSubmit}>
        <div className="comment-form-row">
            <textarea
                autoFocus={autoFocus}
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="message-input"
            />
            <button className="btn" disabled={loading} type="submit">
                {loading ? "Loading.." : "Post"}
            </button>
        </div>
        <div className="error-msg">{error}</div>
    </form>
}

export default CommentForm;