export interface Message {
  id?: number | string;
  body: string;
  postId?: string;
  user: {
    id?: number;
    username: string;
  };
}

export interface UserMessage extends Message {
  _id?: number;
}

export interface UsersMessage {
  user: {
    username: string;
  };
  body: string;
  _id: string | number;
}

export type Messages = {
  _id: number | string;
  body: string;
  postId?: number;
  user: {
    id?: number;
    username: string;
  };
}[];
