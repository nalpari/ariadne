import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}", "worker/**/*.ts", "tests/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/lib/supabase/service"],
              message:
                "Import the service-role Supabase client only from route handlers, worker files, or server-only modules.",
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      "src/app/api/**/*.ts",
      "src/lib/supabase/service.ts",
      "worker/**/*.ts",
      "tests/**/*.ts",
    ],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
