import { Card, CardContent } from "@/components/ui/card";
import { PERSONAL_INFO } from "@/lib/constants";
import { SiGithub, SiLinkedin, SiBluesky, SiSubstack } from "react-icons/si";

const ICON_SIZE = 24;

export function SocialLinks() {
  return (
    <Card>
      <CardContent className="flex justify-center gap-6 p-6">
        <a
          href={PERSONAL_INFO.social.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
          aria-label="GitHub Profile"
        >
          <SiGithub size={ICON_SIZE} />
        </a>
        <a
          href={PERSONAL_INFO.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
          aria-label="LinkedIn Profile"
        >
          <SiLinkedin size={ICON_SIZE} />
        </a>
        <a
          href={PERSONAL_INFO.social.bluesky}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
          aria-label="Bluesky Profile"
        >
          <SiBluesky size={ICON_SIZE} />
        </a>
        <a
          href={PERSONAL_INFO.social.newsletter}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
          aria-label="Newsletter"
        >
          <SiSubstack size={ICON_SIZE} />
        </a>
      </CardContent>
    </Card>
  );
}