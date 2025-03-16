import { TaskObj } from "@/app/tasks/TaskObj";
import { getUserId } from "@/app/login/action";
import { supabase } from "../supabase";
import { NextRequest, NextResponse } from "next/server";





export async function GET() {
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

  const { data } = await supabase.from('tasks').select().eq('user_id', userId);
  const moreTasks : TaskObj[] = [];
  data?.map((tasks) => {
    moreTasks.push(new TaskObj(tasks.id, userId, tasks.title, tasks.priority, tasks.tags, tasks.isComplete, tasks.dueDate))
  })
  const rdata = {
    allTasks: moreTasks,
    user_id : userId
  };
  return new Response(JSON.stringify(rdata), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(request: NextRequest) {
  console.log("I was called!!")
  const userId = await getUserId();
  const { title, priority, tags, dueDate } = await request.json();
  console.log("This is date new " + dueDate)
  const { error } = await supabase.from('tasks').insert({
    title,
    priority,
    tags: tags,
    dueDate : dueDate,
    user_id : userId,
    isComplete: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Task added successfully' }, { status: 200 });
}




export async function DELETE(request: NextRequest) {
  const userId = await getUserId();
  const {id} = await request.json();
  const { error } = await supabase.from('tasks').delete().eq('id', id).eq('user_id', userId);
  console.log("here it is", id, userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
}


export async function PUT(request : NextRequest) {
  const userId = await getUserId();
  const { id, title, priority, tags, dueDate, isComplete} = await request.json();
  const { error } = await supabase.from('tasks').update({
    title,
    priority,
    tags: tags,
    dueDate: dueDate,
    isComplete,
  }).eq('id', id).eq('user_id', userId)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ message: 'Task updated successfully' }, { status: 200 });
}