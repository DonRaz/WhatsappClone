import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import MainSection from "../home-sidebar/MainSection";
import { Separator } from "../ui/separator";
import PersonalSection from "../home-sidebar/personalSection";

import BottomSection from "../home-sidebar/BottomSection";
import AIPortfolioSection from "../home-sidebar/AIPortfolioSection";
import FullstackPortfolioSection from "../home-sidebar/FullstackPortfolioSection";

const HomeSidebar = () => {
    return (
        <Sidebar className="pt-16 z-40 border-none" collapsible="icon">
            <SidebarContent className="bg-background">
                <MainSection/>
                <Separator/>
                <PersonalSection/>
                <FullstackPortfolioSection/>
                <AIPortfolioSection/>
                <div className="mt-auto">
                    <Separator/>
                    <BottomSection/>
                </div>
            </SidebarContent>            
        </Sidebar>
    )
}

export default HomeSidebar;