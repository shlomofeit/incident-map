import { getDb } from "../db/db.js";
import { createRepo } from "../repo/user.repo.js";
import { createUser, Login } from "../services/auth.service.js";
import { generateToken } from "../utils/generateToken.js";

const db = await getDb();
const collection = await db.collection("users");
collection.createIndex({ email: 1 }, { unique: true });

export async function createUserCtrls(req, res) {
  const { email, password } = req.body;
  const normalEmail = email.toLowerCase().trim();
  const user = await createUser(normalEmail, password);
  const result = await createRepo(collection).createOne(user);
  if (!result) throw Error("Somthing wrong with the db");

  res.status(201).json({
    success: true,
    data: {
      user: result,
      token: generateToken({ id: user.id, role: user.role }),
    },
  });
}

export async function loginCtrl(req, res) {
  const { email, password } = req.body;
  const normalEmail = email.toLowerCase().trim();
  const user = await createRepo(collection).getByEmail(normalEmail);
  if (!user)
    throw Object.assign(new Error("Invalid credentials"), { status: 401 });

  const result = await Login(user, password);
  res.status(200).json({
    success: true,
    data: {
      user: result,
      token: generateToken({ id: user.id, role: user.role }),
    },
  });
}

export async function getMe(req, res, next) {
  try {
    const user = await createRepo(collection).getById(req.user.id);
    console.log("result:\n", user);
    if (!user)
      throw Object.assign(new Error("User not found"), { status: 404 });

    const { password, ...safeUser } = user;

    return res.status(200).json({ success: true, data: safeUser });
  } catch (error) {
    next(error);
  }
}
