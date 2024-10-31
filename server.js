import express from 'express';
import { ESLint } from 'eslint';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/', async (req, res) => {
  const { file, fileName, rules } = req.body;

  const eslint = new ESLint({
    useEslintrc: false,
    overrideConfig: {
      parser: '@typescript-eslint/parser',
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true,
        },
      },
      env: {
        es2022: true,
        node: true,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        ...rules,
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

  res.status(200).json({ issues });
});

app.listen(PORT, () => {
  console.log('🚀 Server is running');
});
