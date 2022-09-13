import { z } from "zod"

export const configSchema = z.record(
	z.string(),
	z.object({
		hooks: z.array(z.string().url()),
		repositories: z.union([
			z.array(
				z.string().refine((arg) => arg.includes("/"), {
					message: "Repository should have a '/' in it",
				}),
			),
			z.string().transform((str) => str.split("\n").filter(Boolean)),
		]),
	}),
)
