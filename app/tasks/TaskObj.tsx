import { NoteObj } from "./NoteObj";

export class TaskObj extends NoteObj {
  
  private dueDate: any;
  private isComplete: boolean;
  private priority: number;
  // list : List;

  constructor(id : number, user_id : string, title: string, priority: number, tags: string[], isComplete : boolean, dueDate?: Date) {
    super(id, user_id, title, tags);
    this.dueDate = dueDate;
    this.priority = priority;
    this.isComplete = isComplete;
  }



  setDueDate(newDueDate: Date) {
    this.dueDate = newDueDate;
  }


  getDueDate(): Date {
    return this.dueDate;
  }

  getPriority(): number {
    return this.priority;
  }

  setPriority(newPriority: number) {
    this.priority = newPriority;
  }

  getIsCompleted() : boolean {
    return this.isComplete
  }

  setIsCompleted(isComplete : boolean) {
     this.isComplete = isComplete;
  }

  static fromAPI(data: any): TaskObj {
    return new TaskObj(
      data.id,
      data.user_id,
      data.title,
      data.priority,
      data.tags,
      data.isComplete,
      new Date(data.dueDate),
      
    );
  }
}
