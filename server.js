import express from 'express';
import { ESLint } from 'eslint';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

app.post('/', async (req, res) => {
  const { file, fileName } = req.body;

  const eslint = new ESLint({
    useEslintrc: false,
    overrideConfig: {
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
      ],
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

  res.status(200).json({ issues });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const test = JSON.stringify(`
interface Props {
  data: string
}

function sample(): Props {
  const CONSTANT_INSIDE_COMPONENT = 'it-should fail';
}

export const ReactComponent = (props: Props) => {
  const abc = 'abc' + testConst;
  var newVar = '';
  const testFunc = elseIfReturnFunction();

  const snake_case_const = '';

  // Else Return error statement
  const newFunc = (x) => {
    if (x) return;
    else return '1';
  };

  return <div>test</div>;
};
`);

console.log('test', test);
