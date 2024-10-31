import express from 'express';
import { ESLint } from 'eslint';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

app.post('/', async (req, res) => {
  const { file, fileName } = req.body;

  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: {
      rules: {
        eqeqeq: 'error',
        'no-else-return': 'error',
        camelcase: 'error',
        'no-unused-vars': 'error',
        'no-var': 'error',
      },
    },
  });

  const results = await eslint.lintText(file, { filePath: fileName });

  const issues = results[0].messages.map((message) => {
    return {
      path: fileName,
      position: message.line,
      message: message.message,
    };
  });

  console.log('file', req.body);
  res.status(200).json({ issues });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
