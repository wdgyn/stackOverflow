import { initDBIfNecessary } from "./utils.js";

export async function performSearch(query) {
  const db = await initDBIfNecessary();

  const regex = new RegExp(query, "i"); // case-insensitive match

  const [questions, answers, users] = await Promise.all([
    db.collection("questions").find({
      $or: [
        { title: regex },
        { body: regex },
        { tags: { $in: [regex] } }
      ]
    }).toArray(),

    db.collection("answers").find({
      body: regex
    }).toArray(),

    db.collection("users").find({
      $or: [
        { username: regex },
        { fullName: regex }
      ]
    }).toArray()
  ]);

  return { questions, answers, users };
}
