export default function LeafEmblem({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M27 8H17C8 8 4 14 4 22s6 13 13 13c8 0 14-5 14-12 0-6-4-10-9-10-5 0-8 3-8 7s3 7 7 7c3 0 5-2 5-5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m27 8 8-5-2 14M7 30l-4 7 12-3"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
