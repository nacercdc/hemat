import { AssessmentDetailLayout } from "~/components/layouts/assessment-detail/AssessmentDetailLayout";

interface Props {
  children: React.ReactNode;
}

export default function layout({ children }: Props) {
  return <AssessmentDetailLayout>{children}</AssessmentDetailLayout>;
}
