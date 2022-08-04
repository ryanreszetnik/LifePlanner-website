import { Button, Input } from "@mui/material";
import React, { useContext } from "react";
import { APIContext } from "./index";

export default function SignIn() {
  const API = useContext(APIContext);
  return (
    <div>
      <Input placeholder="Email" type="email"></Input>
      <Input placeholder="Password" type="password"></Input>
      <Button onClick={() => API?.login("bob@bob.com", "password")}>
        Login
      </Button>
    </div>
  );
}
