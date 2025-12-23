import { PERSONAL_INFO } from "@/lib/constants";

export function StructuredData() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PERSONAL_INFO.name,
    jobTitle: "Product & Delivery Expert",
    url: "https://mikewatsonusportfolio.vercel.app/",
    sameAs: [
      PERSONAL_INFO.social.linkedin,
      PERSONAL_INFO.social.github,
      PERSONAL_INFO.social.newsletter,
      PERSONAL_INFO.social.bluesky,
    ],
  };

  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Product & Delivery Consulting",
    provider: {
      "@type": "Person",
      name: PERSONAL_INFO.name,
    },
    serviceType: [
      "Product Leadership & Direction",
      "Delivery & Execution",
      "Product Operations & Scale",
    ],
    description:
      "I help product and engineering leaders identify what's slowing teams down and remove it—without adding process, ceremony, or permanent headcount.",
    areaServed: "United States",
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      <script type="application/ld+json">
        {JSON.stringify(professionalServiceSchema)}
      </script>
    </>
  );
}

