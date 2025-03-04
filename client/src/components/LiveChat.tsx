
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LiveChatProps {
  helperId: number;
  helperName: string;
  helperUsername: string;
  onClose: () => void;
}

export default function LiveChat({ helperId, helperName, helperUsername, onClose }: LiveChatProps) {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: "system", 
      text: `Willkommen beim Chat mit ${helperName}! Wie kann Ihnen geholfen werden?`, 
      time: "Gerade eben" 
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        sender: "user",
        text: newMessage,
        time: "Gerade eben"
      }
    ]);

    setNewMessage("");

    // Simuliere eine Antwort nach kurzer Zeit
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "helper",
          text: `Danke für Ihre Nachricht! Ich (${helperName}) werde mich gleich darum kümmern.`,
          time: "Gerade eben"
        }
      ]);
    }, 1000);
  };

  return (
    <div className="lg:absolute lg:top-0 lg:right-0 lg:h-full z-40 w-full lg:w-1/3 lg:max-w-md">
      <Card className="w-full h-full shadow-lg">
        <CardHeader className="bg-primary text-white py-2 px-4 flex flex-row justify-between">
          <CardTitle className="text-base">Chat mit {helperName}</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 text-white" 
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[350px] lg:h-[calc(100vh-120px)] overflow-y-auto p-3 flex flex-col gap-2">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender !== 'user' && (
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback>
                      {message.sender === 'system' ? 'S' : helperName.charAt(0)}
                    </AvatarFallback>
                    {message.sender === 'helper' && (
                      <AvatarImage src={`https://avatars.githubusercontent.com/${helperUsername}`} />
                    )}
                  </Avatar>
                )}
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-primary text-white' 
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70 block mt-1">{message.time}</span>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="p-2 border-t flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Schreiben Sie eine Nachricht..."
              className="text-sm"
            />
            <Button type="submit" size="sm" className="px-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
