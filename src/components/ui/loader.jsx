import { FadeLoader } from "react-spinners";
function Loader({
  height = 10,
  width = 10,
  color = "#2563eb",
  radius = 8,
  ...props
}) {
  return (
    <div className="border">
      <FadeLoader
        color={color}
        height={10}
        width={4}
        radius={radius}
        cssOverride={{
          border: "1p solid red !important",
        }}
        {...props}
      />
    </div>
  );
}

export default Loader;
