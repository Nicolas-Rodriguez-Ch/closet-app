import '@testing-library/jest-dom';

// jest.mock('@/database/db', () => ({
//   __esModule: true,
//   default: jest.fn().mockImplementation(() => {
//     console.log('Mocked MongoDB connection');
//     return Promise.resolve();
//   }),
// }));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn().mockReturnValue('/'),
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));
