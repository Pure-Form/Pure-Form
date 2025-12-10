import { render } from "@testing-library/react-native";
import React from "react";

import FormTextInput from "@/components/FormTextInput";

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

describe("FormTextInput", () => {
  it("renders label and input", () => {
    const { getByText, getByPlaceholderText } = render(
      <FormTextInput label="Email" placeholder="Enter email" value="" />,
    );

    expect(getByText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Enter email")).toBeTruthy();
  });

  it("shows error text when error prop provided", () => {
    const { getByText } = render(
      <FormTextInput
        label="Password"
        placeholder="Enter password"
        value=""
        error="Required"
      />,
    );

    expect(getByText("Required")).toBeTruthy();
  });
});
