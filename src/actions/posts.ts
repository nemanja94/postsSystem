"use server";

import getAuthUser from "@/lib/getAuthUser";
import {redirect} from "next/navigation";
import {BlogPostSchema} from "@/lib/rules";
import getCollection from "@/lib/db";
import {ObjectId} from "bson";
import {revalidatePath} from "next/cache";

export async function createPost(state: any, formData: any) {
    const user = await getAuthUser();

    if (!user) return redirect("/");

    const title = formData.get("title");
    const content = formData.get("content");

    const validatedFileds = BlogPostSchema.safeParse({
        title, content
    })

    if (!validatedFileds.success) return {errors: validatedFileds.error.flatten().fieldErrors, title, content};

    try {
        const postsCollection = await getCollection("posts");
        if (!postsCollection) return {errors: {title: ["Server error"]}}
        const post = {
            title: validatedFileds.data.title,
            content: validatedFileds.data.content,
            userId: ObjectId.createFromHexString(<string>user?.userId),
        }

        await postsCollection.insertOne(post);
    } catch (error) {
        return {
            errors: {
                title: error?.message
            }
        }
    }

    redirect("/dashboard");
}

export async function editPost(state: any, formData: any) {
    const user = await getAuthUser();
    if (!user) return redirect("/");

    const title = formData.get("title");
    const content = formData.get("content");
    const postId = formData.get("postId");

    const validatedFileds = BlogPostSchema.safeParse({
        title, content
    })

    if (!validatedFileds.success) return {errors: validatedFileds.error.flatten().fieldErrors, title, content};

    const postsCollection = await getCollection("posts");
    const post = await postsCollection?.findOne({
        _id: ObjectId.createFromHexString(postId)
    });

    if (user.userId !== post?.userId.toString()) return redirect("/");

    postsCollection?.findOneAndUpdate({_id: post?._id}, {
        $set: {
            title: validatedFileds.data.title,
            content: validatedFileds.data.content
        }
    });

    redirect("/dashboard");
}

export async function deletePost(formData: any) {
    const user = await getAuthUser();
    if (!user) return redirect("/");

    const postsCollections = await getCollection("posts");
    const post = await postsCollections?.findOne({
        _id: ObjectId.createFromHexString(formData.get("postId"))
    });

    if (user.userId !== post?.userId.toString()) return redirect("/");

    postsCollections?.findOneAndDelete({
        _id: post?._id
    });

    revalidatePath("/dashboard");
}