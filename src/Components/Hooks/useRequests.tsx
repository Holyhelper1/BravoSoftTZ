import React, { createContext, useContext, useEffect, useState } from "react";

interface Constructor {
  id: number;
  name: string;
  login: string;
  password: string;
}

interface Request {
  id: number;
  constructorId: number;
  documentName: string;
}

interface RequestsContextProps {
  constructors: Constructor[];
  requests: Request[];
  error: string | null;
  loading: boolean;
  fetchRequests: () => Promise<void>;
}

const RequestsContext = createContext<RequestsContextProps | undefined>(
  undefined
);

export const RequestsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [constructors, setConstructors] = useState<Constructor[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const dataUrl = "http://localhost:3005/constructors"; // URL для загрузки данных конструкторов
  const requestsUrl = "http://localhost:3005/requests"; // URL для загрузки данных запросов
  const localJsonPath = "/DB.json";                     // Путь к локальному JSON-файлу

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const responseRequests = await fetch(requestsUrl);
      if (!responseRequests.ok) {
        throw new Error("Ошибка при загрузке данных запросов");
      }
      const requestsData = await responseRequests.json();
      setRequests(requestsData);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const responseConstructors = await fetch(dataUrl);
      if (!responseConstructors.ok) {
        throw new Error("Ошибка при загрузке данных конструкторов");
      }
      const constructorData = await responseConstructors.json();
      setConstructors(constructorData);
      await fetchRequests();
    } catch (error) {
      console.error(
        "Не удалось получить данные с сервера, пытаемся загрузить локальный JSON...",
        error
      );
      try {
        const responseLocalJson = await fetch(localJsonPath);
        if (!responseLocalJson.ok) {
          throw new Error("Ошибка при загрузке локального файла");
        }
        const localData = await responseLocalJson.json();
        setConstructors(localData.constructors || []);
        setRequests(localData.requests || []);
        setError(null);
      } catch (localError) {
        setError(
          localError instanceof Error
            ? localError.message
            : "Ошибка при загрузке локального файла"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log("requests", requests);

  return (
    <RequestsContext.Provider
      value={{ constructors, requests, error, loading, fetchRequests }}
    >
      {children}
    </RequestsContext.Provider>
  );
};

export const useRequests = () => {
  const context = useContext(RequestsContext);
  if (!context) {
    throw new Error("useRequests must be used within a RequestsProvider");
  }
  return context;
};
