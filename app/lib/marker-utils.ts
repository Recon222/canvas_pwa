import { v4 as uuidv4 } from 'uuid';

/**
 * Interface for marker data with unique ID
 */
export interface MarkerData {
  id: string;
  latitude: number;
  longitude: number;
  address?: string;
  abbreviatedAddress?: string;
  createdAt: string;
  type?: 'poi' | 'roi' | 'vehicle' | 'cellphone' | 'canvass' | 'other';
  metadata?: Record<string, any>;
}

/**
 * Generate a new marker with a unique ID
 */
export function createMarker(
  latitude: number, 
  longitude: number, 
  options: {
    address?: string;
    abbreviatedAddress?: string;
    type?: MarkerData['type'];
    metadata?: Record<string, any>;
  } = {}
): MarkerData {
  return {
    id: uuidv4(),
    latitude,
    longitude,
    address: options.address,
    abbreviatedAddress: options.abbreviatedAddress,
    createdAt: new Date().toISOString(),
    type: options.type || 'other',
    metadata: options.metadata || {},
  };
}

/**
 * Store marker data in localStorage (temporary solution until database integration)
 */
export function storeMarker(marker: MarkerData): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Get existing markers
    const existingMarkers = getStoredMarkers();
    
    // Add or update marker
    const updatedMarkers = {
      ...existingMarkers,
      [marker.id]: marker
    };
    
    // Save to localStorage
    localStorage.setItem('markers', JSON.stringify(updatedMarkers));
  } catch (error) {
    console.error('Error storing marker:', error);
  }
}

/**
 * Get all stored markers from localStorage
 */
export function getStoredMarkers(): Record<string, MarkerData> {
  if (typeof window === 'undefined') return {};
  
  try {
    const markersJson = localStorage.getItem('markers');
    return markersJson ? JSON.parse(markersJson) : {};
  } catch (error) {
    console.error('Error retrieving markers:', error);
    return {};
  }
}

/**
 * Get a specific marker by ID
 */
export function getMarkerById(id: string): MarkerData | null {
  const markers = getStoredMarkers();
  return markers[id] || null;
}

/**
 * Delete a marker by ID
 */
export function deleteMarker(id: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const markers = getStoredMarkers();
    if (markers[id]) {
      delete markers[id];
      localStorage.setItem('markers', JSON.stringify(markers));
    }
  } catch (error) {
    console.error('Error deleting marker:', error);
  }
}

/**
 * Update an existing marker
 */
export function updateMarker(id: string, updates: Partial<Omit<MarkerData, 'id'>>): MarkerData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const markers = getStoredMarkers();
    if (markers[id]) {
      const updatedMarker = {
        ...markers[id],
        ...updates,
      };
      markers[id] = updatedMarker;
      localStorage.setItem('markers', JSON.stringify(markers));
      return updatedMarker;
    }
    return null;
  } catch (error) {
    console.error('Error updating marker:', error);
    return null;
  }
} 