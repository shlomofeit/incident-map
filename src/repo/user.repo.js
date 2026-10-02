import { ObjectId } from "mongodb";

export function createRepo(collection) {
  async function createOne(obj) {
    try {
      const result = await collection.insertOne(obj);
      const { password, _id, ...user } = obj;
      return { id: result.insertedId.toString(), ...user };
    } catch (error) {
      if (error.code === 11000)
        throw Object.assign(new Error("Email already exists"), { status: 409 });
      throw error;
    }
  }

  async function getById(id) {
    const result = await collection.findOne({ _id: new ObjectId(id) });
    if (!result) return null;
    return { id: result._id.toString(), ...result };
  }

  async function getBy(data) {
    const result = await collection.findOne({ data });
    if (!result) return null;
    return { id: result._id.toString(), ...result };
  }

  async function updateById(id, obj) {
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: obj },
      { returnDocument: "after" },
    );
    return result;
  }

  async function deleteById(id) {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  return {
    createOne,
    getById,
    getBy,
    updateById,
    deleteById,
  };
}
