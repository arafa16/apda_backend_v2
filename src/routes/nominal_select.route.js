const express = require("express");
const {
  getDatas,
  getDataSelect,
  getDataTable,
  getDataById,
  createData,
  updateData,
  deleteData,
} = require("../controllers/nominal_select.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/datas", verifyToken, getDatas);
router.get("/select", verifyToken, getDataSelect);
router.get("/table", verifyToken, getDataTable);
router.get("/data/:uuid", verifyToken, getDataById);
router.post("/data", verifyToken, createData);
router.patch("/data/:uuid", verifyToken, updateData);
router.delete("/data/:uuid", verifyToken, deleteData);

module.exports = router;
