import { SimplePage } from "@/components/site/simple-page";
import { getPageBySlug, pageParagraphs } from "@/lib/strapi";

export const metadata = { title: "Privacy Policy" };

export default async function Page() {
  const page = await getPageBySlug("privacy");
  return (
    <SimplePage
      title={page?.title || "Privacy Policy"}
      crumbLabel="Privacy Policy"
      paragraphs={
        pageParagraphs(page?.body).length
          ? pageParagraphs(page?.body)
          : [
              "This Privacy Policy explains how TIRDO collects, uses and protects information provided through this website.",
              "We collect only the information necessary to respond to enquiries and provide our services. Analytics are collected in an anonymised form using a self-hosted Matomo instance, giving TIRDO full control over the data.",
              "We do not sell or share personal information with third parties except as required to deliver a requested service or by law.",
            ]
      }
    />
  );
}
