import React from 'react';
import { cn } from '../../lib/cn';

export type TableProps = React.HTMLAttributes<HTMLTableElement>;

export const Table: React.FC<TableProps> = ({ className, ...props }) => (
  <div className="w-full overflow-auto">
    <table className={cn('table', className)} {...props} />
  </div>
);

export type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const TableHeader: React.FC<TableHeaderProps> = ({ className, ...props }) => (
  <thead className={cn('', className)} {...props} />
);

export type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const TableBody: React.FC<TableBodyProps> = ({ className, ...props }) => (
  <tbody className={cn('', className)} {...props} />
);

export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>;

export const TableRow: React.FC<TableRowProps> = ({ className, ...props }) => (
  <tr className={cn('hover:bg-slate-50/50 transition-colors', className)} {...props} />
);

export type TableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement>;

export const TableHead: React.FC<TableHeadProps> = ({ className, ...props }) => (
  <th className={cn('', className)} {...props} />
);

export type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>;

export const TableCell: React.FC<TableCellProps> = ({ className, ...props }) => (
  <td className={cn('', className)} {...props} />
);
