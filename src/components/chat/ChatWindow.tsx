'use client';

import { motion } from 'framer-motion';
import { Send, Bot } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ReactMarkdown from 'react-markdown';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

export default function ChatWindow({ onClose }: { onClose: () => void }) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'こんにちは。エルムクリニック AIコンシェルジュです。\nお肌のお悩みや、施術についてのご質問はありますか？',
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        // Generate ID on client side only during event
        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMsg].filter(m => m.id !== '1')
                }),
            });

            if (!response.ok) throw new Error('API Error');

            const data = await response.json();

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.content,
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error(error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: '申し訳ありません。エラーが発生しました。もう一度お試しください。',
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 h-[500px] w-[350px] md:w-[400px] rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col border border-gray-100 font-sans"
        >
            {/* Header */}
            <div className="bg-elm-navy p-4 flex items-center gap-3 text-white shadow-md z-10">
                <div className="h-9 w-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                    <Bot size={20} className="text-elm-gold" />
                </div>
                <div>
                    <h3 className="text-sm font-bold tracking-wide">AIコンシェルジュ</h3>
                    <p className="text-xs text-white/70">24時間対応中</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FAFC]">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={cn(
                            "flex w-full",
                            msg.role === 'user' ? "justify-end" : "justify-start"
                        )}
                    >
                        <div
                            className={cn(
                                "max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed",
                                msg.role === 'user'
                                    ? "bg-elm-navy text-white rounded-br-sm shadow-sm"
                                    : "bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-sm"
                            )}
                        >
                            <ReactMarkdown
                                components={{
                                    a: ({ node, ...props }) => (
                                        <a
                                            {...props}
                                            className="text-elm-gold hover:underline font-medium break-all"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        />
                                    ),
                                    p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />
                                }}
                            >
                                {msg.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-4 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100 flex gap-1.5 items-center">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75" />
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="お悩みやご質問を入力..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-[16px] focus:outline-none focus:ring-1 focus:ring-elm-gold/50 focus:border-elm-gold/50 transition-all placeholder:text-gray-400"
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-elm-gold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 shadow-sm hover:shadow-md transition-all transform active:scale-95"
                >
                    <Send size={18} />
                </button>
            </form>
        </motion.div>
    );
}
