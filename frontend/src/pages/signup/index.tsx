import { FormEvent, useState, useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../../../styles/home.module.scss";

import logoImg from "../../../public/logo.svg";

import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { AuthContext } from "../../contexts/AuthContext";

import { toast } from "react-toastify";

import Link from "next/link";

export default function SignUp() {
  const { signUp } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSignUp(e: FormEvent) {
    e.preventDefault();

    if (name === "" || email === "" || password === "") {
      toast.warning("Fill in all fields");
      return;
    }

    setLoading(true);

    let data = {
      name,
      email,
      password,
    };

    await signUp(data);

    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt="Pizzaria Logo" />

        <div className={styles.login}>
          <h1>Create your account</h1>

          <form onSubmit={handleSignUp}>
            <Input
              placeholder="Enter your Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Enter you Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Digite sua Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" loading={loading}>
              Register
            </Button>
          </form>
          <Link className={styles.text} href="/">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </>
  );
}
