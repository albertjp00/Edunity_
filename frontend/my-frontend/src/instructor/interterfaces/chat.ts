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
  unreadCount : number
}

export interface IStudent {
  id: string;
  name: string;
  avatar: string;
  hasAttachment: boolean;
  lastMessage: string;
  timestamp?: string;
  unreadCount : number
}


export interface Message {
  _id:string;
  senderId: string;
  receiverId?: string;
  text: string;
  attachment?: string;
  timestamp: Date | string;
  read?: boolean;
}

export interface ChatWindowProps {
  instructorId: string;
  receiverId?: string;
  receiverName: string;
  receiverAvatar?: string;
  onMessageSent?: (receiverId: string, messageText: string, attachment: string) => void;
  unreadIncrease?: (senderId: string) => void
}