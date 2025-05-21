"use client";

import { HomeIcon, MessageCircleIcon, UsersIcon, PhoneCallIcon, HistoryIcon, HeartIcon, ImageIcon, BabyIcon, MusicIcon, Type, Brain } from "lucide-react";
import { SidebarGroup, 
    SidebarGroupContent, 
    SidebarMenu, 
    SidebarGroupLabel,
    SidebarMenuItem,
     SidebarMenuButton } from "../ui/sidebar";
import Link from "next/link";

const items = [

{
    title: "DTrack Finder",
    url: "/portfolio-sraz/dtrack-finder",
    icon: <MusicIcon />,
    auth: false,
},
{
    title: "Tinder Swipe",
    url: "/portfolio-sraz/tinder-swipe",
    icon: <HeartIcon />,
    auth: false,
},
{
    title: "WhatsApp Clone",
    url: "/",
    icon: <MessageCircleIcon />,
    auth: false,
},

]

const FullstackPortfolioSection = () => {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Portfolio - Fullstack</SidebarGroupLabel>
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
export default FullstackPortfolioSection;