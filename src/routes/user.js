import express from "express";
import {
  INSERT_USER,
  GET_ALL,
  UPDATE_BY_ID,
  DELETE_BY_ID,
  LOGIN_USER,
} from "../controllers/user.js";
const router = express.Router();

router.get("/", GET_ALL);

router.post("/", INSERT_USER);

router.post("/login", LOGIN_USER);

router.put("/:id", UPDATE_BY_ID);

router.delete("/:id", DELETE_BY_ID);

export default router;
