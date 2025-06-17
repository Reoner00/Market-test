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
router.get("/:id", auth, GET_BY_ID);
router.get("/", auth, GET_SORTED);
router.post("/", auth, INSERT);
router.put("/:id", auth, UPDATE_BY_ID);
router.delete("/:id", auth, DELETE_BY_ID);

export default router;
