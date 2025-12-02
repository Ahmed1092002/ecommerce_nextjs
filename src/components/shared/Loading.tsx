import { FlowLoader } from "react-loadly";
export function Loading() {
  return (
    <FlowLoader
      size={45}
      color="#db4444"
      speed={1}
      aria-label="Loading"
      showText={true}
      loadingText="Loading..."
      loaderCenter={true}
      fluidity={1}
      amplitude={1}
      secondaryColor="#e0e7ff"
    />
  );
}
