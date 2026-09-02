import { SimplePage } from "@/components/site/simple-page";
export const metadata = { title: "Tenders" };
export default function Page() {
  return <SimplePage title="Tenders" crumbLabel="Tenders" subtitle="Procurement opportunities at TIRDO."
    paragraphs={[
      "TIRDO conducts procurement in accordance with the Public Procurement Act. Active tenders and their documents are published here and on the National e-Procurement System (NeST).",
      "There are currently no active tenders listed.",
    ]} />;
}
