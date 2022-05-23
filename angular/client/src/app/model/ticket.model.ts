export class Ticket {
  ticket_no: Number;
  ticket_title: String;
  ticket_desc: String;
  authorId: Number;
  isDeleted: Boolean;

  author?: {
    created_at: String;
    deleted_at: String;
    email: String;
    id: Number;
    isDeleted: Boolean;
    password: String;
    updated_at: String;
    username: String;
  };
  created_at?: String;
  deleted_at?: String;
  updated_at?: String;
}
