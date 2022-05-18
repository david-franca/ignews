import NextHead from "next/head";

interface HeadType {
  title?: string;
  href?: string;
  rel?: string;
}
export const Head: React.FC<HeadType> = ({ title, href, rel }) => {
  return (
    <NextHead>
      <title>{title ?? "ig.news"}</title>
      <link rel="icon" href="/favicon.ico" />
      <link href={href} rel={rel}></link>
    </NextHead>
  );
};
