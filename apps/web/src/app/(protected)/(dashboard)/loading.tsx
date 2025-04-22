import { Spinner } from "@etm/web-ui-components";

export default function Loading() {
  return (
    <div className="w-full h-[calc(100vh-200px)] flex flex-col justify-center items-center">
      <Spinner color="primary" size="xl" />
    </div>
  );
}
