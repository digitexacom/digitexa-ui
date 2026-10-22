"use client";

import * as React from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationControls,
} from "@/components/ui/pagination";

export default function Demo() {
  const [page, setPage] = React.useState(3);
  return (
    <div className="flex flex-col gap-4">
      {/* controlled, numbered */}
      <PaginationControls page={page} pageCount={12} onPageChange={setPage} />

      {/* compact: Page 3 of 12 */}
      <PaginationControls page={page} pageCount={12} onPageChange={setPage} variant="compact" aria-label="Issues pagination" />

      {/* link-based primitives, e.g. for ?page= URLs */}
      <Pagination aria-label="Projects pagination">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#preview" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#preview">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#preview" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#preview">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#preview" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
