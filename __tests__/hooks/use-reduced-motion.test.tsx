import { renderHook } from "@testing-library/react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import jest from "jest"

describe("useReducedMotion Hook", () => {
  it("returns false by default", () => {
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
  })

  it("respects prefers-reduced-motion media query", () => {
    // Mock matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })

    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(true)
  })
})
