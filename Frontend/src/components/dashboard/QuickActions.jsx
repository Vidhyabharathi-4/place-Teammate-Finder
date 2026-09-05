import { Card } from "@/components/ui/card";

import {
    Users,
    FolderPlus,
    User,
    Search
} from "lucide-react";

import { Link } from "react-router-dom";

const actions = [

{
title:"Browse Teams",
icon:Users,
link:"/teams"
},

{
title:"Create Team",
icon:FolderPlus,
link:"/teams/create"
},

{
title:"Profile",
icon:User,
link:"/profile"
},

{
title:"Search",
icon:Search,
link:"/teams"
}

];

function QuickActions(){

return(

<Card>

<h2 className="font-bold text-xl mb-5 text-slate-800 dark:text-white">

Quick Actions

</h2>

<div className="space-y-3">

{

actions.map(action=>{

const Icon=action.icon;

return(

<Link

key={action.title}

to={action.link}

className="flex items-center gap-4 p-4 rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700/60 transition"

>

<Icon size={20}/>

{action.title}

</Link>

);

})

}

</div>

</Card>

);

}

export default QuickActions;