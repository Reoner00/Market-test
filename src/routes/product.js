import express from "express";
import {
  GET_ALL,
  GET_BY_ID,
  GET_SORTED,
  INSERT,
  UPDATE_BY_ID,
  DELETE_BY_ID,
} from "../controllers/product.js";

import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", auth, GET_ALL);
router.get("/:id", GET_BY_ID);
router.get("/", GET_SORTED);
router.post("/", INSERT);
router.put("/:id", UPDATE_BY_ID);
router.delete("/:id", DELETE_BY_ID);

export default router;
