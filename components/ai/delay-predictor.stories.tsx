import type { Meta, StoryObj } from "@storybook/react"
import { DelayPredictor } from "./delay-predictor"

const meta: Meta<typeof DelayPredictor> = {
  title: "AI/DelayPredictor",
  component: DelayPredictor,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onPredictionUpdate: (prediction) => {
      console.log("Prediction updated:", prediction)
    },
  },
}

export const WithInitialData: Story = {
  args: {
    initialVessel: "MV-CARGO-001",
    initialPort: "HALDIA",
    onPredictionUpdate: (prediction) => {
      console.log("Prediction updated:", prediction)
    },
  },
}
