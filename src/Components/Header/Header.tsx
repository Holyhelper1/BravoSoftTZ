import React from "react";
import styles from "./header.module.css";
import { Button } from "../Button/Button";

interface HeaderProps {
  username: string;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ username, onLogout }) => {
  return (
    <header className={styles.header}>
      <div>
        <h3>📚 Web Doc 3.0</h3>
      </div>
      <div>
        <h3>🙍‍♂️{username}</h3>
        <Button onClick={onLogout}>Выйти из аккаунта</Button>
      </div>
    </header>
  );
};
