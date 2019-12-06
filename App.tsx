import React, { useState } from "react";
import { Asset } from "expo-asset";
import { AppLoading } from "expo";

import Component from "./app/index";

function cacheImages(images: any[]) {
  return images.map(image => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

async function loadAssetsAsync() {
  const imageAssets = cacheImages([require("./assets/photo.jpeg")]);

  await Promise.all([...imageAssets]);
}

const App: React.FC<{}> = () => {
  const [isReady, setReady] = useState(false);

  if (!isReady) {
    return (
      <AppLoading
        startAsync={loadAssetsAsync}
        onError={console.warn}
        onFinish={() => setReady(true)}
      />
    );
  }
  return <Component />;
};

export default App;
