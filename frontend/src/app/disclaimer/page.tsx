import { SimplePage } from "@/components/site/simple-page";
export const metadata = { title: "Disclaimer" };
export default function Page() {
  return <SimplePage title="Disclaimer" crumbLabel="Disclaimer"
    paragraphs={[
      "The information on this website is provided for general information purposes only. While TIRDO endeavours to keep the information up to date and correct, we make no representations or warranties of any kind about its completeness or accuracy.",
      "External links are provided for convenience and do not signify endorsement of the linked content.",
    ]} />;
}
