import { Head } from "../../components/Head";
import styles from "./styles.module.scss";

const Posts = () => {
  return (
    <>
      <Head title="Post | IgNews" />
      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>12 de maio de 2022</time>
            <strong>Boas práticas para devs em início de carreira</strong>
            <p>
              As principais lições e dicas compiladas para quem está começando
              na programação ou migrando para a área. *Texto por Camila Coelho
            </p>
          </a>
          <a href="#">
            <time>12 de maio de 2022</time>
            <strong>Boas práticas para devs em início de carreira</strong>
            <p>
              As principais lições e dicas compiladas para quem está começando
              na programação ou migrando para a área. *Texto por Camila Coelho
            </p>
          </a>
          <a href="#">
            <time>12 de maio de 2022</time>
            <strong>Boas práticas para devs em início de carreira</strong>
            <p>
              As principais lições e dicas compiladas para quem está começando
              na programação ou migrando para a área. *Texto por Camila Coelho
            </p>
          </a>
        </div>
      </main>
    </>
  );
};

export default Posts;
