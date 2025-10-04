// styles.js
import { Dimensions, StyleSheet } from "react-native";
import { colors, textStyles } from "../constants/theme";
const { height } = Dimensions.get("window");

const tabstyles = StyleSheet.create({
  // Common container
  container: {
    flex: 1,
    backgroundColor: colors?.background || "#f8f8f8",
    paddingTop: 40,
  },

  // Header
  header: {
    ...textStyles?.subHeading,
    textAlign: "center",
    marginBottom: 20,
  },

  // Avatar
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors?.border || "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "500",
    color: colors?.text || "#333",
  },
  email: {
    ...textStyles?.muted,
  },

  // Buttons
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
    gap: 15,
  },
  addProfileBtn: {
    backgroundColor: colors?.primary || "#2196F3",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  addProfileText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  logoutBtn: {
    backgroundColor: colors?.primaryDark || "#1565C0",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  logoutText: {
    color: colors?.text || "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  // Menu
  menu: {
    marginTop: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors?.border || "#ddd",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: colors?.text || "#333",
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    margin: 15,
    backgroundColor: "#fff",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors?.border || "#ddd",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  searchButton: {
    backgroundColor: colors?.primary || "#2196F3",
    padding: 10,
    borderRadius: 20,
    marginLeft: 5,
  },

  // Report List
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  reportCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors?.text || "#333",
  },
  timeText: {
    fontSize: 12,
    color: colors?.text || "#666",
    marginTop: 4,
  },
  typeText: {
    fontWeight: "700",
    fontSize: 12,
  },
  theft: {
    color: "orange",
  },
  robbery: {
    color: "red",
  },

  // Map
  mapContainer: {
    height: height * 0.4,
    backgroundColor: "#e8f5e8",
    margin: 15,
    borderRadius: 10,
    overflow: "hidden",
  },

  // Reports Section
  reportsSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  reportsList: {
    flex: 1,
  },
  reportItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  // Add Button
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors?.primary || "#4CAF50",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default tabstyles;
