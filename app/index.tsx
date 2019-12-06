import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";

interface Props {}

const Component: React.FC<Props> = () => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Image
          source={require("../assets/photo.jpeg")}
          style={{ flex: 1, width: null, height: null }}
        ></Image>
      </View>
      <View
        style={{
          height: Dimensions.get("window").height / 3,
          justifyContent: "center"
        }}
      >
        <View style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </View>
        <View style={[styles.button, { backgroundColor: "#2E71DC" }]}>
          <Text style={[styles.buttonText, { color: "white" }]}>
            Sign In with Facebook
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-end"
  },
  wrapper: {
    ...StyleSheet.absoluteFill
  },
  button: {
    backgroundColor: "white",
    height: 70,
    marginHorizontal: 20,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});

export default Component;
