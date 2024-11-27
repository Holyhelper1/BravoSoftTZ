import React, { useState } from "react";
import { useRequests } from "../../Hooks/useRequests";
import { Button } from "../../Button/Button";
import styles from "./request-form.module.css";
interface RequestFormProps {
  onSubmit: () => void;
}

export const RequestForm: React.FC<RequestFormProps> = ({ onSubmit }) => {
  const { constructors, requests, fetchRequests } = useRequests();
  const [selectedConstructorId, setSelectedConstructorId] = useState<number>(0);
  const [documentName, setDocumentName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (documentName.trim() === "") {
      setError("Наименование документа не может быть пустым");
      return;
    }

    const existingRequest = requests.find(
      (request) =>
        request.constructorId === selectedConstructorId &&
        request.documentName === documentName
    );

    if (existingRequest) {
      setError(
        "Вы уже отправляли заявку на этот документ, она уже была учтена"
      );
      return;
    }

    const newRequest = {
      constructorId: selectedConstructorId,
      documentName,
    };

    try {
      const response = await fetch("http://localhost:3005/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRequest),
      });

      if (!response.ok) {
        throw new Error("Ошибка при отправке заявки");
      }

      setSelectedConstructorId(0);
      setDocumentName("");
      setError("");

      await fetchRequests();

      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
      }, 3000);
      onSubmit();
    } catch (error) {
      setError("Доступно только чтение данных, пожалуйста, попробуйте позже.");
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Подать заявку</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="constructor">Выберите конструктора: </label>
          <select
            id="constructor"
            value={selectedConstructorId}
            onChange={(e) => setSelectedConstructorId(Number(e.target.value))}
            required
          >
            <option value={0} disabled>
              -- Выберите конструктора --
            </option>
            {constructors.map((constructor) => (
              <option key={constructor.id} value={constructor.id}>
                {constructor.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="documentName">Наименование документа: </label>
          <input
            id="documentName"
            type="text"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup_button}>
          <Button
            disabled={selectedConstructorId === 0 || documentName.trim() === ""}
            type="submit"
          >
            Отправить
          </Button>
          <div>
            {selectedConstructorId === 0 && (
              <p className={styles.errorMessage}>Выберите конструктора</p>
            )}
          </div>
          {successMessage && (
            <div className={styles.successMessage}>
              Заявка успешно отправлена
            </div>
          )}
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </form>
    </div>
  );
};
