"use client";

import { HomeIcon, MessageCircleIcon, UsersIcon, PhoneCallIcon, HistoryIcon, HeartIcon, ImageIcon, BabyIcon, MusicIcon, Type, Brain, FileTextIcon } from "lucide-react";
import { SidebarGroup, 
    SidebarGroupContent, 
    SidebarMenu, 
    SidebarGroupLabel,
    SidebarMenuItem,
     SidebarMenuButton } from "../ui/sidebar";
import Link from "next/link";

const items = [
{
    title: "Baby Mood Detector",
    url: "/portfolio-sraz/mood-detector",
    icon: <BabyIcon />,
    auth: false,
},
{
    title: "Chat with AI",
    url: "/portfolio-sraz/chat-with-ai",
    icon: <MessageCircleIcon />,
    auth: false,
},

{
    title: "Transcription",
    url: "/portfolio-sraz/web-transc",
    icon: <Type />,
    auth: false,
},
{
    title: "Deep Learning",
    url: "/portfolio-sraz/deep-learning",
    icon: <Brain />,
    auth: false,
},
{
    title: "OCR",
    url: "/ocr-test",
    icon: <FileTextIcon />,
    auth: false,
}
]

const AIPortfolioSection = () => {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Portfolio - AI</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton 
                            tooltip={item.title}
                            asChild
                            isActive={false} // TODO: look at current pathname
                            onClick={() => {}} // TODO: do something on click
                            > 
                                <Link href={item.url} className="flex items-center gap-4">
                                    {item.icon}
                                    <span className="text-sm">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
                </SidebarGroupContent>
        </SidebarGroup>
    )
}   
export default AIPortfolioSection;