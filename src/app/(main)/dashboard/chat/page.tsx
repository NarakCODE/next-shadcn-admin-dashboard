"use client";

import { useState } from "react";

import { format } from "date-fns";
import { ArrowLeft, Image as ImageIcon, Mic, Paperclip, Phone, Search, Send, Smile, Video } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Contact = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: Date;
  unread: number;
  online: boolean;
};

type Message = {
  id: string;
  content: string;
  sender: "me" | "other";
  timestamp: Date;
};

const contacts: Contact[] = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "https://github.com/shadcn.png",
    lastMessage: "Hey, how are you doing?",
    time: new Date(Date.now() - 1000 * 60 * 5),
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Bob Smith",
    avatar: "https://github.com/leerob.png",
    lastMessage: "Let's catch up later today",
    time: new Date(Date.now() - 1000 * 60 * 30),
    unread: 0,
    online: true,
  },
  {
    id: "3",
    name: "Carol Williams",
    avatar: "https://github.com/timneutkens.png",
    lastMessage: "The project looks great!",
    time: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unread: 1,
    online: false,
  },
  {
    id: "4",
    name: "David Brown",
    avatar: "https://github.com/vercel.png",
    lastMessage: "Can you review the PR?",
    time: new Date(Date.now() - 1000 * 60 * 60 * 5),
    unread: 0,
    online: false,
  },
  {
    id: "5",
    name: "Eva Martinez",
    avatar: "https://github.com/arhamkhnz.png",
    lastMessage: "Thanks for the help!",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unread: 0,
    online: true,
  },
];

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hey there! How's the project going?",
    sender: "other",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: "2",
    content: "It's going well! Just finished the dashboard layout.",
    sender: "me",
    timestamp: new Date(Date.now() - 1000 * 60 * 40),
  },
  {
    id: "3",
    content: "That's awesome! Can you share a screenshot?",
    sender: "other",
    timestamp: new Date(Date.now() - 1000 * 60 * 35),
  },
  {
    id: "4",
    content: "Sure, I'll send it over in a bit. Working on the chat page now.",
    sender: "me",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "5",
    content: "Hey, how are you doing?",
    sender: "other",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
];

export default function Page() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [showMobileList, setShowMobileList] = useState(true);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: String(messages.length + 1),
      content: newMessage,
      sender: "me",
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    setShowMobileList(false);
  };

  return (
    <div className="flex h-[calc(100vh-var(--spacing)*24)] overflow-hidden rounded-lg border bg-card">
      {/* Contact List */}
      <div className={cn("flex w-full flex-col border-r md:w-80", showMobileList ? "flex" : "hidden md:flex")}>
        {/* Search */}
        <div className="flex flex-col gap-3 p-4">
          <h2 className="font-semibold text-lg">Messages</h2>
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-8" />
          </div>
        </div>

        <Separator />

        {/* Contacts */}
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-1 p-2">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleSelectContact(contact)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted",
                  selectedContact?.id === contact.id && "bg-muted",
                )}
              >
                <div className="relative">
                  <Avatar size="default">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {contact.online && (
                    <span className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-card bg-green-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate font-medium text-sm">{contact.name}</span>
                    <span className="shrink-0 text-muted-foreground text-xs">{format(contact.time, "h:mm a")}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-muted-foreground text-xs">{contact.lastMessage}</span>
                    {contact.unread > 0 && (
                      <Badge variant="default" className="shrink-0 px-1.5 py-0 text-xs">
                        {contact.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className={cn("flex min-w-0 flex-1 flex-col", showMobileList ? "hidden md:flex" : "flex")}>
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 border-b p-4">
              <Button variant="ghost" size="icon-sm" className="md:hidden" onClick={() => setShowMobileList(true)}>
                <ArrowLeft />
              </Button>
              <div className="relative">
                <Avatar size="sm">
                  <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                  <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {selectedContact.online && (
                  <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-card bg-green-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-medium text-sm">{selectedContact.name}</h3>
                <p className="text-muted-foreground text-xs">{selectedContact.online ? "Online" : "Offline"}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon-sm">
                  <Phone />
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <Video />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="flex flex-col gap-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex max-w-[75%] flex-col gap-1",
                      message.sender === "me" ? "items-end self-end" : "items-start self-start",
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm",
                        message.sender === "me" ? "bg-primary text-primary-foreground" : "bg-muted",
                      )}
                    >
                      {message.content}
                    </div>
                    <span className="text-muted-foreground text-xs">{format(message.timestamp, "h:mm a")}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="flex items-center gap-2 border-t p-4">
              <Button variant="ghost" size="icon-sm">
                <Paperclip />
              </Button>
              <Button variant="ghost" size="icon-sm">
                <ImageIcon />
              </Button>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button variant="ghost" size="icon-sm">
                <Smile />
              </Button>
              <Button variant="ghost" size="icon-sm">
                <Mic />
              </Button>
              <Button size="icon-sm" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send />
              </Button>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <MessageIcon className="size-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg">Your messages</h3>
            <p className="max-w-sm text-muted-foreground text-sm">
              Select a conversation from the sidebar to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function MessageIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}
