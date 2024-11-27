import React, { useState } from "react";
import { Button } from "../Button/Button";
import { useRequests } from "../Hooks/useRequests";
import styles from "./login-page.module.css";

interface User {
  name: string;
  login: string;
  password: string;
}

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { constructors, loading, error: contextError } = useRequests();
  const [userLogin, setUserLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState("password");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const currentUser = constructors.find(
      (u) => u.login === userLogin && u.password === password
    );

    if (currentUser) {
      onLogin(currentUser);
      setError(null);
    } else {
      setError("Неверный логин или пароль");
    }
  };

  if (loading) {
    return <p className={styles.loading}>Загрузка пользователей...</p>;
  }

  return (
    <div className={styles.loginContainer}>
      <h2>Web Doc авторизация</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Введите логин: </label>
          <input
            type="text"
            placeholder="Логин"
            value={userLogin}
            onChange={(event) => setUserLogin(event.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Введите пароль: </label>
          <input
            type={showPassword}
            placeholder="Пароль"
            value={password}
            autoComplete="on"
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <span
            className={styles.passwordToggle}
            onClick={() =>
              setShowPassword(showPassword === "password" ? "text" : "password")
            }
          >
            {showPassword === "password" ? "👁" : "👁️"}
          </span>
        </div>
        <div className={styles.formGroup_button}>
          <Button type="submit">Войти</Button>
        </div>
      </form>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {contextError && <p className={styles.errorMessage}>{contextError}</p>}
    </div>
  );
};
