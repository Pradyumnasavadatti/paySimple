const zod = require("zod");
const userVal = zod.object({
  userName: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod
    .string()
    .min(6)
    .max(8)
    .regex(/[A-Za-z0-9@#]/, {
      message: "Can only include alpha numerics or @ or #",
    }),
});

const updateZod = zod.object({
  password: zod
    .string()
    .min(6)
    .max(8)
    .regex(/[A-Za-z0-9@#]/, {
      message: "Can only include alpha numerics or @ or #",
    })
    .optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

module.exports = { userVal, updateZod };
