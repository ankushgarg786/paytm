const express = require("express");
const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

const signupSchema = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});
router.post("/signup", async (req, res) => {
  const body = req.body;
  const { success } = signupSchema.safeParse(req.body);

  if (!success) {
    return res.json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const exisitngUser = await User.findOne({
    username: req.body.username,
  });

  if (exisitngUser) {
    return res.json({
      message: "Email already taken / Incorrect inputs",
    });
  }
  const newUser = await User.create({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
  });
  const userId = newUser._id;

  await Account.create({
    userId: userId,
    balance: Number((Math.random() * (10000 - 200) + 200).toFixed(2)),
  });

  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );
  res.json({
    message: "User created Successfully",
    token: token,
  });
});

const singinSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});
router.post("/signin", async (req, res) => {
  const { success } = singinSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }
  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (user) {
    const userId = user._id;
    const token = jwt.sign(
      {
        userId: userId,
      },
      JWT_SECRET
    );
    return res.json({
      token: token,
    });
  } else {
    return res.status(411).json({
      message: "Error while logging in",
    });
  }
});

const updateSchema = zod.object({
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
  password: zod.string().optional(),
});
router.put("/", authMiddleware, async (req, res) => {
  const { success } = updateSchema.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }
  await User.updateOne({ _id: req.userId }, req.body);
  res.json({
    message: "Updated successfully",
  });
});

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});
module.exports = router;
