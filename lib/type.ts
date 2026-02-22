export type Profile = {
  id: string;
  username: string;
  created_at: string;
};

export type Message = {
  id: string;
  recipient_username: string;
  content: string;
  reply: string | null;
  is_read: boolean;
  created_at: string;
};
