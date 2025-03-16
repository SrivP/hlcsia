export class TaskObj  {
  
  private dueDate: any;
  private isComplete: boolean;
  private priority: number;
  private id : number;
  private user_id : string;
  private title: string;
  private tags: string[];

  constructor(id : number, user_id : string, title: string, priority: number, tags: string[], isComplete : boolean, dueDate?: Date) {
    this.title = title ?? "";
    this.tags = tags;
    this.user_id = user_id;
    this.id = id;
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

  getId() {
    return this.id;
  }

  getUserId() {
    return this.user_id;
  }

  setTitle(newtitle: string) {
    this.title = newtitle;
  }

  getUser_id() : string {
    return this.user_id
  }



  setTags(newTags: string[]) {
    this.tags = newTags;
  }

  getTitle(): string {
    return this.title;
  }



  getTags(): string[] {
    return this.tags;
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
