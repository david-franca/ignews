import {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  NextApiRequest,
} from "next";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

import * as prismicH from "@prismicio/helpers";

import { Head } from "../../../components/Head";
import { getPrismicClient } from "../../../services/prismic";
import styles from "../post.module.scss";

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

const PostPreview = ({ post }: PostPreviewProps) => {
  const { data: session } = useSession();
  const { push } = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      push(`/posts/${post.slug}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <>
      <Head title={`${post.title} | IgNews`} />
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
};

export default PostPreview;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({
  params,
  previewData,
}) => {
  const slug = params?.slug;

  const prismic = getPrismicClient({ previewData });

  const response = await prismic.getByUID("publication", String(slug), {});

  const post = {
    slug,
    title: prismicH.asText(response.data.title),
    content: prismicH.asHTML(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };
  return {
    props: {
      post,
    },
    revalidate: 60 * 30, // 30 minutos
  };
};
