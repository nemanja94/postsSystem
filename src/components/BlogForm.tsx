"use client";

import {useActionState} from "react";

export default function BlogForm({handler, post}: any) {
    const [state, action, isPending] = useActionState(handler, undefined);

    return (
        <form action={action} className="space-y-4">
            <input type="hidden" name="postId" value={post?._id}/>
            <div>
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    name="title"
                    id="title"
                    defaultValue={state?.title || post?.title}
                />
                {state?.errors?.title && (
                    <p className="error">{state.errors.title}</p>
                )}
            </div>

            <div>
                <label htmlFor="content">Content</label>
                <textarea
                    rows={6}
                    name="content"
                    id="content"
                    defaultValue={state?.content || post?.content}
                ></textarea>
                {state?.errors?.content && (
                    <p className="error">{state.errors.content}</p>
                )}
            </div>

            <button className="btn-primary" disabled={isPending}>{isPending ? "Saving..." : "Save"}</button>
        </form>
    )
}