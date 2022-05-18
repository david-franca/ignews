import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import Image from "next/image";

import { Head } from "../components/Head";
import SubscribeButton from "../components/SubscribeButton";
import { stripe } from "../services/stripe";
import styles from "./home.module.scss";

interface HomeProps {
  product: {
    amount: number;
    priceId: string;
  };
}

const Home: NextPage<HomeProps> = ({ product }) => {
  return (
    <>
      <Head title="Home | ig.news" />
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <Image
          src="/images/avatar.svg"
          alt="Girl coding"
          width={500}
          height={500}
        />
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const price = await stripe.prices.retrieve("price_1L0sJ2LJQ3qxKJJm7sWennxl");

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format((price.unit_amount ?? 0) / 100),
  };

  return {
    props: {
      product,
    },
  };
};

export default Home;
