"use client"
import { useEffect, useState } from "react";
import { TaskObj } from "./TaskObj";
import Sidebar from "@/components/custom/sidebar"
// import TaskBox from "@/components/custom/taskBox"
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import { BadgePlus, Pencil, Trash2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
  

interface apiResponseTask {
    allTasks: TaskObj[];
    user_id : string;
}

export default function page() {
    const [allTasks, setAllTasks] = useState<TaskObj[]>([]);
    const [update, setUpdate] = useState(false);
    const [user, setUser] = useState<string | null>();
    const [title, setTitle] = useState("");
    const [date, setDate] = useState<Date>();
    const [tags, setTags] = useState<string[]>([]);
    const [priority, setPriority] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    
    
    useEffect(() => {
        const fetchData = async () => {
          const response = await fetch("/api/taskData");
          const result: apiResponseTask = await response.json();
          const tasks = result.allTasks.map((task) => TaskObj.fromAPI(task));
          setAllTasks(tasks);
          setUser(result.user_id)
          allTasks.forEach(tasks => {
            console.log("Task complete status" + tasks.getDueDate())
          })
          console.log("This is user!" + user)
        };
        fetchData();
      }, [update]); 

      async function addNewTask() {
        if (priority > 3 || priority < 0) {
          toast("Make sure priority is either 1, 2 or 3!");
        } else {
        const response = await fetch('/api/taskData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            priority,
            tags,
            dueDate: date?.toISOString(),
            user_id: user 
          }),
        });
        if (response.ok) {
            toast('Task added successfully');
            setUpdate(!update);
          } else {
            const errorData = await response.json();
            console.error('Error adding task:', errorData.error);
          }
        

        }
    }

    async function deleteTask(id: number) {
        const response = await fetch('/api/taskData', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id : id,
            user_id: user, 
          }),
        });
    
        if (response.ok) {
          toast('Task deleted successfully');
          setAllTasks((prevTasks) => prevTasks.filter((task) => task.getId() !== id));
          setUpdate(!update);
        } else {
          const errorData = await response.json();
          console.error('Error deleting task:', errorData.error);
        }
    }

    async function updateTask(id: number, checked : boolean) {
      const task = allTasks.find((task) => task.getId() === id);
      console.log("Updating task with:", {
        id : id,
        title : title,
        priority : priority,
        tags : tags,
        dueDate: date?.toISOString(),
        user_id: user,
        isComplete : checked,

      })
      const response = await fetch('/api/taskData', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          title,
          priority,
          tags : tags,
          dueDate: date?.toISOString() || new Date().toISOString(),
          user_id: user,
          isComplete : checked
        })
      })
  
      if (response.ok) {
        console.log('Task updated successfully');
        setUpdate(!update); 
        toast("Task updated successfully")
      } else {
        const errorData = await response.json();
        console.error('Error updating task:', errorData.error);
      }
    }    
      
    

    return(
        <>
            <Sidebar />
                <Popover>
                    <PopoverTrigger className="fixed right-1 m-3 top-0 rounded-full">
                    <HoverCard openDelay={5} closeDelay={5} >
                        <HoverCardTrigger>
                            <BadgePlus />
                        </HoverCardTrigger>
                        <HoverCardContent className="ease-in animate-bounce mt-3 text-sm justify-center m-1 w-36 h-10">
                            Add New Task
                        </HoverCardContent>
                    </HoverCard>
                    </PopoverTrigger>
                    <PopoverContent avoidCollisions side="bottom" align="center" className="max-h-96 overflow-auto">
                    <h4>New Task</h4>
                    <Input
                        type="text"
                        placeholder="new task name"
                        onChange={(e) => setTitle(e.target.value)}
                        className="mb-2"
                    />
                    <Input
                        type="text"
                        placeholder="new priority"
                        onChange={(e) => setPriority(Number(e.target.value))}
                        className="mb-2"
                    />
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border mb-2"
                    />
                    <Input
                        type="text"
                        placeholder="new tags"
                        onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
                        className="mb-2"
                    />
                    <Button onClick={() => addNewTask()}>
                        Save Task
                    </Button>
                    </PopoverContent>
                </Popover>
                <div className="ml-[4%] w-[95vw] h-[77vh]">
                    {allTasks?.map((task)=> (
                      <div key={task.getId()}>
                        <div className="m-6 relative w-[12vw] min-h-[15vh] rounded-md shadow-md border-2 border-gray-200 p-4 flex flex-col justify-between">
                        <Button variant="outline" className="w-10 absolute -top-2 -right-2 rounded-full" onClick={() => {deleteTask(task.getId())}}><Trash2/></Button>
                        <Button variant="outline" className="w-10 absolute top-1/2 -translate-y-1/2 -right-5 rounded-full">{task.getPriority()}</Button>
                        <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-10 absolute -bottom-2 -right-2 rounded-full"><Pencil />
                  </Button>      
                </PopoverTrigger>
                <PopoverContent>
                  <h4> Update Task </h4>
                  <Input
                    type="text"
                    placeholder="new task name"
                    onChange={(e) => setTitle(e.target.value)}
                    className="mb-2"
                  />
                  <Input
                    type="text"
                    placeholder="new priority"
                    onChange={(e) => {
                      setPriority(Number(e.target.value))}}
                    className="mb-2"
                  />
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border mb-2"
                  />
                  <Input
                    type="text"
                    placeholder="new tags"
                    onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
                    className="mb-2"
                  />
                  <Button onClick={() => updateTask(task.getId(), task.getIsCompleted())}>
                    Save Task
                  </Button>
                </PopoverContent>
              </Popover>
                        <div className="flex items-center gap-2">
                          <Checkbox id={`task-${task.getId()}`} checked={task.getIsCompleted()} onCheckedChange={(checked) => {
                            const newStatus = checked === "indeterminate" ? false : checked;
                            setIsComplete(newStatus);
                            updateTask(task.getId(), newStatus);
}} />
                          <p className="text-sm pb-0.5">{task.getTitle() || "Grab some milk"}</p>
                        </div>
                        <div>
                          <p className="text-sm truncate pb-0.5">Due: {task.getDueDate().toLocaleDateString()}</p>
                        </div>
                        <div className="flex flex-wrap gap-1">
                        {task.getTags().map((tag, index) => (
                            <Badge
                              variant="outline"
                              key={index}
                              className="text-xs max-w-full truncate"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>   
                      </div>
                    ))}
                </div>

            
        </>
    )

  
  }