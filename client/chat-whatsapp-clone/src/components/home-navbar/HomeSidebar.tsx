import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import MainSection from "../home-sidebar/MainSection";
import { Separator } from "../ui/separator";
import PersonalSection from "../home-sidebar/personalSection";

import BottomSection from "../home-sidebar/BottomSection";

const HomeSidebar = () => {
    return (
        <Sidebar className="pt-16 z-40 border-none" collapsible="icon">
            <SidebarContent className="bg-background">
                <MainSection/>
                <Separator/>
                {/* <PersonalSection/> */}
                <div className="mt-auto">
                    <Separator/>
                    <BottomSection/>
                </div>
            </SidebarContent>            
        </Sidebar>
    )
}

export default HomeSidebar;