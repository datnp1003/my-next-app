'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { deleteUser, paging, updateUser } from "@/core/domain/user/api";
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import router from 'next/router';

export default function Home() {
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const { t } = useTranslation('common');
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState({
        name: '',
        email: '',
    });
    const [pageSize, setPageSize] = useState(10);
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: [page,pageSize, JSON.stringify(filter)],
        queryFn: async () => await paging({ page, pageSize, filter }),
    });

    const deleteUserFn = async (id: number) => {
        const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa người dùng này?');
        if (!isConfirmed) return;
        try {
            const response = await deleteUser(id);
            if (!response) {
                throw new Error('Failed to delete user');
            }
            setAlert({ message: 'Xóa người dùng thành công.', type: 'success' });
            await refetch(); 
        } catch (error) {
            setAlert({ message: 'Có lỗi khi xóa người dùng. Vui lòng thử lại.', type: 'error' });
        }
    }

    if (isLoading) return <div>Đang tải...</div>;

    if (error) return <div>Có lỗi xảy ra!</div>;

    function getPageNumbers(page: number, totalPages: number) {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
            range.push(i);
        }

        if (page - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (page + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    }

    return (
        <div className="container-fluid mx-auto p-5 bg-white rounded-lg shadow-md">
            <div className="text-right mb-4">
                <Button 
                    onClick={() => router.push('/user/add')}
                    className='bg-sky-900 text-white hover:bg-white hover:text-sky-900 hover:border-sky-900 border border-transparent'
                >
                    {t('action.add')}
                </Button>
            </div>
            <Table className='border border-gray-300'>
                <TableHeader>
                    <TableRow className='bg-sky-100 border border-gray-300 text-gray-700'>
                        <TableHead className="w-[10%]">No.</TableHead>
                        <TableHead className="w-[30%] cursor-pointer hover:text-sky-950">{t('user.name')}
                            {/* <Input
                                    type="text"
                                    placeholder="Tìm kiếm tên"
                                    className="border border-gray-300 rounded p-1 w-full"
                                    onChange={(e) => {
                                        setFilter((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }));
                                    }}
                                /> */}
                        </TableHead>
                        <TableHead className="w-[40%] cursor-pointer hover:text-sky-950">Email</TableHead>
                        <TableHead className='w-[20%]'></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.data?.map((user: any, index: number) => (
                        <TableRow key={user.id} className={`border border-gray-300 text-gray-700 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{user.name || 'Không có tên'}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button 
                                        className='bg-orange-500 text-white hover:bg-white hover:text-orange-500 hover:border-orange-500 border border-transparent' 
                                        variant={'outline'}
                                        onClick={() => router.push(`/user/edit/${user.id}`)}                          >
                                        {t('action.edit')}
                                    </Button>
                                    <Button 
                                        className='bg-slate-500 text-white hover:bg-white hover:text-slate-500 hover:border-slate-500 border border-transparent'
                                        variant={'outline'}
                                        onClick={() => deleteUserFn(user.id)}
                                    >
                                        {t('action.delete')}
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex justify-between items-center mt-8">
                <div className="flex items-center gap-2">
                    <span>{t('paging.show')}</span>
                    <Select
                        value={pageSize.toString()}
                        onValueChange={(value) => {
                            setPageSize(Number(value));
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-[100px] border-gray-300">
                            <SelectValue placeholder="10" />
                        </SelectTrigger>
                        <SelectContent className='border-gray-300 relative z-[9999] bg-white'>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                    <span>{t('paging.entries')}</span>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="w-9 h-9 p-0 border"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {data?.totalPage && getPageNumbers(page, data.totalPage).map((pageNum, idx) => (
            pageNum === '...' ? (
              <div key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center">
                ...
              </div>
            ) : (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "ghost"}
                onClick={() => setPage(Number(pageNum))}
                className={`
                  w-9 h-9 p-0
                  ${pageNum === page 
                    ? "bg-sky-900 text-white hover:none" 
                    : "hover:bg-gray-300"}
                `}
              >
                {pageNum}
              </Button>
            )
          ))}

                    <Button
                        variant="outline"
                        onClick={() => setPage(p => Math.min(data?.totalPage || 1, p + 1))}
                        disabled={page === data?.totalPage}
                        className="w-9 h-9 p-0 border"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div>
                    {data.pageSize*(data.page -1)+ 1} - {(data.pageSize*(data.page -1)) + data.data.length} {t('paging.of')} {data?.totalItem || 1}
                </div>
            </div>
        </div>
    );
}

