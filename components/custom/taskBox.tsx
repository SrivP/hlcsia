/*
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import { Pencil } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "../ui/input";

type Props = {
  id: number,
  tags?: string[] | null;
  name: string;
  dueDate?: Date;
  priority?: number;
  onDelete: () => void;
  isComplete : boolean;
  onComplete: (id:number, isComplete : boolean) => void;
};

export default function TaskBox({ id, name, tags = [],  dueDate, priority, onDelete, isComplete, onComplete }: Props) {
  return (
    <div className="m-6 relative w-[12vw] min-h-[15vh] rounded-md shadow-md border-2 border-gray-200 p-4 flex flex-col justify-between">
      <Button variant="outline" className="w-10 absolute -top-2 -right-2 rounded-full" onClick={onDelete}><Trash2/></Button>
      <Button variant="outline" className="w-10 absolute top-1/2 -translate-y-1/2 -right-5 rounded-full">{priority}</Button>
      <Popover>
                <PopoverTrigger className="">
                <Button variant="outline" className="w-10 absolute -bottom-2 -right-2 rounded-full"><Pencil /></Button>
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
                    onChange={(e) => setTags(e.target.value)}
                    className="mb-2"
                  />
                  <Button onClick={() => updateTask2(task.getId())}>
                    Save Task
                  </Button>
                </PopoverContent>
              </Popover>
      <div className="flex items-center gap-2">
        <Checkbox id={`task-${id}`} checked={isComplete} onCheckedChange={(checked) => onComplete(id, checked === true)}/>
        <p className="text-sm pb-0.5">{name || "Grab some milk"}</p>
      </div>
      <div>
        <p className="text-sm truncate pb-0.5">Due: {dueDate?.toLocaleDateString()}</p>
      </div>
      <div className="flex flex-wrap gap-1">
      {tags?.map((tag, index) => (
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
  );
}

*/