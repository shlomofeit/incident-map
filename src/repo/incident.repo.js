import { ObjectId } from "mongodb";

export function createRepo(collection) {
  async function createOne(obj) {
    const result = await collection.insertOne(obj);
    const { _id, ...user } = obj;
    return { id: result.insertedId.toString(), ...user };
  }

  async function getAll(query = {}) {
    const data = await collection.find(query).toArray();
    return data.map(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }));
  }

  async function getById(id) {
    const result = await collection.findOne({ _id: new ObjectId(id) });
    if (!result) return null;
    result.id = result._id.toString();
    delete result._id;

    return result;
  }

  async function updateById(id, obj) {
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: obj },
      { returnDocument: "after" },
    );
    if (!result) return null;
    const { _id, ...rest } = result;
    return { id: _id.toString(), ...rest };
  }

  async function deleteById(id) {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  return {
    createOne,
    getAll,
    getById,
    updateById,
    deleteById,
  };
}
