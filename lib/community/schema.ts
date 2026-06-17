import { z } from "zod";

export const groupCreateSchema = z.object({
  name: z.string().trim().min(3),
  description: z.string().trim().min(10),
  category: z.string().trim().min(2),
  city: z.string().trim().min(2),
  state: z.string().trim().optional(),
  country: z.string().trim().default("BR"),
  coverImage: z.string().trim().url().optional().or(z.literal("")),
  isPrivate: z.boolean().default(false),
  organizerId: z.string().trim().min(1)
});

export const groupUpdateSchema = groupCreateSchema
  .omit({ organizerId: true })
  .partial()
  .extend({
    userId: z.string().trim().min(1)
  });

export const groupJoinSchema = z.object({
  userId: z.string().trim().min(1)
});

export const eventCreateSchema = z.object({
  groupId: z.string().trim().min(1),
  userId: z.string().trim().min(1),
  title: z.string().trim().min(3),
  description: z.string().trim().min(10),
  date: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  location: z.string().trim().optional(),
  isOnline: z.boolean().default(false),
  meetLink: z.string().trim().url().optional().or(z.literal("")),
  capacity: z.number().int().positive().optional(),
  price: z.number().min(0).default(0),
  coverImage: z.string().trim().url().optional().or(z.literal(""))
});

export const eventUpdateSchema = eventCreateSchema
  .omit({ groupId: true })
  .partial()
  .extend({
    userId: z.string().trim().min(1)
  });

export const rsvpSchema = z.object({
  userId: z.string().trim().min(1),
  status: z.enum(["YES", "NO", "WAITLIST"]).default("YES")
});

export const communitySuggestionSchema = z.object({
  destino: z.string().trim().min(2),
  objetivo: z.string().trim().min(2)
});
