import { SimplePage } from "@/components/site/simple-page";
export const metadata = { title: "Careers" };
export default function Page() {
  return <SimplePage title="Careers" crumbLabel="Careers" subtitle="Build your career in industrial research and technology."
    paragraphs={[
      "TIRDO brings together researchers, engineers and technologists working on real industrial challenges. Vacancies are advertised here and through the official government recruitment channels.",
      "There are currently no open positions listed. Job openings will be posted here and managed through the CMS.",
    ]} />;
}
