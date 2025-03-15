export class NoteObj {
    private id : number;
    private user_id : string;
    private title: string;
    private tags: string[];
  
    constructor(id : number, user_id : string, title: string, tags: string[]) {
      this.title = title ?? "";
      this.tags = tags;
      this.user_id = user_id;
      this.id = id;
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

    
  
    // @ts-ignore 
    static fromAPIH(data: any): NoteObj {
      return new NoteObj(data.id, data.title, data.tags, data.userId);
    }
  }
  