import type { LogsResponse } from "../api/logs";
import { LogLevelLabel, LogLevelVariant } from "../api/types";
import { Badge } from "./ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface LogTableProps {
  logResponse: LogsResponse | undefined,
  page: number,
  setPage: React.Dispatch<React.SetStateAction<number>>,
  pageItemLimit: number
}

export default function LogTable({ logResponse, page, setPage, pageItemLimit }: LogTableProps) {
  return (
    logResponse && logResponse.result.length > 0 ? (
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Logger</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Created Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logResponse?.result.map(log => (
              <TableRow key={log.id}>
                <TableCell>{log.service}</TableCell>
                <TableCell>{log.logger}</TableCell>
                <TableCell><Badge variant={LogLevelVariant[log.level]}>{LogLevelLabel[log.level]}</Badge></TableCell>
                <TableCell>{log.message}</TableCell>
                <TableCell>{log.created_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious size="default" href="#" onClick={() => setPage((p) => p > 0 ? p - 1 : 0)} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink size="default" href="#" isActive>
                {page + 1}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext size="default" href="#" onClick={() => setPage((p) =>
                (logResponse?.result.length < pageItemLimit && logResponse?.result.length > 0) ? p :
                  p + 1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    ) :
      (<div>No log found</div>)
  )
}
