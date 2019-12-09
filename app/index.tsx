import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated from "react-native-reanimated";
import Svg, { Image, Circle, ClipPath } from "react-native-svg";
import {
  TapGestureHandler,
  State,
  TextInput,
  ScrollView
} from "react-native-gesture-handler";

import { runTiming } from "./functions/runTiming";

interface Props {}

const {
  Value,
  interpolate,
  Extrapolate,
  concat,
  event,
  block,
  cond,
  eq,
  set,
  Clock
} = Animated;

const Component: React.FC<Props> = () => {
  const [buttonOpacity] = useState(new Value(1));
  const { width, height } = Dimensions.get("window");

  const onStateChange = event([
    {
      nativeEvent: ({ state }) => {
        return block([
          cond(
            eq(state, State.END),
            set(buttonOpacity, runTiming(new Clock(), 1, 0))
          )
        ]);
      }
    }
  ]);

  const onStateClose = event([
    {
      nativeEvent: ({ state }) =>
        block([
          cond(
            eq(state, State.END),
            set(buttonOpacity, runTiming(new Clock(), 0, 1))
          )
        ])
    }
  ]);

  const buttonY = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [100, 0],
    extrapolate: Extrapolate.CLAMP
  });

  const backgroundY = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [-height / 3 - 50, 0],
    extrapolate: Extrapolate.CLAMP
  });

  const zIndex = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [1, -1],
    extrapolate: Extrapolate.CLAMP
  });

  const inputsY = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [0, 100],
    extrapolate: Extrapolate.CLAMP
  });

  const inputsOpacity = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP
  });

  const rotateCross = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [180, 360],
    extrapolate: Extrapolate.CLAMP
  });

  return (
    <ScrollView contentContainerStyle={{ flex: 1, justifyContent: "flex-end" }}>
      <Animated.View
        style={[styles.wrapper, { transform: [{ translateY: backgroundY }] }]}
      >
        {/* <DismissKeyboard> */}
        <Svg height={height + 50} width={width}>
          <ClipPath id="clip">
            <Circle r={height + 50} cx={width / 2}></Circle>
          </ClipPath>
          <Image
            href={require("../assets/photo.jpeg")}
            width={width}
            height={height + 50}
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#clip)"
          ></Image>
        </Svg>
        {/* </DismissKeyboard> */}
      </Animated.View>
      <View
        style={{
          height: height / 3,
          justifyContent: "center"
        }}
      >
        <TapGestureHandler onHandlerStateChange={onStateChange}>
          <Animated.View
            style={[
              styles.button,
              { opacity: buttonOpacity, transform: [{ translateY: buttonY }] }
            ]}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </Animated.View>
        </TapGestureHandler>

        <Animated.View
          style={[
            styles.button,
            {
              backgroundColor: "#2E71DC",
              opacity: buttonOpacity,
              transform: [{ translateY: buttonY }]
            }
          ]}
        >
          <Text style={[styles.buttonText, { color: "white" }]}>
            Sign In with Facebook
          </Text>
        </Animated.View>

        <Animated.View
          style={{
            zIndex,
            opacity: inputsOpacity,
            transform: [{ translateY: inputsY }],
            height: height / 3,
            ...StyleSheet.absoluteFill,
            top: null,
            justifyContent: "center"
          }}
        >
          <TapGestureHandler onHandlerStateChange={onStateClose}>
            <Animated.View style={styles.closeButton}>
              {/* <DismissKeyboard> */}
              <Animated.Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  transform: [{ rotate: concat(rotateCross, "deg") }]
                }}
              >
                X
              </Animated.Text>
              {/* </DismissKeyboard> */}
            </Animated.View>
          </TapGestureHandler>
          <TextInput
            placeholder="Email"
            style={styles.textInput}
            placeholderTextColor="black"
          ></TextInput>
          <TextInput
            placeholder="Password"
            style={styles.textInput}
            placeholderTextColor="black"
          ></TextInput>
          <Animated.View style={[styles.button, { height: "25%" }]}>
            {/* <DismissKeyboard> */}
            <Text style={styles.buttonText}>Sign In</Text>
            {/* </DismissKeyboard> */}
          </Animated.View>
        </Animated.View>
      </View>
    </ScrollView>
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
    marginVertical: 5,
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    elevation: 2
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold"
  },
  textInput: {
    height: "20%",
    borderWidth: 0.5,
    borderColor: "lightgrey",
    borderRadius: 25,
    paddingLeft: 15,
    marginHorizontal: 15,
    marginVertical: 5
  },
  closeButton: {
    height: 40,
    width: 40,
    backgroundColor: "white",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -20,
    left: Dimensions.get("window").width / 2 - 20,
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    elevation: 2
  }
});

export default Component;
