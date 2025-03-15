import { supabase } from "@/app/api/supabase";
import { createClient } from '@/utils/server'


export async function getUser() {
    const {data, error} = await supabase.auth.getUser();
    console.log(data.user)
    if (error || !data?.user) {
        throw new Error("User not found or User credentials wrong");
    }
    return data.user.id;
}

export async function getUserId() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id;
}