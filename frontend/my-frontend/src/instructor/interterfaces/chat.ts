export interface LastMessage {
  text?: string;
  attachment?: string;
  timestamp?: string;
}

export interface ApiStudent {
  instructor: {
    _id: string;
    name: string;
    avatar?: string;
  };
  lastMessage: LastMessage;
}

export interface IStudent {
  id: string;
  name: string;
  avatar: string;
  hasAttachment: boolean;
  lastMessage: string;
  timestamp?: string;
}