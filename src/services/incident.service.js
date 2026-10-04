import { z } from "zod";

const incidentSchema = z.object({
  title: z
    .string("Title must be string")
    .min(2, "title must have at least 2 characters"),
  description: z
    .string("Description must be string")
    .min(2, "Description must have at least 2 characters"),
  category: z.enum(
    ["fire", "flood", "accident", "medical", "other"],
    "Category must be fire, flood, accident, medical, or other",
  ),
  location: z.object({
    lat: z
      .number("lat must be number")
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90"),
    lng: z
      .number("lng must be number")
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180"),
  }),
  status: z
    .enum(
      ["open", "in_progress", "closed"],
      "Status must be open, in_progress or closed",
    )
    .default("open"),
});

const updateIncidentSchema = incidentSchema.partial();

export function createIncidentService(incident, userId) {
  const validation = incidentSchema.safeParse(incident);
  if (!validation.success)
    throw Object.assign(new Error(validation.error.issues[0].message), {
      status: 400,
    });

  const now = new Date();

  return {
    ...validation.data,
    status: validation.data.status || "open",
    createdBy: userId,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateIncidentService(updateData) {
  const validation = updateIncidentSchema.safeParse(updateData);
  if (!validation.success) {
    throw Object.assign(new Error(validation.error.issues[0].message), {
      status: 400,
    });
  }

  return {
    ...validation.data,
    updatedAt: new Date(),
  };
}
