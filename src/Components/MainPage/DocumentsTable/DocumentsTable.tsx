import React, { useEffect, useState } from "react";
import { useRequests } from "../../Hooks/useRequests";
import styles from "./documents.module.css";

interface DocumentCount {
  documentName: string;
  count: number;
}

export const DocumentTable = () => {
  const { requests, loading, error: contextError } = useRequests();
  const [documentCounts, setDocumentCounts] = useState<DocumentCount[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (requests?.length > 0) {
      const counts = requests.reduce<Record<string, number>>((acc, request) => {
        acc[request.documentName] = (acc[request.documentName] || 0) + 1;
        return acc;
      }, {});

      const countsArray = Object.keys(counts).map((doc) => ({
        documentName: doc,
        count: counts[doc],
      }));

      countsArray.sort((a, b) => b.count - a.count);
      setDocumentCounts(countsArray);
      setError("");
    } else {
      setDocumentCounts([]);
      setError("Заявок не найдено");
    }
  }, [requests]);

  if (loading) {
    return <p className={styles.loading}>Загрузка заявок...</p>;
  }

  if (contextError) {
    return <p style={{ color: "red" }}>{contextError}</p>;
  }

  return (
    <div className={styles.listContainer}>
      <h2>Список заявок</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Количество заявок</th>
            <th>Наименование документа</th>
          </tr>
        </thead>
        <tbody>
          {documentCounts.map((item) => (
            <tr key={item.documentName}>
              <td>{item.count}</td>
              <td>{item.documentName}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};
