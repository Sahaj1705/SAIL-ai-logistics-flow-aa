import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { DelayPredictor } from "@/components/ai/delay-predictor"
import jest from "jest"

// Mock the API call
global.fetch = jest.fn()

describe("DelayPredictor Component", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders prediction form", () => {
    render(<DelayPredictor onPredictionUpdate={jest.fn()} />)

    expect(screen.getByText("AI Delay Predictor")).toBeInTheDocument()
    expect(screen.getByLabelText(/vessel/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/port/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /predict/i })).toBeInTheDocument()
  })

  it("makes prediction API call on form submission", async () => {
    const mockResponse = {
      delayHours: 5.2,
      confidence: 0.85,
      factors: [
        { name: "Weather", importance: 0.4 },
        { name: "Port Congestion", importance: 0.35 },
      ],
    }
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const onPredictionUpdate = jest.fn()
    render(<DelayPredictor onPredictionUpdate={onPredictionUpdate} />)

    // Fill form
    fireEvent.change(screen.getByLabelText(/vessel/i), { target: { value: "MV-TEST-001" } })
    fireEvent.change(screen.getByLabelText(/port/i), { target: { value: "HALDIA" } })

    // Submit form
    fireEvent.click(screen.getByRole("button", { name: /predict/i }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/predict-delay", expect.any(Object))
      expect(onPredictionUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          delayHours: 5.2,
          confidence: 0.85,
        }),
      )
    })
  })

  it("displays error message on API failure", async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error("API Error"))

    render(<DelayPredictor onPredictionUpdate={jest.fn()} />)

    fireEvent.change(screen.getByLabelText(/vessel/i), { target: { value: "MV-TEST-001" } })
    fireEvent.click(screen.getByRole("button", { name: /predict/i }))

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })
})
