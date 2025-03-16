"use client"
import { useEffect, useState } from "react";
import Sidebar from "@/components/custom/sidebar"
import { Card } from "@/components/ui/card"
import { Bar, BarChart, XAxis  } from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TaskObj } from "../tasks/TaskObj";
import { TimeObj } from "./TimeObj";


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
    const [hoursDone, setHoursDone] = useState("");
    const [completedT, setCompletedT] = useState(0);
    const [chartData, setChartData] = useState([
      { month: "January", tasks: 0, time : 0 },
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

    useEffect(() => {
            const fetchData = async () => {
                const [response1, response2] = await Promise.all([
                    fetch("/api/timeData"),
                    fetch("/api/taskData"),
           ]);
              const time_data: apiResponseTask = await response1.json();
              const task_data: apiResponseTask = await response2.json();
              const tasks = task_data.allTasks.map((task) => TaskObj.fromAPI(task));
              const times = time_data.allTimeData.map((time) => TimeObj.fromAPI(time));
              const completedTasks = tasks.filter((task) => task.getIsCompleted());
              setCompletedT(completedTasks.length);
              setTaskNum(tasks.length);
              const today_focus_time = times.filter(time => new Date(time.getCreatedAt()).toISOString().split("T")[0] == new Date().toISOString().split("T")[0]).map((time) => time.getSeconds());
              let timeTotal = 0;
              for (let i = 0; i < today_focus_time.length; i++) {
                timeTotal += today_focus_time[i];
              }
              if (isNaN(timeTotal)) {
                setHoursDone("0");
              } else {
                setHoursDone((timeTotal/3600).toFixed(3));
              }
              const monthlyTaskCount = new Map <string, number>([
                ["January", 0],
                ["February", 0],
                ["March", 0],
                ["April", 0],
                ["May", 0],
                ["June", 0],
                ["July", 0],
                ["August", 0],
                ["September", 0],
                ["October", 0],
                ["November", 0],
                ["December", 0],
              ]);
              const monthlyTimeCount = new Map <string, number>([
                ["January", 0],
                ["February", 0],
                ["March", 0],
                ["April", 0],
                ["May", 0],
                ["June", 0],
                ["July", 0],
                ["August", 0],
                ["September", 0],
                ["October", 0],
                ["November", 0],
                ["December", 0],
              ]);

              for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].getIsCompleted()) {
                  let month = (new Date(tasks[i].getDueDate()).toLocaleDateString('default', {month : 'long'}))
                  monthlyTaskCount.set(month, (monthlyTaskCount.get(month) ?? 0) + 1);
                }
              }

              for (let i = 0; i < times.length; i++) {
                if (times[i].getCreatedAt()) {
                  let month = (new Date(times[i].getCreatedAt()).toLocaleDateString('default', {month : 'long'}))
                  const currentTime = monthlyTimeCount.get(month) ?? 0;
                  monthlyTimeCount.set(month, currentTime + times[i].getSeconds());
                }
              }


              const updatedChartData = chartData.map((data) => ({
                ...data,
                time: monthlyTimeCount.get(data.month) ?? 0,
                tasks: monthlyTaskCount.get(data.month) ?? 0,
              }));
              setChartData(updatedChartData);
          }
          fetchData();
        }, []);
    return(
        <>
            <Sidebar />
            <div className=" w-[100vw] h-[75vh] flex flex-col gap-3 items-center justify-center">
                <div className="flex flex-row gap-4">
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
                    <Card className="w-[200px] h-[200px] justify-center items-center">
                    <p className="text-md text-black font-bold shadow-2xl">Total Tasks</p>
                    <div className="flex items-center justify-center w-[100px] h-[100px] shadow-2xl border-4 border-gray-300 rounded-full text-2xl font-mono">
                    {taskNum}
                    </div>
                    </Card>
                </div>

                    
                <ChartContainer config={chartConfig} className="shadow-xl w-1/4 rounded-lg h-1/3 border-1 border-gray-200">
                      
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
                  
        </>
    )
}