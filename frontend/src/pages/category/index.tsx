import { FormEvent, useState } from "react";
import Head from "next/head";
import { Header } from "../../components/Header";
import styles from "./styles.module.scss";
import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";
import { canSSRAuth } from "../../utils/canSSRAuth";

export default function Category() {
  const [name, setName] = useState("");

  async function handleRegister(e: FormEvent) {
    e.preventDefault();

    if (name === "") {
      return;
    }

    const apiClient = setupAPIClient();

    await apiClient.post("/category", {
      name: name,
    });

    toast.success("Category registered successfully!");

    setName("");
  }

  return (
    <>
      <Head>
        <title>New Category</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <h1>Register Categories</h1>

          <form className={styles.form} onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Enter the category name"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button className={styles.buttonAdd} type="submit">
              Register
            </button>
          </form>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (context) => {
  return {
    props: {},
  };
});
