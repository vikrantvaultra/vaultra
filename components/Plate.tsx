import Image from "next/image";

/** A photograph, filed like an exhibit — numbered plate, ruled surround. */
export function Plate({
  src,
  alt,
  width,
  height,
  n,
  caption,
  sizes,
  dark = false,
  className = "",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  n: string;
  caption: string;
  sizes: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <figure
      className={`plate${dark ? " plate--dark" : ""}${className ? ` ${className}` : ""}`}
      data-reveal
    >
      <Image src={src} alt={alt} width={width} height={height} sizes={sizes} />
      <figcaption>
        <b>Plate {n}</b>
        {caption}
      </figcaption>
    </figure>
  );
}
