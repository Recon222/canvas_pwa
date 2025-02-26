// Mock data service to simulate IndexedDB functionality
// This will be replaced with actual IndexedDB implementation later

export interface CanvassEntry {
  id: string;
  occurrence: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'completed' | 'synced';
  completionPercentage: number;
  address: {
    full: string;
    streetNumber: string;
    streetName: string;
    unitNumber?: string;
    city: string;
  };
  occupant: {
    primaryName: string;
    count: number;
  };
  hasVehicle: boolean;
  hasVideo: boolean;
  needsFollowUp: boolean;
}

// Generate some mock data
const mockCanvassEntries: CanvassEntry[] = [
  {
    id: '1',
    occurrence: 'OCC-2023-001',
    createdAt: '2023-06-15T10:30:00',
    updatedAt: '2023-06-15T11:45:00',
    status: 'completed',
    completionPercentage: 100,
    address: {
      full: '123 Main St, Brampton',
      streetNumber: '123',
      streetName: 'Main St',
      city: 'Brampton'
    },
    occupant: {
      primaryName: 'John Smith',
      count: 2
    },
    hasVehicle: true,
    hasVideo: true,
    needsFollowUp: false
  },
  {
    id: '2',
    occurrence: 'OCC-2023-002',
    createdAt: '2023-06-16T09:15:00',
    updatedAt: '2023-06-16T10:20:00',
    status: 'draft',
    completionPercentage: 65,
    address: {
      full: '456 Oak Ave, Unit 3B, Mississauga',
      streetNumber: '456',
      streetName: 'Oak Ave',
      unitNumber: '3B',
      city: 'Mississauga'
    },
    occupant: {
      primaryName: 'Jane Doe',
      count: 1
    },
    hasVehicle: false,
    hasVideo: true,
    needsFollowUp: true
  },
  {
    id: '3',
    occurrence: 'OCC-2023-003',
    createdAt: '2023-06-17T14:20:00',
    updatedAt: '2023-06-17T15:30:00',
    status: 'synced',
    completionPercentage: 100,
    address: {
      full: '789 Pine Rd, Brampton',
      streetNumber: '789',
      streetName: 'Pine Rd',
      city: 'Brampton'
    },
    occupant: {
      primaryName: 'Robert Johnson',
      count: 3
    },
    hasVehicle: true,
    hasVideo: false,
    needsFollowUp: false
  },
  {
    id: '4',
    occurrence: 'OCC-2023-004',
    createdAt: '2023-06-18T11:00:00',
    updatedAt: '2023-06-18T11:45:00',
    status: 'draft',
    completionPercentage: 30,
    address: {
      full: '101 Maple Dr, Mississauga',
      streetNumber: '101',
      streetName: 'Maple Dr',
      city: 'Mississauga'
    },
    occupant: {
      primaryName: 'Sarah Williams',
      count: 1
    },
    hasVehicle: false,
    hasVideo: false,
    needsFollowUp: true
  },
  {
    id: '5',
    occurrence: 'OCC-2023-005',
    createdAt: '2023-06-19T13:10:00',
    updatedAt: '2023-06-19T14:25:00',
    status: 'completed',
    completionPercentage: 100,
    address: {
      full: '222 Elm St, Unit 5C, Brampton',
      streetNumber: '222',
      streetName: 'Elm St',
      unitNumber: '5C',
      city: 'Brampton'
    },
    occupant: {
      primaryName: 'Michael Brown',
      count: 4
    },
    hasVehicle: true,
    hasVideo: true,
    needsFollowUp: true
  }
];

export const mockDataService = {
  getCanvassEntries: () => Promise.resolve(mockCanvassEntries),
  getCanvassEntry: (id: string) => Promise.resolve(mockCanvassEntries.find(entry => entry.id === id) || null),
  getSummaryStats: () => Promise.resolve({
    total: mockCanvassEntries.length,
    completed: mockCanvassEntries.filter(entry => entry.status === 'completed' || entry.status === 'synced').length,
    inProgress: mockCanvassEntries.filter(entry => entry.status === 'draft').length
  })
}; 