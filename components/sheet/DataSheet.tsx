"use client";
import { Skeleton } from "@/components/ui/skeleton";
import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function GetAllFilms({
  filmUrl,
  count,
}: {
  filmUrl: string;
  count: number;
}) {
  const [data, setData]: any = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const fetchData = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setData(result);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
    }
  };
  React.useEffect(() => {
    fetchData(filmUrl);
  }, []);
  return (
    <>
      {isLoading == true ? (
        <Skeleton className="h-8 w-[200px]" />
      ) : (
        <div className="w-full bg-gray-200 p-2 font-semiBold rounded-md">
          {`${Number(count) + 1}) ${data?.title}`}
        </div>
      )}
    </>
  );
}

export function DataSheet(row: any) {
  const [openSheet, setOpenSheet] = React.useState(false);
  return (
    <Sheet open={openSheet} onOpenChange={() => setOpenSheet(!openSheet)}>
      <Button
        className="bg-[#f9f2ff] font-bold"
        variant="outline"
        onClick={() => setOpenSheet(!openSheet)}
      >
        View More
      </Button>
      <SheetContent>
        <SheetHeader className="py-5">
          <SheetTitle className="font-bold text-3xl">
            {row?.original?.name}
          </SheetTitle>
          <SheetDescription>
            <Link
              className="text-red-600 font-normal underline text-lg break-words"
              href={row?.original?.url}
              target="_blank"
            >
              {row?.original?.url}
            </Link>
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {row?.original?.films?.map((data: any, index: any) => {
            return <GetAllFilms key={index} filmUrl={data} count={index} />;
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
