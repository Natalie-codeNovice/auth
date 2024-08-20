import * as React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useRouter } from "expo-router";

export default function App() {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* <Video
        ref={video}
        style={styles.video}
        source={{
          uri: "https://videos.pexels.com/video-files/5377700/5377700-sd_540_960_25fps.mp4",
        }}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      /> */}
      <View style={styles.overlay}>
        <Text style={styles.mainText}>Budget is telling</Text>
        <Text style={styles.subText}>Your money where to go</Text>
        <Text style={styles.tagline}>Instead of wonder where it went</Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/auth/login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/auth/register")}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", // Center items horizontally
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Slightly darker overlay for better text contrast
    padding: 20, // Add padding to prevent text from touching the edges
  },
  mainText: {
    color: "white",
    fontSize: 50, // Adjusted for better readability
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10, // Add spacing below main text
  },
  subText: {
    color: "white",
    fontSize: 22, // Adjusted size for better hierarchy
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10, // Add spacing below sub text
  },
  tagline: {
    color: "white",
    fontSize: 16, // Smaller size for less emphasis
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10, // Add margin at the top for separation
    paddingHorizontal: 20, // Add horizontal padding for better text fit
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 20, // Adjusted bottom position for better placement
    left: 20, // Adjusted left and right for better spacing
    right: 20,
  },
  button: {
    backgroundColor: "#6200ea",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 3, // Shadow effect for Android
    width: 120, // Fixed width for consistency
    alignItems: "center", // Center text horizontally
  },
  buttonText: {
    color: "white",
    fontSize: 16, // Slightly smaller font size for buttons
    fontWeight: "bold",
  },
});
