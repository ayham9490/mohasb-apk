// Google Sign-In integration
// Note: @react-native-google-signin/google-signin is already in package.json
let GoogleSignIn: any = null;

try {
  GoogleSignIn = require("@react-native-google-signin/google-signin");
} catch (e) {
  console.warn("Google Sign-In not available");
}

export interface GoogleDriveConfig {
  clientId: string;
  scopes: string[];
}

let isInitialized = false;

/**
 * Initialize Google Sign-In
 */
export async function initializeGoogleSignIn(config: GoogleDriveConfig): Promise<void> {
  try {
    GoogleSignIn.configure({
      clientId: config.clientId,
      scopes: config.scopes,
    });
    isInitialized = true;
  } catch (error) {
    console.error("Error initializing Google Sign-In:", error);
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<any> {
  try {
    if (!isInitialized) {
      throw new Error("Google Sign-In not initialized");
    }

    const userInfo = await GoogleSignIn.signIn();
    return userInfo;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

/**
 * Sign out from Google
 */
export async function signOutFromGoogle(): Promise<void> {
  try {
    await GoogleSignIn.signOut();
  } catch (error) {
    console.error("Error signing out from Google:", error);
  }
}

/**
 * Get current user info
 */
export async function getCurrentUser(): Promise<any> {
  try {
    const userInfo = await GoogleSignIn.getCurrentUser();
    return userInfo;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Create or get spreadsheet
 * Note: This is a placeholder - actual implementation would use Google Sheets API
 */
export async function createOrGetSpreadsheet(
  accessToken: string,
  title: string = "Mohasb Backup"
): Promise<string> {
  try {
    // Placeholder for actual Google Sheets API call
    console.log("Creating/getting spreadsheet:", title);
    return "spreadsheet-id-placeholder";
  } catch (error) {
    console.error("Error creating spreadsheet:", error);
    throw error;
  }
}

/**
 * Export data to Google Sheets
 * Note: This is a placeholder - actual implementation would use Google Sheets API
 */
export async function exportToGoogleSheets(
  accessToken: string,
  spreadsheetId: string,
  data: {
    accounts: any[];
    transactions: any[];
  }
): Promise<boolean> {
  try {
    // Placeholder for actual Google Sheets API call
    console.log("Exporting data to Google Sheets:", spreadsheetId);
    return true;
  } catch (error) {
    console.error("Error exporting to Google Sheets:", error);
    return false;
  }
}

/**
 * Import data from Google Sheets
 * Note: This is a placeholder - actual implementation would use Google Sheets API
 */
export async function importFromGoogleSheets(
  accessToken: string,
  spreadsheetId: string
): Promise<{
  accounts: any[];
  transactions: any[];
} | null> {
  try {
    // Placeholder for actual Google Sheets API call
    console.log("Importing data from Google Sheets:", spreadsheetId);
    return {
      accounts: [],
      transactions: [],
    };
  } catch (error) {
    console.error("Error importing from Google Sheets:", error);
    return null;
  }
}

/**
 * Sync data with Google Sheets
 */
export async function syncWithGoogleSheets(
  accessToken: string,
  spreadsheetId: string,
  data: {
    accounts: any[];
    transactions: any[];
  }
): Promise<boolean> {
  try {
    // First export current data
    const exported = await exportToGoogleSheets(accessToken, spreadsheetId, data);

    if (!exported) {
      throw new Error("Failed to export data");
    }

    return true;
  } catch (error) {
    console.error("Error syncing with Google Sheets:", error);
    return false;
  }
}

/**
 * Check if user is signed in
 */
export async function isSignedIn(): Promise<boolean> {
  try {
    const userInfo = await GoogleSignIn.getCurrentUser();
    return userInfo !== null;
  } catch (error) {
    console.error("Error checking sign-in status:", error);
    return false;
  }
}

/**
 * Get access token
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    const userInfo = await GoogleSignIn.getCurrentUser();
    if (userInfo && userInfo.auth && userInfo.auth.accessToken) {
      return userInfo.auth.accessToken;
    }
    return null;
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
}
