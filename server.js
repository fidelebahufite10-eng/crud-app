const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.static("public"));

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/projet")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err.message));

const Student = mongoose.model(
  "Student",
  new mongoose.Schema({
    name: { type: String, required: true },
    regNo: { type: String, required: true },
    course: { type: String, default: "" },
  })
);

// CREATE
app.post("/api/students", async (req, res) => {
  try {
    res.status(201).json(await Student.create(req.body));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// READ
app.get("/api/students", async (req, res) => {
  res.json(await Student.find().sort({ _id: -1 }));
});

// UPDATE
app.put("/api/students/:id", async (req, res) => {
  try {
    const s = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!s) return res.status(404).json({ error: "Not found" });
    res.json(s);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE
app.delete("/api/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));