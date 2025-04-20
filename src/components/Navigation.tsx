import NavLink from "@/components/NavLink";
import React from "react";
import getAuthUser from "@/lib/getAuthUser";
import {logout} from "@/actions/auth";

export default async function Navigation() {
    const authUser = await getAuthUser();

    return (
        <nav>
            <NavLink label="Home" path={"/"}/>
            {authUser ?
                (
                    <div className="flex items-center">
                        <NavLink label={"New Post"} path={"/posts/create"}/>
                        <NavLink label={"Dashboard"} path={"/dashboard"}/>
                        <form action={logout}>
                            <button className="nav-link">Logout</button>
                        </form>
                    </div>
                )
                :
                (
                    <div>
                        <NavLink label={"Register"} path={"/register"}/>
                        <NavLink label={"Login"} path={"/login"}/>
                    </div>
                )
            }
        </nav>
    );
}