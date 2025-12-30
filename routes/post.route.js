import express from "express";

const router = express.Router();

router.get("/test", (req, res) => {
  console.log("test router");
  console.log("CN TEST LOG", Date.now()); // debug log
});

export default router;
