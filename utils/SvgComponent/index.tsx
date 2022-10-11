import * as React from "react";
import { SVGProps } from "react";

interface Path {
  paths: {
    d: string,
    stroke: string,
    strokeWidth: number,
    strokeLinecap?: "inherit" | "butt" | "round" | "square",
    strokeLinejoin?: "inherit" | "round" | "miter" | "bevel"
  }[]
}

const SvgComponent = (props: SVGProps<SVGSVGElement> & Path) => (
  <svg
    width={14}
    height={14}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {props.paths?.map(path => (<path
      {...path}
    />))}
  </svg>
);

export default SvgComponent;
