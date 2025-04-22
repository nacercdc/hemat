import ErrorContainer from "../components/ErrorContainer";

export default function DashboardErrorBoundary() {
  return (
    <ErrorContainer>
      <p className="text-lg mt-2 text-basic-600">
        Please try again later or contact support.
      </p>
    </ErrorContainer>
  );
}
