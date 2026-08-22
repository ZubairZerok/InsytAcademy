"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function login(formData: FormData) {
    const supabase = createClient();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/academy");
}

export async function signup(formData: FormData) {
    const supabase = createClient();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("full_name") as string;
    const sector = formData.get("sector") as string;
    const subSector = formData.get("sub_sector") as string;

    // Server-side validation (HTML minLength can be bypassed)
    if (!email || !password || !fullName) {
        return { error: "All fields are required." };
    }
    if (password.length < 6) {
        return { error: "Password must be at least 6 characters." };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { error: "Please enter a valid email address." };
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                sector: sector,
                sub_sector: subSector,
            },
        },
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/academy");
}

export async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/login");
}

export async function forgotPassword(formData: FormData) {
    const supabase = createClient();
    const email = formData.get("email") as string;
    const headersList = headers();

    // 'origin' already includes the protocol. 'host' does not so we build it.
    const rawOrigin = headersList.get('origin');
    const host = headersList.get('host');
    let origin: string;
    if (rawOrigin) {
        origin = rawOrigin;
    } else if (host) {
        origin = host.startsWith('localhost') ? `http://${host}` : `https://${host}`;
    } else {
        origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    }

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${origin}/auth/callback?next=/update-password`,
        });

        if (error) {
            console.error("Supabase Reset Password Error:", error.message);
            return { error: error.message };
        }
    } catch (err) {
        console.error("Critical error in forgotPassword action:", err);
        return { error: "Service unavailable. If your project was paused, please wait a moment and try again." };
    }

    return { success: "Check your email for the password reset link." };
}

export async function updatePassword(formData: FormData) {
    const supabase = createClient();
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.updateUser({
        password: password,
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/academy");
}

