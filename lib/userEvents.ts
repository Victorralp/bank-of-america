/**
 * Helper functions for dispatching and listening to user-related events
 */

export const USER_UPDATED_EVENT = 'user-updated';

/**
 * Dispatch an event that the user has been updated
 * This allows components like AppShell to refresh their user data
 */
export function dispatchUserUpdated() {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent(USER_UPDATED_EVENT);
    window.dispatchEvent(event);
  }
}

/**
 * Add a listener for user update events
 */
export function listenToUserUpdates(callback: () => void) {
  if (typeof window !== 'undefined') {
    window.addEventListener(USER_UPDATED_EVENT, callback);
    
    // Return cleanup function
    return () => window.removeEventListener(USER_UPDATED_EVENT, callback);
  }
  
  // Return no-op cleanup function
  return () => {};
} 