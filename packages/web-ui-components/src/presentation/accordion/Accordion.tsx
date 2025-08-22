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
  onValueChange?: (value: string) => void;
}

export function Accordion({
  items,
  type = "single",
  collapsible = true,
  onValueChange,
}: Props) {
  return (
    <ShadcnAccordion
      type={type}
      collapsible={collapsible}
      className={"w-full flex flex-col gap-4"}
    >
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger onClick={() => onValueChange?.(item.value)}>
            {item.trigger}
          </AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </ShadcnAccordion>
  );
}
