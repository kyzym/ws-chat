export type User = {
  id?: number;
  username: string;
};

export type Message = {
  _id: number | string;
  body: string;
  postId?: string;
  user: User;
};

export type Messages = Message[];
