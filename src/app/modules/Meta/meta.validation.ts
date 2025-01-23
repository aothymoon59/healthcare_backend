import { z } from "zod";

const createOrUpdateCompanyInfo = z.object({
  companyName: z.string().min(1, "Company name is required"),
  address: z.string().optional(),
  email: z.string().email("Invalid email format").optional(),
  phoneNumber: z.string().optional(),
  telephone: z.string().optional(),
  website: z.string().url("Invalid URL for website").optional(),
  facebookUrl: z.string().url("Invalid URL for Facebook").optional(),
  instagramUrl: z.string().url("Invalid URL for Instagram").optional(),
  twitterUrl: z.string().url("Invalid URL for Twitter").optional(),
  linkedinUrl: z.string().url("Invalid URL for LinkedIn").optional(),
});

export const MetaValidation = {
  createOrUpdateCompanyInfo,
};
