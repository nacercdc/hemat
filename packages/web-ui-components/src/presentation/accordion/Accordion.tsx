import {
  Accordion as ShadcnAccordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../shadcn-ui";

interface AccordionItem {
  value: string;
  trigger: React.ReactNode;
  content: React.ReactNode;
}

interface Props {
  items: AccordionItem[];
  type?: "single" | "multiple";
  collapsible?: boolean;
}

export function Accordion({
  items,
  type = "single",
  collapsible = true,
}: Props) {
  return (
    <ShadcnAccordion type={type} collapsible={collapsible} className={"w-full"}>
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </ShadcnAccordion>
  );
}
