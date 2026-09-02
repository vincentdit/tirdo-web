import { SimplePage } from "@/components/site/simple-page";
export const metadata = { title: "Events" };
export default function Page() {
  return <SimplePage title="Events" crumbLabel="Events" subtitle="Workshops, exhibitions and industry engagements hosted by TIRDO."
    paragraphs={[
      "TIRDO regularly hosts and participates in industrial exhibitions, technical workshops, stakeholder forums and training events that connect research to industry.",
      "Upcoming events will be published here and managed through the CMS. Check back soon or follow TIRDO on social media for announcements.",
    ]} />;
}
