
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Message = {
  id: number;
  text: string;
  sender: "user" | "helper";
  timestamp: Date;
};

type LiveChatProps = {
  helperId: number;
  helperName: string;
  helperUsername: string;
  onClose: () => void;
};

export const LiveChat: React.FC<LiveChatProps> = ({
  helperId,
  helperName,
  helperUsername,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hallo! Ich bin ${helperName}. Wie kann ich Ihnen heute helfen?`,
      sender: "helper",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    setNewMessage("");
    
    // Simulate helper typing
    setIsTyping(true);
    
    // Simulate helper response after delay
    setTimeout(() => {
      const helperResponses = [
        "Ich verstehe Ihr Problem. Lassen Sie mich Ihnen helfen.",
        "Haben Sie versucht, das Gerät neu zu starten?",
        "Könnten Sie mir mehr Details zu Ihrem Problem geben?",
        "Das ist ein häufiges Problem. Hier ist eine Lösung.",
        "Ich brauche etwas mehr Informationen, um Ihnen besser zu helfen.",
      ];
      
      const helperMessage: Message = {
        id: messages.length + 2,
        text: helperResponses[Math.floor(Math.random() * helperResponses.length)],
        sender: "helper",
        timestamp: new Date(),
      };
      
      setIsTyping(false);
      setMessages(prev => [...prev, helperMessage]);
    }, 1500);
  };
  
  // Auto-scroll to bottom of chat when messages change
  useEffect(() => {
    const chatContainer = document.getElementById("chat-messages");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);
  
  return (
    <div className="fixed bottom-0 right-4 w-80 bg-white border rounded-t-lg shadow-lg flex flex-col z-50">
      <div className="p-3 border-b bg-slate-50 flex justify-between items-center">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={`https://avatar.vercel.sh/${helperUsername}`} />
            <AvatarFallback>{helperName[0]}</AvatarFallback>
          </Avatar>
          <span className="font-semibold">{helperName}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </Button>
      </div>
      
      <div id="chat-messages" className="flex-1 p-3 overflow-y-auto h-80 flex flex-col gap-2">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`max-w-[80%] p-2 rounded-lg ${
              message.sender === "user" 
                ? "bg-primary text-primary-foreground self-end" 
                : "bg-muted self-start"
            }`}
          >
            <p>{message.text}</p>
            <p className="text-xs opacity-70 mt-1">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ))}
        
        {isTyping && (
          <div className="max-w-[80%] p-2 rounded-lg bg-muted self-start flex gap-1 items-center">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-0"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-300"></div>
          </div>
        )}
      </div>
      
      <div className="p-3 border-t flex gap-2">
        <Input 
          placeholder="Nachricht schreiben..." 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button onClick={handleSendMessage}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </Button>
      </div>
    </div>
  );
};
