import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import Animated, { Easing } from "react-native-reanimated";
import {
  TapGestureHandler,
  State,
  TextInput
} from "react-native-gesture-handler";

interface Props {}

const {
  Value,
  interpolate,
  Extrapolate,
  timing,
  concat,
  event,
  block,
  cond,
  eq,
  set,
  Clock,
  clockRunning,
  startClock,
  stopClock,
  debug
} = Animated;

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    cond(
      clockRunning(clock),
      [set(config.toValue, dest)],
      [
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock)
      ]
    ),
    timing(clock, state, config),
    cond(state.finished, debug("stop clock", stopClock(clock))),
    state.position
  ]);
}
const Component: React.FC<Props> = () => {
  const [buttonOpacity] = useState(new Value(1));
  const { width, height } = Dimensions.get("window");

  const onStateChange = event([
    {
      nativeEvent: ({ state }) =>
        block([
          cond(
            eq(state, State.END),
            set(buttonOpacity, runTiming(new Clock(), 1, 0))
          )
        ])
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
    outputRange: [-height / 3, 0],
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
    <View style={styles.container}>
      <Animated.View
        style={[styles.wrapper, { transform: [{ translateY: backgroundY }] }]}
      >
        <Image
          source={require("../assets/photo.jpeg")}
          style={{ flex: 1, width: null, height: null }}
        ></Image>
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
              <Animated.Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  transform: [{ rotate: concat(rotateCross, "deg") }]
                }}
              >
                X
              </Animated.Text>
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
            <Text style={styles.buttonText}>Sign In</Text>
          </Animated.View>
        </Animated.View>
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
