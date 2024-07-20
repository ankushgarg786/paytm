const express = require("express");
const router = express.Router();
const zod = require("zod");
const { User } = require("../db");
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

  if (exisitngUser._id) {
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
  const newUserId = newUser._id;
  const token = jwt.sign(
    {
      newUserId,
    },
    { JWT_SECRET }
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
router.get("/signin", async (req, res) => {
  const { succeess } = singinSchema.safeParse(req.body);
  if (!succeess) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }
  const findUser = User.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  if (findUser) {
    const token = jwt.sign(
      {
        userId: findUser._id,
      },
      { JWT_SECRET }
    );
    res.json({
      token: token,
    });
  }
  res.status(411).json({
    message: "Error while logging in",
  });
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
