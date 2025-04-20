import getCollection from "@/lib/db";
import {ObjectId} from "bson";
import PostCard from "@/components/PostCard";

export default async function Show({params}) {
    const {id} = await params;

    const postCollection = await getCollection("posts");
    const post = id.length === 24 ? await postCollection?.findOne({
        _id: ObjectId.createFromHexString(id)
    }) : null;

    return (
        <div className="container w-1/2">
            {post ? <PostCard post={post}/> : <p>Post not found</p>}
        </div>
    );
}