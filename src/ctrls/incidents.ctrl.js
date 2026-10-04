import { getDb } from "../db/db.js";
import { createRepo } from "../repo/incident.repo.js";
import { createIncidentService } from "../services/incident.service.js";

const db = await getDb();
const collection = db.collection("incidents");

export async function getIncidents(req, res) {
  const { category } = req.query;
  const filter = {};
  if (category) {
    filter.category = category;
  }
  const incidents = await createRepo(collection).getAll(filter);

  return res.status(200).json({
    success: true,
    date: incidents,
  });
}

export async function getIncidentById(req, res) {
  const id = req.params.id;
  if (!id)
    throw Object.assign(new Error("Incident not found"), { status: 404 });

  const incident = await createRepo(collection).getById(id);

  return res.status(200).json({
    success: true,
    date: incident,
  });
}

export async function createIncident(req, res) {
  const reqIncident = req.body;
  const incident = createIncidentService(reqIncident, req.user.id);
  const result = await createRepo(collection).createOne(incident);

  if (!result) throw Error("Somthing wrong with the db");

  res.status(201).json({
    success: true,
    data: {
      incident: result,
    },
  });
}

export async function updateIncident(req, res) {
  const { id } = req.params;

  const incident = await createRepo(collection).getById(id);
  if (!incident) {
    throw Object.assign(new Error("Incident not found"), { status: 404 });
  }

  if (incident.createdBy !== req.user.id && req.user.role !== "admin") {
    throw Object.assign(
      new Error("Forbidden: You can only edit your own incidents"),
      { status: 403 },
    );
  }

  const updateData = {
    ...req.body,
    updatedAt: new Date(),
  };

  const updated = await createRepo(collection).updateById(id, updateData);

  return res.status(200).json({
    success: true,
    data: updated,
  });
}

export async function deleteIncident(req, res) {
  const { id } = req.params;
  const incident = await createRepo(collection).getById(id);
  if (!incident) {
    throw Object.assign(new Error("Incident not found"), { status: 404 });
  }

  if (incident.createdBy !== req.user.id && req.user.role !== "admin") {
    throw Object.assign(
      new Error("Forbidden: You can only delete your own incidents"),
      { status: 403 },
    );
  }

  await createRepo(collection).deleteById(id);

  return res.status(200).json({
    success: true,
    data: { message: "Incident deleted successfully" },
  });
}
