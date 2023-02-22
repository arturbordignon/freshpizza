import { ChangeEvent, FormEvent, useState } from "react";
import Head from "next/head";
import styles from "./styles.module.scss";

import { canSSRAuth } from "../../utils/canSSRAuth";
import { Header } from "../../components/Header";
import { FiUpload } from "react-icons/fi";

import { setupAPIClient } from "../../services/api";
import { toast } from "react-toastify";

type ItemProps = {
  id: string;
  name: string;
};

interface CategoryProps {
  categoryList: ItemProps[];
}

export default function Product({ categoryList }: CategoryProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [avatarUrl, setAvatarUrl] = useState("");
  const [imageAvatar, setImageAvatar] = useState(null);

  const [categories, setCategories] = useState(categoryList || []);
  const [categorySelected, setCategorySelected] = useState(0);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return;
    }

    const image = e.target.files[0];

    if (!image) {
      return;
    }

    if (image.type === "image/jpeg" || image.type === "image/png") {
      setImageAvatar(image);
      setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  }

  function handleChangeCategory(e) {
    setCategorySelected(e.target.value);
  }

  async function handleRegisterProduct(e: FormEvent) {
    e.preventDefault();

    try {
      const data = new FormData();

      if (
        name === "" ||
        price === "" ||
        description === "" ||
        imageAvatar === null
      ) {
        toast.error("Fill in all fields");
        return;
      }

      data.append("name", name);
      data.append("price", price);
      data.append("description", description);
      data.append("category_id", categories[categorySelected].id);
      data.append("file", imageAvatar);

      const apiClient = setupAPIClient();

      await apiClient.post("/product", data);

      toast.success("Product registered successfully");
    } catch (err) {
      console.log(err);
      toast.error("Error registering product");
    }

    setName("");
    setPrice("");
    setDescription("");
    setAvatarUrl("");
    setImageAvatar(null);
  }

  return (
    <>
      <Head>
        <title>New Product</title>
      </Head>
      <div>
        <Header />

        <main className={styles.container}>
          <h1>New Product</h1>

          <form className={styles.form} onSubmit={handleRegisterProduct}>
            <label className={styles.labelAvatar}>
              <span>
                <FiUpload size={30} color="#fff" />
              </span>

              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFile}
              />

              {avatarUrl && (
                <img
                  className={styles.preview}
                  src={avatarUrl}
                  alt="Product Image"
                  width={250}
                  height={250}
                />
              )}
            </label>

            <select value={categorySelected} onChange={handleChangeCategory}>
              {categories.map((item, index) => {
                return (
                  <option key={item.id} value={index}>
                    {item.name}
                  </option>
                );
              })}
            </select>

            <input
              className={styles.input}
              type="text"
              placeholder="Enter the name of the product"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className={styles.input}
              type="text"
              placeholder="Product Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <textarea
              className={styles.input}
              placeholder="Describe the product..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
  const apiClient = setupAPIClient(context);

  const response = await apiClient.get("/category");

  return {
    props: {
      categoryList: response.data,
    },
  };
});
