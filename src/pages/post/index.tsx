import { GetStaticProps } from "next";
import Link from "next/link";

import * as prismicH from "@prismicio/helpers";

import { Head } from "../../components/Head";
import { getPrismicClient } from "../../services/prismic";
import styles from "./styles.module.scss";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

interface PostProps {
  posts: Post[];
}

interface IPrismicData {
  type: string;
  text: string;
  spans: Array<any>;
}

const Posts = ({ posts }: PostProps) => {
  return (
    <>
      <Head title="Post | IgNews" />
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/post/${post.slug}`}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const prismic = getPrismicClient({ previewData });

  const response = await prismic.getAllByType("publication", {
    fetch: ["publication.title", "publication.content"],
    pageSize: 100,
  });

  const getExcerpt = (content: IPrismicData[]) => {
    const text = content
      .filter((slice) => slice.type === "paragraph")
      .map((slice) => slice.text)
      .join(" ");

    const excerpt = text.substring(0, 250);

    if (text.length > 250) {
      return excerpt.substring(0, excerpt.lastIndexOf(" ")) + "…";
    } else {
      return excerpt;
    }
  };

  const posts = response.map((post) => {
    return {
      slug: post.uid,
      title: prismicH.asText(post.data.title),
      excerpt: getExcerpt(post.data.content),
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
    };
  });

  return {
    props: {
      posts,
    },
  };
};

export default Posts;
