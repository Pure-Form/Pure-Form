import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

import PrimaryButton from "@/components/PrimaryButton";

jest.mock("@/context/ThemeContext", () => ({
  useTheme: () => ({
    theme: {
      colors: {
        accent: "#1976d2",
        accentSoft: "#90caf9",
        background: "#ffffff",
        border: "#cccccc",
        text: "#111111",
        subText: "#666666",
        surface: "#f5f5f5",
        danger: "#e53935",
        card: "#ffffff",
      },
      mode: "light",
    },
  }),
}));

describe("PrimaryButton", () => {
  it("renders title and triggers onPress", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <PrimaryButton title="Save" onPress={onPress} />,
    );

    fireEvent.press(getByText("Save"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("shows loader and disables press when loading", () => {
    const onPress = jest.fn();
    const { getByTestId, queryByText } = render(
      <PrimaryButton title="Save" onPress={onPress} loading />,
    );

    expect(getByTestId("primary-button-loader")).toBeTruthy();
    expect(queryByText("Save")).toBeNull();
    expect(onPress).not.toHaveBeenCalled();
  });

  it("disables when disabled prop is true", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <PrimaryButton title="Disabled" onPress={onPress} disabled />,
    );

    fireEvent.press(getByText("Disabled"));

    expect(onPress).not.toHaveBeenCalled();
  });
});
