'use client';

import { Pagination as MuiPagination } from '@mui/material';
import { toPersianDigits } from '@/lib/utils';

interface PaginationProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, page: number) => void;
}

export function Pagination({ count, page, onChange }: PaginationProps) {
  return (
    <MuiPagination
      count={count}
      page={page}
      onChange={onChange}
      color="primary"
      size="large"
      sx={{
        '& .MuiPaginationItem-root': {
          fontFamily: 'inherit',
          '&:not(.MuiPaginationItem-icon)': {
            '&:after': {
              content: 'attr(aria-label)',
              position: 'absolute',
              fontSize: 'inherit',
            },
            '& > *': {
              opacity: 0,
            },
          },
        },
      }}
    />
  );
}