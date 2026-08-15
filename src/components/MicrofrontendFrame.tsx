interface MicrofrontendFrameProps {
  src: string;
  title: string;
}

export default function MicrofrontendFrame({
  src,
  title,
}: MicrofrontendFrameProps) {
  return (
    <iframe src={src} title={title}
      style={{
        width: "100%",
        minHeight: "calc(100vh - 64px)",
        border: "none",
        display: "block",
      }}
    />
  );
}