export class TimeObj {
    private id : number;
    private seconds : number;
    private created_at: Date;
    private user_id: string;

    constructor(id : number, seconds : number, created_at: Date, user_id: string) {
      this.seconds = seconds;
      this.created_at = created_at;
      this.user_id = user_id;
      this.id = id;
    }

    static fromAPI(data: any): TimeObj {
        return new TimeObj(
          data.id,
          data.seconds,
          data.created_at,
          data.user_id,
          
        );
      }


      getId() : number {
        return this.id
      }

      setId(id : number) {
         this.id = id;
      }

      getCreatedAt() : Date {
        return this.created_at
      }

      setCreatedAt(created_time : Date) {
         this.created_at = created_time;
      }

      getSeconds() : number {
        return this.seconds
      }

      setSeconds(seconds : number) {
         this.seconds = seconds;
      }





}