"use server";

import {LoginFormSchema, RegisterFormSchema} from "@/lib/rules";
import getCollection from "@/lib/db";
import bcrypt from "bcrypt";
import {redirect} from "next/navigation";
import {createSession} from "@/lib/sessions";
import {cookies} from "next/headers";

export async function register(state: any, formData: { get: (arg0: string) => any; }) {
    //   await new Promise((resolve) => setTimeout(resolve, 1000));

    const validatedFields = await RegisterFormSchema.safeParseAsync({
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error?.flatten().fieldErrors,
            email: formData.get("email"),
        };
    }

    const {email, password} = validatedFields.data;
    const userCollection = await getCollection("users");
    if (!userCollection) return {errors: {email: ["Server error"]}};

    const existingUser = await userCollection.findOne({email});
    if (existingUser) return {errors: {email: ["User already exists"]}};

    const hashedPass = await bcrypt.hash(password, 10);

    const result = await userCollection?.insertOne({email, password: hashedPass});

    await createSession(result.insertedId.toString());

    redirect("/dashboard");
}

export async function login(state: any, formData: { get: (arg0: string) => any; }) {
    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedFields.success) return {
        errors: validatedFields.error?.flatten().fieldErrors,
        email: formData.get("email")
    };

    const {email, password} = validatedFields.data;

    const userCollection = await getCollection("users");
    if (!userCollection) return {errors: {email: ["Server error"]}};

    const user = await userCollection.findOne({email});
    if (!user) return {errors: {email: ["User not found"]}};

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return {errors: {password: ["Password is incorrect"]}};

    await createSession(user._id.toString());

    redirect("/dashboard");
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    redirect("/");
}