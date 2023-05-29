import { useState, useEffect } from "react";
import TopBar from "./TopBar";
import { supabase } from "../supabase";
import ItemManager from "./ItemManager";
import { Container } from "@mui/material";
import SideBar from "./SideBar";

function ItemScreen() {
  const [items, setItems] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const fetchItems = () => {
    supabase
      .from("items")
      .select()
      .order("id")
      .then((result) => {
        setItems(result.data);
        setError(result.error);
      });
  };

  useEffect(() => {
    fetchItems();
  }, [setItems, setError]);

  return (
    <>
      <TopBar />
      <SideBar />
      <div>
        <h1>ItemScreen</h1>
        {items && <ItemManager />}
      </div>
    </>
  );
}

export default ItemScreen;
