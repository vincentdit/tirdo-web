import { SimplePage } from "@/components/site/simple-page";
import { getPageBySlug, pageParagraphs } from "@/lib/strapi";

export const metadata = { title: "Disclaimer" };

export default async function Page() {
  const page = await getPageBySlug("disclaimer");
  return (
    <SimplePage
      title={page?.title || "Disclaimer"}
      crumbLabel="Disclaimer"
      paragraphs={
        pageParagraphs(page?.body).length
          ? pageParagraphs(page?.body)
          : [
              "The information on this website is provided for general information purposes only. While TIRDO endeavours to keep the information up to date and correct, we make no representations or warranties of any kind about its completeness or accuracy.",
              "External links are provided for convenience and do not signify endorsement of the linked content.",
            ]
      }
    />
  );
}
