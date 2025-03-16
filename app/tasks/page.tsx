"use client"
import { useEffect, useState } from "react";
import { TaskObj } from "./TaskObj";
import Sidebar from "@/components/custom/sidebar"
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
import { ArrowUp01 } from 'lucide-react';
import { ArrowUp10 } from 'lucide-react';

  

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
    const [priority, setPriority] = useState(3);
    const [isComplete, setIsComplete] = useState(false);
    const [taskid, setTaskId] = useState<number[]>([]);
    const [priorityList, setPriorityList] = useState<number[]>([]);
    
    

    
    useEffect(() => {
        const fetchData = async () => {
          const response = await fetch("/api/taskData");
          const result: apiResponseTask = await response.json();
          const tasks = result.allTasks.map((task) => TaskObj.fromAPI(task));
          const ids = tasks.map((task) => task.getId());
          setTaskId(ids);
          setAllTasks(tasks);
          setUser(result.user_id)

        };
        fetchData();
      }, [update]); 

      async function addNewTask() {
        let id = Math.random() * 9223372036854775807;
        for (let o = 0; o < taskid?.length; o++) {
          if (id === taskid[o]) {
            id = Math.random() * 9223372036854775807;
            o = 0;
          }
        }
        if (title === "") {
          toast("Please enter a title for the task!");
          return;

        }
        if (date === undefined) {
          toast("Please enter a due date for the task!");
          return;
        }
        let task = new TaskObj(id, user || "", title, priority, tags, isComplete, date);
        setAllTasks(prevTasks => ([...prevTasks, task]))
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
            date,
            user,
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
        const task = allTasks.find((task) => task.getId() === id);
        setAllTasks((prevTasks) => prevTasks.filter((task) => task.getId() !== id));
        toast('Task deleted successfully');
        const response = await fetch('/api/taskData', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id
          }),
        });
        
        if (response.ok) {
          setUpdate(!update);
        } else {
          if (task) {
            setAllTasks((prevTasks) => [...prevTasks, task]);
          }
          const errorData = await response.json();
          console.error('Error deleting task:', errorData.error);
        }
    }

    async function updateCheckedTask(id: number, checked : boolean) {
      const taskidx = allTasks.findIndex((task) => task.getId() === id);
      const task = allTasks.find((task) => task.getId() === id);
      allTasks[taskidx].setIsCompleted(checked);
      
      toast("Task updated successfully")

      const response = await fetch('/api/taskData', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          title : task?.getTitle(),
          priority : task?.getPriority(),
          tags : task?.getTags(),
          dueDate: date?.toISOString() || new Date().toISOString(),
          user_id: user,
          isComplete : checked
        })
      })
  
      if (response.ok) {
        setUpdate(!update); 
      } else {
         if (task) {
          allTasks[taskidx].setIsCompleted(!checked);
         }
        const errorData = await response.json();
        console.error('Error updating task:', errorData.error);
      }
    }
    
    async function updateTask (id : number) {
      const task = allTasks.find((task) => task.getId() === id);
      task?.setTitle(title);
      task?.setPriority(priority);
      task?.setTags(tags);
      task?.setDueDate(date ? date : task?.getDueDate() || new Date());
      task?.setIsCompleted(isComplete);

      const updatedData = {
        id,
        title: title,
        priority: priority,
        tags: tags,
        dueDate: date ? date.toISOString() : task?.getDueDate()?.toISOString() || new Date().toISOString(),
        user_id: user,
        isComplete: task?.getIsCompleted() 
      };
      
      const response = await fetch('/api/taskData', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      })
  
      if (response.ok) {
        setUpdate(!update); 
        toast("Task updated successfully")
      } else {
        const errorData = await response.json();
        console.error('Error updating task:', errorData.error);
      }

    }
    
    function captureTaskData(task : TaskObj) {
      setTitle(task.getTitle());
      setPriority(task.getPriority());
      setTags(task.getTags());
      setDate(task.getDueDate());
      console.log(title, priority, tags, date);
    }

    function mergeSortAscending(arr : TaskObj[], left : number, right : number) {
      if (left < right) {
      let middle = Math.floor((left + right) / 2);
      mergeSortAscending(arr, left, middle);
      mergeSortAscending(arr, middle + 1, right);
      merge(arr, left, right, middle);
      }
      function merge(arr : TaskObj[], left : number, right: number, middle: number) {
        let l1 = middle - left + 1;
        let l2 = right - middle;
        let a1 = new Array(l1);
        let a2 = new Array(l2);

        for (let i = 0; i < l1; i++) {
          a1[i] = arr[left + i];
        }

        for (let j = 0; j < l2; j++) {
          a2[j] = arr[middle + 1 + j];
        }

        let i = 0;
        let j = 0;
        let k = left;

        while (i < l1 && j < l2) {
          if (a1[i].getPriority() < a2[j].getPriority()) {
            arr[k] = a1[i];
            i++;
          } else {
            arr[k] = a2[j];
            j++;
          }
          k++;
        }

        while (i < l1) {
          arr[k] = a1[i];
          i++;
          k++;
        }

        while (j < l2) {
          arr[k] = a2[j];
          j++;
          k++;
        }
      }
      toast("Tasks sorted by ascending priority")
      setAllTasks([...arr]);
    }

    function mergeSortDescending(arr : TaskObj[], left : number, right : number) {
      if (left < right) {
      let middle = Math.floor((left + right) / 2);
      mergeSortDescending(arr, left, middle);
      mergeSortDescending(arr, middle + 1, right);
      merge(arr, left, right, middle);
      }
      function merge(arr : TaskObj[], left : number, right: number, middle: number) {
        let l1 = middle - left + 1;
        let l2 = right - middle;
        let a1 = new Array(l1);
        let a2 = new Array(l2);

        for (let i = 0; i < l1; i++) {
          a1[i] = arr[left + i];
        }

        for (let j = 0; j < l2; j++) {
          a2[j] = arr[middle + 1 + j];
        }

        let i = 0;
        let j = 0;
        let k = left;

        while (i < l1 && j < l2) {
          if (a1[i].getPriority() > a2[j].getPriority()) {
            arr[k] = a1[i];
            i++;
          } else {
            arr[k] = a2[j];
            j++;
          }
          k++;
        }

        while (i < l1) {
          arr[k] = a1[i];
          i++;
          k++;
        }

        while (j < l2) {
          arr[k] = a2[j];
          j++;
          k++;
        }
      }
      toast("Tasks sorted by descending priority")
      setAllTasks([...arr]);
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
                <div className="fixed flex flex-col right-1 m-3 top-1/3 rounded-full">
                  <Button variant="ghost" onClick={() => mergeSortAscending(allTasks, 0, allTasks.length - 1)}><ArrowUp01 /></Button>
                  <Button variant="ghost" onClick={() => {mergeSortDescending(allTasks,0,allTasks.length-1)}}><ArrowUp01 /></Button>
                </div>
                <div className="ml-[4%] w-[95vw] h-[77vh]">
                    {allTasks?.map((task)=> (
                      <div key={task.getId()}>
                        <div className="m-6 relative w-[12vw] min-h-[15vh] rounded-md shadow-md border-2 border-gray-200 p-4 flex flex-col justify-between">
                        <Button variant="outline" className="w-10 absolute -top-2 -right-2 rounded-full" onClick={() => {deleteTask(task.getId())}}><Trash2/></Button>
                        <Button variant="outline" className="w-10 absolute top-1/2 -translate-y-1/2 -right-5 rounded-full">{task.getPriority()}</Button>
                        <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-10 absolute -bottom-2 -right-2 rounded-full" onClick={() => captureTaskData(task)}><Pencil />
                  </Button>      
                </PopoverTrigger>
                <PopoverContent avoidCollisions side="bottom" align="center" className="max-h-96 overflow-auto">
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
                  <Button onClick={() => {updateTask(task.getId())}}>
                    Save Task
                  </Button>
                </PopoverContent>
              </Popover>
                        <div className="flex items-center gap-2">
                          <Checkbox id={`task-${task.getId()}`} checked={task.getIsCompleted()} onCheckedChange={(checked) => {
                            const newStatus = checked === "indeterminate" ? false : checked;
                            setIsComplete(newStatus);
                            updateCheckedTask(task.getId(), newStatus);
}} />
                          <p className="text-sm pb-0.5">{task.getTitle() || "Task Title Not Set 🥺"}</p>
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