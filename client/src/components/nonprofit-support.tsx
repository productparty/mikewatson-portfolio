import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PERSONAL_INFO } from "@/lib/constants";

export function NonprofitSupport() {
  const getFaviconUrl = (domain: string) => {
    if (domain.includes('gicoaseniors.org')) {
      return 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.gicoaseniors.org/&size=16';
    } else if (domain.includes('pincusfamilyfoundation.org')) {
      return 'https://www.google.com/s2/favicons?domain=pincusfamilyfoundation.org';
    } else if (domain.includes('backbonecampaign.org')) {
      return 'https://www.google.com/s2/favicons?domain=backbonecampaign.org';
    } else if (domain.includes('nrccafe.org')) {
      return 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://nrccafe.org/&size=16';
    } else if (domain.includes('njtutoringcorps.org')) {
      return 'https://www.google.com/s2/favicons?domain=njtutoringcorps.org';
    }
    return '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">Nonprofit Support</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PERSONAL_INFO.nonprofitSupport.map((org, index) => (
          <Card key={index} className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-4">
              <a
                href={org.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block space-y-2"
              >
                <div className="flex items-center gap-2">
                  <img 
                    src={getFaviconUrl(org.url)}
                    alt={`${org.name} icon`}
                    className="w-4 h-4"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <h3 className="font-medium hover:text-primary transition-colors">
                    {org.name}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {org.description}
                </p>
              </a>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}