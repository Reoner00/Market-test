import express from "express";
import auth from "../middlewares/auth.js";

import {
  INSERT_USER,
  GET_ALL,
  UPDATE_BY_ID,
  DELETE_BY_ID,
  LOGIN_USER,
  SAVE_PRODUCT_TO_USER,
  GET_MY_PROFILE,
  GET_USER_BY_ID,
} from "../controllers/user.js";

const router = express.Router();

router.get("/", GET_ALL);

router.post("/", INSERT_USER);

router.post("/login", LOGIN_USER);

router.post("/product/save", SAVE_PRODUCT_TO_USER);

router.get("/me", auth, GET_MY_PROFILE);

router.get("/personal", auth, GET_USER_BY_ID);

router.put("/:id", UPDATE_BY_ID);

router.delete("/:id", DELETE_BY_ID);

export default router;
