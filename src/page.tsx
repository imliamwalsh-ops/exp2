import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
export default function TodosPage() {
  const [todos, setTodos] = useState<any[]>([]);

  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    const { data, error } = await supabase
      .from("todos")
      .select();

    if (error) {
      console.error(error);
      return;
    }

    setTodos(data || []);
  }

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.name}</li>
      ))}
    </ul>
  );
}