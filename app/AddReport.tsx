import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { colors } from "../constants/theme";

export default function AddReport() {
  const [step, setStep] = useState(1);

  // --- Location ---
  const [useMap, setUseMap] = useState(false);
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [street, setStreet] = useState("");
  const [locationCoords, setLocationCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  // --- Victim ---
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // --- Incident ---
  const [incidentDate, setIncidentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [incidentCategory, setIncidentCategory] = useState("");
  const [lossValue, setLossValue] = useState("");

  // --- Stolen Item ---
  const [itemType, setItemType] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemValue, setItemValue] = useState("");

  // Phone-specific
  const [imei, setImei] = useState("");
  const [phoneBrand, setPhoneBrand] = useState("");
  const [phoneModel, setPhoneModel] = useState("");

  // Vehicle-specific
  const [licensePlate, setLicensePlate] = useState("");
  const [chassisNumber, setChassisNumber] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");

  // --- Validation ---
  const validateStep = () => {
    if (step === 1) {
      if (!useMap && (!province || !city)) {
        Alert.alert("Validation Error", "Please select province and city.");
        return false;
      }
      if (useMap && !locationCoords) {
        Alert.alert("Validation Error", "Please select a location on the map.");
        return false;
      }
    }
    if (step === 3 && !incidentCategory) {
      Alert.alert("Validation Error", "Please select an incident type.");
      return false;
    }
    if (step === 4 && !itemType) {
      Alert.alert("Validation Error", "Please select a stolen item type.");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    const data = {
      location: useMap
        ? { coords: locationCoords }
        : { province, city, district, neighborhood, street },
      victim: { name, age, gender, phone, email, address },
      incident: { incidentDate, incidentCategory, lossValue },
      stolenItem: {
        itemType,
        itemDescription,
        itemValue,
        imei,
        phoneBrand,
        phoneModel,
        licensePlate,
        chassisNumber,
        vehicleMake,
        vehicleModel,
      },
    };
    console.log("Submitting Report: ", data);
    Alert.alert("Success", "Report submitted successfully ✅");
  };

  const nextStep = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };
  const prevStep = () => setStep((prev) => prev - 1);

  // --- Pick Current Location ---
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Allow location access to pick from map.");
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocationCoords({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.stepIndicator}>Step {step} of 4</Text>

      {/* Step 1: Location */}
      {step === 1 && (
        <View>
          <Text style={styles.heading}>📍 Location</Text>

          {/* Toggle Map/Form */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
            <TouchableOpacity
              style={[styles.toggleButton, useMap && styles.activeToggle]}
              onPress={() => setUseMap(true)}
            >
              <Text style={styles.toggleText}>Pick from Map</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, !useMap && styles.activeToggle]}
              onPress={() => setUseMap(false)}
            >
              <Text style={styles.toggleText}>Fill Form</Text>
            </TouchableOpacity>
          </View>

          {useMap ? (
            <View style={{ height: 250 }}>
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: 24.8607,
                  longitude: 67.0011,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
                onPress={(e) => setLocationCoords(e.nativeEvent.coordinate)}
              >
                {locationCoords && <Marker coordinate={locationCoords} />}
              </MapView>
              <TouchableOpacity style={styles.navButton} onPress={getCurrentLocation}>
                <Text style={styles.buttonText}>Use My Location</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.dropdownWrapper}>
                <Picker
                  selectedValue={province}
                  onValueChange={(val) => setProvince(val)}
                  style={styles.dropdown}
                >
                  <Picker.Item label="Select Province" value="" />
                  <Picker.Item label="Sindh" value="Sindh" />
                  <Picker.Item label="Punjab" value="Punjab" />
                  <Picker.Item label="Khyber Pakhtunkhwa" value="KPK" />
                  <Picker.Item label="Balochistan" value="Balochistan" />
                  <Picker.Item label="Islamabad Capital Territory" value="ICT" />
                  <Picker.Item label="Gilgit-Baltistan" value="GB" />
                  <Picker.Item label="Azad Kashmir" value="AJK" />
                </Picker>
              </View>
              <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
              <TextInput style={styles.input} placeholder="District" value={district} onChangeText={setDistrict} />
              <TextInput style={styles.input} placeholder="Neighborhood" value={neighborhood} onChangeText={setNeighborhood} />
              <TextInput style={styles.input} placeholder="Street Address" value={street} onChangeText={setStreet} />
            </>
          )}
        </View>
      )}

      {/* TODO: Victim, Incident, Stolen Item same as before */}
{step === 2 && (
        <View>
          <Text style={styles.heading}>👤 Victim (Optional)</Text>
          <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Age" value={age} onChangeText={setAge} keyboardType="numeric" />

          {/* Gender Dropdown */}
          <View style={styles.dropdownWrapper}>
            <Picker selectedValue={gender} onValueChange={(val) => setGender(val)} style={styles.dropdown}>
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
        </View>
      )}

      {/* --- Step 3: Incident --- */}
      {step === 3 && (
        <View>
          <Text style={styles.heading}>⚠ Incident Details</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput style={styles.input} value={incidentDate.toLocaleString()} editable={false} />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={incidentDate}
              mode="datetime"
              display="default"
              onChange={(e, date) => {
                setShowDatePicker(false);
                if (date) setIncidentDate(date);
              }}
            />
          )}

          {/* Incident Category Dropdown */}
          <View style={styles.dropdownWrapper}>
            <Picker
              selectedValue={incidentCategory}
              onValueChange={(val) => setIncidentCategory(val)}
              style={styles.dropdown}
            >
              <Picker.Item label="Select Incident Type" value="" />
              <Picker.Item label="Mobile Snatch" value="mobile" />
              <Picker.Item label="Car Theft" value="car" />
              <Picker.Item label="Bike Theft" value="bike" />
              <Picker.Item label="Bag Snatch" value="bag" />
            </Picker>
          </View>

          <TextInput style={styles.input} placeholder="Estimated Loss Value" value={lossValue} onChangeText={setLossValue} keyboardType="numeric" />
        </View>
      )}

      {/* --- Step 4: Stolen Item --- */}
      {step === 4 && (
        <View>
          <Text style={styles.heading}>🎒 Stolen Item</Text>

          {/* Item Type Dropdown */}
          <View style={styles.dropdownWrapper}>
            <Picker selectedValue={itemType} onValueChange={(val) => setItemType(val)} style={styles.dropdown}>
              <Picker.Item label="Select Item Type" value="" />
              <Picker.Item label="Phone" value="phone" />
              <Picker.Item label="Car" value="car" />
              <Picker.Item label="Bike" value="bike" />
              <Picker.Item label="Bag" value="bag" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>

          {itemType === "phone" && (
            <>
              <TextInput style={styles.input} placeholder="IMEI" value={imei} onChangeText={setImei} />
              <TextInput style={styles.input} placeholder="Phone Brand" value={phoneBrand} onChangeText={setPhoneBrand} />
              <TextInput style={styles.input} placeholder="Phone Model" value={phoneModel} onChangeText={setPhoneModel} />
            </>
          )}

          {itemType === "car" || itemType === "bike" ? (
            <>
              <TextInput style={styles.input} placeholder="License Plate" value={licensePlate} onChangeText={setLicensePlate} />
              <TextInput style={styles.input} placeholder="Chassis Number" value={chassisNumber} onChangeText={setChassisNumber} />
              <TextInput style={styles.input} placeholder="Make" value={vehicleMake} onChangeText={setVehicleMake} />
              <TextInput style={styles.input} placeholder="Model" value={vehicleModel} onChangeText={setVehicleModel} />
            </>
          ) : null}

          <TextInput style={styles.input} placeholder="Description" value={itemDescription} onChangeText={setItemDescription} />
          <TextInput style={styles.input} placeholder="Item Value" value={itemValue} onChangeText={setItemValue} keyboardType="numeric" />
        </View>
      )}

      {/* Navigation Buttons */}
      <View style={styles.buttonRow}>
        {step > 1 && (
          <TouchableOpacity style={styles.navButton} onPress={prevStep}>
            <Text style={styles.buttonText}>⬅ Back</Text>
          </TouchableOpacity>
        )}
        {step < 4 ? (
          <TouchableOpacity style={styles.navButton} onPress={nextStep}>
            <Text style={styles.buttonText}>Next ➡</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit Report ✅</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: colors.background },
  heading: { fontSize: 18, fontWeight: "bold", marginVertical: 10, color: colors.text },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    padding: 12,
    marginVertical: 6,
    fontSize: 16,
    color: colors.text,
  },
  dropdownWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    marginVertical: 6,
    overflow: "hidden",
  },
  dropdown: { height: 50, width: "100%" },
  stepIndicator: { textAlign: "center", fontWeight: "bold", marginBottom: 12, color: colors.primary },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  navButton: { backgroundColor: colors.primary, padding: 12, borderRadius: 5 },
  submitButton: { backgroundColor: "green", padding: 12, borderRadius: 5, flex: 1, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  toggleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 4,
    alignItems: "center",
  },
  activeToggle: { backgroundColor: colors.primary },
  toggleText: { color: colors.text },
});
