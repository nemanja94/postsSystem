import BlogForm from "@/components/BlogForm";
import getCollection from "@/lib/db";
import {ObjectId} from "bson";
import {editPost} from "@/actions/posts";
import getAuthUser from "@/lib/getAuthUser";
import {redirect} from "next/navigation";

export default async function EditPost({params}) {
    const {id} = await params;
    const user = await getAuthUser();
    const postsCollection = await getCollection("posts");
    let post;

    if (id.length === 24 && postsCollection) {
        post = await postsCollection.findOne({
            _id: ObjectId.createFromHexString(id)
        });
        post = JSON.parse(JSON.stringify(post));
        if (user?.userId !== post?.userId) return redirect("/");
    } else {
        post = null;
    }


    return (
        <div className="container w-1/2">
            <h1 className="title">Edit your Post</h1>
            {post ? <BlogForm handler={editPost} post={post}/> : <p>Post not found</p>}
        </div>
    );
}