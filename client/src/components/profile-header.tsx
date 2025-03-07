import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { PERSONAL_INFO } from "@/lib/constants";

export function ProfileHeader() {
  return (
    <div className="w-full max-w-4xl mx-auto py-12">
      <Card>
        <CardContent className="flex flex-col md:flex-row items-center gap-6 p-6">
          <Avatar className="w-32 h-32">
            <AvatarImage src={PERSONAL_INFO.avatar} alt={PERSONAL_INFO.name} />
            <AvatarFallback>{PERSONAL_INFO.name[0]}</AvatarFallback>
          </Avatar>
          
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold">{PERSONAL_INFO.name}</h1>
            <p className="text-xl text-muted-foreground">{PERSONAL_INFO.title}</p>
            <p className="max-w-2xl text-muted-foreground">{PERSONAL_INFO.bio}</p>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {PERSONAL_INFO.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
