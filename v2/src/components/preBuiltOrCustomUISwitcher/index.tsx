import React, { useEffect, useState } from "react";

const preBuiltValue = "prebuilt";
const customUIValue = "custom";
const uiStorageKey = "ui";

export function getUIModeFromStorage():
  | typeof preBuiltValue
  | typeof customUIValue {
  if (typeof window === "undefined") {
    return preBuiltValue;
  }
  let uiFromStorage = window.localStorage.getItem(uiStorageKey);

  if (
    uiFromStorage === null ||
    (uiFromStorage !== preBuiltValue && uiFromStorage !== customUIValue)
  ) {
    uiFromStorage = preBuiltValue;
    // we do not want to call updateUIMode cause this will be called on page refresh
    // for each tab anyway.
    window.localStorage.setItem(uiStorageKey, uiFromStorage);
  }

  return uiFromStorage as any;
}

export function updateUIMode(
  value: typeof preBuiltValue | typeof customUIValue,
) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(uiStorageKey, value);
  window.dispatchEvent(new Event("uiModeChanged"));
}

export function PrebuiltUILink({ children }: React.PropsWithChildren<{}>) {
  return (
    <a style={{ cursor: "pointer" }} onClick={() => updateUIMode("prebuilt")}>
      {children}
    </a>
  );
}

export function CustomUILink({ children }: React.PropsWithChildren<{}>) {
  return (
    <a style={{ cursor: "pointer" }} onClick={() => updateUIMode("custom")}>
      {children}
    </a>
  );
}

export function PreBuiltOrCustomUISwitcher(props: any) {
  let [uiMode, setUIMode] = useState(getUIModeFromStorage());

  const children = React.Children.map(props.children, (child) => {
    return React.cloneElement(child, {
      selectedvalue: uiMode,
    });
  });

  const onUIModeChanged = () => {
    setUIMode(getUIModeFromStorage());
  };

  useEffect(() => {
    window.addEventListener("uiModeChanged", onUIModeChanged);
    return () => {
      window.removeEventListener("uiModeChanged", onUIModeChanged);
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </div>
  );
}

export function PreBuiltUIContent(props: any) {
  return <PreBuiltCustomUITabChild value={preBuiltValue} {...props} />;
}

export function CustomUIContent(props: any) {
  return <PreBuiltCustomUITabChild value={customUIValue} {...props} />;
}

function PreBuiltCustomUITabChild(props: {
  value: typeof preBuiltValue | typeof customUIValue;
  selectedvalue: string;
  children: any;
}) {
  const { value, selectedvalue, children } = props;

  if (value !== selectedvalue) {
    return null;
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </div>
  );
}

