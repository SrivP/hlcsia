import { getUserId } from "@/app/login/action";
import { supabase } from "../supabase";
import { NextRequest, NextResponse } from "next/server";
import { TimeObj } from "@/app/stats/TimeObj";



export async function GET() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();
    const userId = await getUserId();
    console.log(userId);
    if (!userId) {
      return new Response(JSON.stringify({ error: "User not authenticated" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  
    // ai code fix pls
    const { data : timeData } = await supabase.from('time').select().eq('user_id', '8a06959d-477f-45a0-bd87-f9191618de99').gte('created_at', startOfDay)
    .lt('created_at', endOfDay);
    const { data : allTimeData } = await supabase.from('time').select().eq('user_id', userId)
    if (!timeData) {
      return new Response(JSON.stringify({ error: "No data found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (timeData.length === 0) {
      timeData.push({ seconds: 0 });
    }
    const seconds: number = timeData[0].seconds;
    const times : TimeObj[] = [];
      allTimeData?.map((time) => {
        times.push(TimeObj.fromAPI(time));
    })
    
    const rdata = {
      seconds: seconds,
      user_id : userId,
      allTimeData : times
    };
    return new Response(JSON.stringify(rdata), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  
  export async function POST(request : NextRequest) {
    const user_id = await getUserId();
    const {seconds, created_at } = await request.json();
    const { error } = await supabase.from('time').insert({
      seconds,
      created_at,
      user_id,
    })
    console.log("this is user id " + user_id)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Task updated successfully: seconds ' + seconds }, { status: 200 });
  }