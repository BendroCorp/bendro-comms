import { User } from "./user.model";

export class Chat {
  id: number;
  text: string;
  created_at: Date;
  updated_at: Date;
  edited: boolean;
  user: User;
}

export class ChatAction {
  mode: "CREATE"|"UPDATE"|"DELETE";
  chat: Chat;
}