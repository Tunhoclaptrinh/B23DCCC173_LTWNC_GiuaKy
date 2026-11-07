import type { Book } from '../features/books/types';
import type { ApiResponse } from './types';

export const BOOK_SEEDS: ReadonlyArray<Book> = [
  {
    id: 'clean-code',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'CNTT',
    publishedYear: 2008,
    totalCopies: 5,
    availableCopies: 5,
    cover: {
      background: '#193d37',
      foreground: '#f0e7c8',
      motif: 'code',
      label: 'A HANDBOOK OF AGILE SOFTWARE CRAFTSMANSHIP',
      title: 'CLEAN\nCODE',
    },
  },
  {
    id: 'psychology-money',
    title: 'Tâm lý học về tiền',
    author: 'Morgan Housel',
    category: 'Kinh tế',
    publishedYear: 2020,
    totalCopies: 3,
    availableCopies: 3,
    cover: {
      background: '#efe3c9',
      foreground: '#4b5039',
      motif: 'rings',
      label: 'MORGAN HOUSEL',
      title: 'TÂM LÝ HỌC\nVỀ TIỀN',
    },
  },
  {
    id: 'english-grammar',
    title: 'English Grammar in Use',
    author: 'Raymond Murphy',
    category: 'Ngoại ngữ',
    publishedYear: 2019,
    totalCopies: 4,
    availableCopies: 4,
    cover: {
      background: '#b9ced8',
      foreground: '#233f58',
      motif: 'type',
      label: 'RAYMOND MURPHY · FIFTH EDITION',
      title: 'English\nGrammar\nin Use',
    },
  },
  {
    id: 'pragmatic-programmer',
    title: 'The Pragmatic Programmer',
    author: 'David Thomas & Andrew Hunt',
    category: 'CNTT',
    publishedYear: 2019,
    totalCopies: 2,
    availableCopies: 2,
    cover: {
      background: '#d8b09a',
      foreground: '#582c22',
      motif: 'steps',
      label: 'YOUR JOURNEY TO MASTERY',
      title: 'THE PRAGMATIC\nPROGRAMMER',
    },
  },
  {
    id: 'thinking-fast-slow',
    title: 'Tư duy nhanh và chậm',
    author: 'Daniel Kahneman',
    category: 'Kinh tế',
    publishedYear: 2011,
    totalCopies: 4,
    availableCopies: 0,
    cover: {
      background: '#ddd5bd',
      foreground: '#4d4a3c',
      motif: 'orbit',
      label: 'DANIEL KAHNEMAN',
      title: 'TƯ DUY NHANH\nVÀ CHẬM',
    },
  },
  {
    id: 'typescript',
    title: 'Programming TypeScript',
    author: 'Boris Cherny',
    category: 'CNTT',
    publishedYear: 2019,
    totalCopies: 3,
    availableCopies: 3,
    cover: {
      background: '#d1dee8',
      foreground: '#264b68',
      motif: 'code',
      label: 'MAKING YOUR JAVASCRIPT APPLICATIONS SCALE',
      title: 'Programming\nTypeScript',
    },
  },
  {
    id: 'ielts',
    title: 'Cambridge IELTS 18',
    author: 'Cambridge University Press',
    category: 'Ngoại ngữ',
    publishedYear: 2023,
    totalCopies: 3,
    availableCopies: 2,
    cover: {
      background: '#d8d3e7',
      foreground: '#544366',
      motif: 'grid',
      label: 'ACADEMIC · WITH ANSWERS',
      title: 'CAMBRIDGE\nIELTS 18',
    },
  },
  {
    id: 'design-patterns',
    title: 'Head First Design Patterns',
    author: 'Eric Freeman & Elisabeth Robson',
    category: 'CNTT',
    publishedYear: 2020,
    totalCopies: 3,
    availableCopies: 3,
    cover: {
      background: '#dce5cf',
      foreground: '#405439',
      motif: 'grid',
      label: 'A BRAIN-FRIENDLY GUIDE',
      title: 'HEAD FIRST\nDESIGN\nPATTERNS',
    },
  },
  {
    id: 'lean-startup',
    title: 'Khởi nghiệp tinh gọn',
    author: 'Eric Ries',
    category: 'Kinh tế',
    publishedYear: 2011,
    totalCopies: 2,
    availableCopies: 2,
    cover: {
      background: '#e5c7b4',
      foreground: '#663f2c',
      motif: 'steps',
      label: 'ERIC RIES',
      title: 'KHỞI NGHIỆP\nTINH GỌN',
    },
  },
  {
    id: 'eloquent-javascript',
    title: 'Eloquent JavaScript',
    author: 'Marijn Haverbeke',
    category: 'CNTT',
    publishedYear: 2024,
    totalCopies: 4,
    availableCopies: 4,
    cover: {
      background: '#e8da9c',
      foreground: '#58502a',
      motif: 'orbit',
      label: 'A MODERN INTRODUCTION TO PROGRAMMING',
      title: 'ELOQUENT\nJAVASCRIPT',
    },
  },
  {
    id: 'japanese',
    title: 'Minna no Nihongo I',
    author: '3A Corporation',
    category: 'Ngoại ngữ',
    publishedYear: 2012,
    totalCopies: 3,
    availableCopies: 0,
    cover: {
      background: '#ead0ca',
      foreground: '#854f48',
      motif: 'rings',
      label: 'SƠ CẤP · QUYỂN 1',
      title: 'みんなの日本語\nMINNA NO\nNIHONGO',
    },
  },
  {
    id: 'algorithms',
    title: 'Grokking Algorithms',
    author: 'Aditya Y. Bhargava',
    category: 'CNTT',
    publishedYear: 2024,
    totalCopies: 3,
    availableCopies: 3,
    cover: {
      background: '#bdcebf',
      foreground: '#304f3c',
      motif: 'steps',
      label: 'AN ILLUSTRATED GUIDE FOR PROGRAMMERS',
      title: 'GROKKING\nALGORITHMS',
    },
  },
];

/** Local mock API. Pass true to exercise the failure path; always waits 500 ms. */
export function fetchBooksApi(shouldFail = false): Promise<ApiResponse<Book[]>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({ ok: false, error: 'Chưa thể tải danh sách sách. Vui lòng thử lại.' });
        return;
      }
      // Return independent objects so Redux mutations never change the API fixtures.
      resolve({
        ok: true,
        data: BOOK_SEEDS.map((book) => ({ ...book, cover: { ...book.cover } })),
      });
    }, 500);
  });
}
