'use client';

import * as React from "react";
import { useMDXComponent } from "next-contentlayer/hooks";
import type { MDXComponents } from "mdx/types";
import { mdxComponents } from "../lib/mdx-components";

interface MdxContentProps {
  code: string;
}

function patchBundledCode(source: string): string {
  return source.replace(
    /return\s+e===null\?\s*null\s*:\s*e\.getOwner\(\)/g,
    'return e===null ? null : typeof e.getOwner === "function" ? e.getOwner() : null'
  );
}

export function MdxContent({ code }: MdxContentProps) {
  const safeCode = React.useMemo(() => patchBundledCode(code), [code]);

  return React.createElement(
    useMDXComponent(safeCode) as unknown as React.ComponentType<{ components: MDXComponents }>,
    { components: mdxComponents }
  );
}

