"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faq = [
  { id: "cycles", q: "How do cycles work?", a: "Cycles are two-week windows. Unfinished issues roll over to the next cycle automatically." },
  { id: "triage", q: "Who reviews the triage queue?", a: "The on-call engineer for the week triages new issues every morning before standup." },
  { id: "archive", q: "When are projects archived?", a: "Completed projects are archived 30 days after their last issue is closed." },
];

export default function Demo() {
  return (
    <div className="grid max-w-2xl gap-8">
      <Accordion type="single" collapsible defaultValue="cycles">
        {faq.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionContent>{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Accordion type="multiple" variant="card" defaultValue={["scope"]}>
        <AccordionItem value="scope">
          <AccordionTrigger>Scope · 12 issues</AccordionTrigger>
          <AccordionContent>Onboarding flow redesign, invite emails and the new workspace picker.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="milestones">
          <AccordionTrigger>Milestones · 3</AccordionTrigger>
          <AccordionContent>Beta on Nov 4, public launch on Nov 18, retrospective on Nov 25.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="risks">
          <AccordionTrigger>Risks</AccordionTrigger>
          <AccordionContent>Email deliverability is untested on the new sending domain.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
