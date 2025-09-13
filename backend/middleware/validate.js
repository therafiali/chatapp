const { z } = require("zod");

exports.validate = (schema) => (req, res, next) => {
  const parsed = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!parsed.success) {
    return res.status(400).json({
      message: "Validation error",
      errors: parsed.error.flatten(),
    });
  }

  // Overwrite req.body/query/params with parsed data
  req.body = parsed.data.body;
  req.query = parsed.data.query;
  req.params = parsed.data.params;

  next();
};

exports.signupSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

