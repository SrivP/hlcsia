"use client"
import { useEffect, useState } from "react";
import Sidebar from "@/components/custom/sidebar"
import { Card } from "@/components/ui/card"
import { Bar, BarChart, Label, XAxis  } from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TaskObj } from "../tasks/TaskObj";
import { TimeObj } from "./TimeObj";
import { Button } from "@/components/ui/button";

const chartConfig = {
  tasks: {
    label: "Tasks",
    color: "#525252",
  },
  time: {
    label: "Time",
    color: "#bdbdbd",
  },
} satisfies ChartConfig

interface apiResponseTask {
    seconds: number;
    user_id : string;
    allTasks : TaskObj[];
    allTimeData : TimeObj[];
}

export default function page() {
    const [taskNum, setTaskNum] = useState(0);
    const [hoursDone, setHoursDone] = useState(0);
    const [update, setUpdate] = useState(false);
    const [user, setUser] = useState("");
    const [completedT, setCompletedT] = useState(0);
    const [chartData, setChartData] = useState([
      { month: "January", tasks: 0, time: 0 },
      { month: "February", tasks: 0, time: 0 },
      { month: "March", tasks: 0, time: 0 },
      { month: "April", tasks: 0, time: 0 },
      { month: "May", tasks: 0, time: 0 },
      { month: "June", tasks: 0, time: 0 },
      { month: "July", tasks: 0, time: 0 },
      { month: "August", tasks: 0, time: 0 },
      { month: "September", tasks: 0, time: 0 },
      { month: "October", tasks: 0, time: 0 },
      { month: "November", tasks: 0, time: 0 },
      { month: "December", tasks: 0, time: 0 },
    ]);
    const [allTimes, setAllTimes] = useState<TimeObj[]>([])


    useEffect(() => {
            const fetchData = async () => {
                const [response, response2] = await Promise.all([
                    fetch("/api/timeData"),
                    fetch("/api/taskData"),
           ]);
              const result: apiResponseTask = await response.json();
              const result2: apiResponseTask = await response2.json();
              const tasks = result2.allTasks.map((task) => TaskObj.fromAPI(task));
              const times = result.allTimeData.map((time) => TimeObj.fromAPI(time));
              setAllTimes(times);
              console.log("This is all time" + allTimes.toString());
              
              const completedTasks = tasks.filter((task) => task.getIsCompleted());
              setCompletedT(completedTasks.length);
              console.log(completedTasks);
              console.log("This is tasks" + tasks.toString())
              setTaskNum(tasks.length);
              let timeTotal = 0;
              for (let i = 0; i < allTimes.length; i++) {
                timeTotal += allTimes[i].getSeconds();
                console.log("Hi from the loop" + allTimes[i].getSeconds())
              }
              console.log("This is time totale " + timeTotal);
              if (isNaN(timeTotal)) {
                setHoursDone(0);
              } else {
                setHoursDone(timeTotal/3600);
              }
              setUser(result.user_id)
              const monthlyTaskCount : Record <string, number> ={
                January : 0,
                February : 0,
                March : 0,
                April : 0,
                May : 0,
                June : 0,
                July : 0,
                August : 0,
                September : 0,
                October : 0,
                November : 0,
                December : 0,
              };
              const monthlyTimeCount : Record <string, number> ={
                January : 0,
                February : 0,
                March : 0,
                April : 0,
                May : 0,
                June : 0,
                July : 0,
                August : 0,
                September : 0,
                October : 0,
                November : 0,
                December : 0,
              };

              for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].getIsCompleted()) {
                  let month = (new Date(tasks[i].getDueDate()).toLocaleDateString('default', {month : 'long'}))
                  monthlyTaskCount[month]++;
                }
              }

              for (let i = 0; i < times.length; i++) {
                if (times[i].getCreatedAt()) {
                  let month = (new Date(times[i].getCreatedAt()).toLocaleDateString('default', {month : 'long'}))
                  monthlyTimeCount[month] += times[i].getSeconds();
                  console.log("This is seconds" + times[i].getSeconds())
                }
              }

              // a little bit of ai used here
              const updatedChartData = chartData.map((data) => ({
                ...data,
                time: monthlyTimeCount[data.time],
                tasks: monthlyTaskCount[data.month],
              }));

              setChartData(updatedChartData);
          }
          fetchData();
        }, [update]);
    return(
        <>
            <Sidebar />
            <div className="ml-[4%] w-[100vw] h-[75vh] flex gap-3 items-start">
                <div className="flex flex-col gap-4">
                    <Card className="w-[200px] h-[200px] justify-center items-center">
                    <p className="text-md text-black font-bold shadow-2xl">Hours Focused Today</p>
                    <div className="flex items-center justify-center w-[100px] h-[100px] shadow-2xl border-4 border-gray-300 rounded-full text-2xl font-mono">
                        {hoursDone}
                    </div>
                    </Card>
                    <Card className="w-[200px] h-[200px] justify-center items-center">
                    <p className="text-md text-black font-bold shadow-2xl">Tasks Completed</p>
                    <div className="flex items-center justify-center w-[100px] h-[100px] shadow-2xl border-4 border-gray-300 rounded-full text-2xl font-mono">
                    {completedT}
                    </div>
                    </Card>
                </div>
                <div className="flex-grow">
                <div className="flex flex-col gap-7 flex-grow justify-between">
                    <Card className="w-[200px] h-[200px] justify-center items-center">
                    <p className="text-md text-black font-bold shadow-2xl">Total Tasks</p>
                    <div className="flex items-center justify-center w-[100px] h-[100px] shadow-2xl border-4 border-gray-300 rounded-full text-2xl font-mono">
                    {taskNum}
                    </div>
                    </Card>
                <ChartContainer config={chartConfig} className="shadow-xl w-1/4 rounded-lg h-1/3 border-1 border-gray-200 ">
                      
                        <BarChart accessibilityLayer data={chartData} className="shadow-2xl">
                        <XAxis
                                dataKey="month" 
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                        />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="tasks" fill={chartConfig.tasks.color} radius={4} />
                            <Bar dataKey="time" fill={chartConfig.time.color} radius={4} />
                        </BarChart>
                    </ChartContainer>
                    </div>   
                </div>
                  
                </div>
        </>
    )
}