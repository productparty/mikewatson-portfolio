import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PERSONAL_INFO } from "@/lib/constants";

export function NewsletterForm() {
  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden">
      <CardHeader>
        <CardTitle>Subscribe to My Newsletter</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <iframe
          src="https://productparty.substack.com/embed"
          width="100%"
          height="320"
          style={{ border: "1px solid #EEE", background: "white" }}
          frameBorder="0"
          scrolling="no"
          title="Subscribe to Product Party newsletter"
        />
      </CardContent>
    </Card>
  );
}