import mongoose from 'mongoose';
import connectDB from '../db';
import { DATABASE_URI } from '@/public/constants/secrets';

jest.mock('mongoose', () => {
  const onMock = jest.fn();
  const connectionHandlers = {};

  onMock.mockImplementation((event, callback) => {
    connectionHandlers[event] = callback;
    return this;
  });

  return {
    connect: jest.fn().mockImplementation(() => {
      return Promise.resolve();
    }),
    connection: {
      on: onMock,
      _triggerEvent: (event, ...args) => {
        if (connectionHandlers[event]) {
          connectionHandlers[event](...args);
        }
      },
    },
    disconnect: jest.fn().mockResolvedValue(undefined),
  };
});

jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

const originalProcessOn = process.on;
const mockProcessExit = jest.fn();
const mockProcessOn = jest.fn();

describe('Database Connection', () => {
  beforeAll(() => {
    process.exit = mockProcessExit as any;
    process.on = mockProcessOn as any;
  });

  afterAll(() => {
    process.on = originalProcessOn;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('connects to the database with the correct URI and options', async () => {
    connectDB();
    expect(mongoose.connect).toHaveBeenCalledWith(
      DATABASE_URI,
      expect.objectContaining({
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      })
    );
  });

  it('sets up error handler for mongoose connection', () => {
    connectDB();
    expect(mongoose.connection.on).toHaveBeenCalledWith(
      'error',
      expect.any(Function)
    );
  });

  it('sets up disconnected handler for mongoose connection', () => {
    connectDB();
    expect(mongoose.connection.on).toHaveBeenCalledWith(
      'disconnected',
      expect.any(Function)
    );
  });

  it('handles mongoose connection error events', () => {
    connectDB();
    const testError = new Error('Connection error event');
    mongoose.connection._triggerEvent('error', testError);
    expect(console.log).toHaveBeenCalledWith(
      'Mongoose connection Error: ',
      testError
    );
  });

  it('handles mongoose disconnection events', () => {
    connectDB();
    mongoose.connection._triggerEvent('disconnected');
    expect(console.log).toHaveBeenCalledWith(
      'Mongoose disconected from database'
    );
  });

  it('sets up SIGINT handler for process', () => {
    connectDB();
    expect(mockProcessOn).toHaveBeenCalledWith('SIGINT', expect.any(Function));
  });

  it('handles successful database connection', async () => {
    connectDB();
    await new Promise(process.nextTick);
    expect(console.log).toHaveBeenCalledWith('Connected to database');
  });

  it('handles database connection errors', async () => {
    const testError = new Error('Connection failed');
    (mongoose.connect as jest.Mock).mockImplementationOnce(() => {
      return Promise.reject(testError);
    });
    connectDB();
    await new Promise(process.nextTick);
    expect(console.error).toHaveBeenCalledWith(
      'Failed to connect to database: ',
      testError
    );
  });

  it('properly disconnects from database on SIGINT', async () => {
    connectDB();
    const sigintHandler = (mockProcessOn.mock.calls.find(
      (call) => call[0] === 'SIGINT'
    ) || [])[1];

    if (sigintHandler) {
      await sigintHandler();

      expect(mongoose.disconnect).toHaveBeenCalled();

      expect(mockProcessExit).toHaveBeenCalledWith(0);
    } else {
      throw new Error('SIGINT handler was not registered');
    }
  });
});
