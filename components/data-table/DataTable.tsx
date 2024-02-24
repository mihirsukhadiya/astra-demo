"use client";
import * as React from "react";
import { CaretSortIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataSheet } from "../sheet/DataSheet";
import { AlertDestructive } from "../alert/Alert";

export type ColumnsProps = {
  id: string;
  height: string;
  name: string;
  mass: string;
  gender: string;
  hair_color: string;
};
export const DATA_FETCH_URL = "https://swapi.dev/api/people/?page=1";
export const columns: ColumnDef<ColumnsProps>[] = [
  {
    accessorKey: "height",
    header: "Height",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("height")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "mass",
    header: "Mass",
    cell: ({ row }) => <div className="capitalize">{row.getValue("mass")}</div>,
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("gender")}</div>
    ),
  },
  {
    accessorKey: "hair_color",
    header: "Hair Color",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("hair_color")}</div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <div className="capitalize">{DataSheet(row)}</div>,
  },
];

export const DataTable = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState<boolean | null>(true);
  const [error, setError] = React.useState<boolean | null>(null);
  const fetchData = async (url: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setData(result);
      setIsLoading(false);
    } catch (error: any) {
      setError(error);
      setIsLoading(false);
    }
  };
  React.useEffect(() => {
    fetchData(DATA_FETCH_URL);
  }, []);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data: data?.results || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
    pageCount: Math.ceil(data?.count / data?.results?.length) ?? -1,
  });
  return (
    <>
      <div className="w-full">
        <div>
          <h2 className="text-center text-xl my-3 bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400  bg-clip-text text-transparent font-bold">
            The Star Wars Data
          </h2>
        </div>
        {isLoading == true ? (
          <Skeleton className="h-[70vh] w-full" />
        ) : (
          <>
            {error ? (
              <AlertDestructive />
            ) : (
              <>
                <div className="flex items-center py-4">
                  <Input
                    placeholder="Filter emails..."
                    value={
                      (table.getColumn("name")?.getFilterValue() as string) ??
                      ""
                    }
                    onChange={(event) =>
                      table
                        .getColumn("name")
                        ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="ml-auto">
                        Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {table
                        ?.getAllColumns()
                        ?.filter((column) => column.getCanHide())
                        ?.map((column) => {
                          return (
                            <DropdownMenuCheckboxItem
                              key={column.id}
                              className="capitalize"
                              checked={column.getIsVisible()}
                              onCheckedChange={(value) =>
                                column.toggleVisibility(!!value)
                              }
                            >
                              {column.id}
                            </DropdownMenuCheckboxItem>
                          );
                        })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      {table?.getHeaderGroups()?.map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup?.headers?.map((header) => {
                            return (
                              <TableHead
                                key={header.id}
                                className="font-bold py-2 px-4 whitespace-nowrap"
                              >
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                              </TableHead>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table?.getRowModel()?.rows?.length ? (
                        table?.getRowModel()?.rows?.map((row) => (
                          <TableRow key={row.id} className="cursor-pointer">
                            {row.getVisibleCells()?.map((cell) => (
                              <TableCell
                                key={cell.id}
                                className="py-2 px-4 whitespace-nowrap"
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                          >
                            No results.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchData(data?.previous)}
                      disabled={!data?.previous}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchData(data?.next)}
                      disabled={!data?.next}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};
