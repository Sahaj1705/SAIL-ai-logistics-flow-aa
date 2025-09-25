"use client"

import { render, screen, fireEvent } from "@testing-library/react"
import { Button } from "@/components/ui/button"
import { jest } from "@jest/globals"

describe("Button Component", () => {
  it("renders correctly", () => {
    render(<Button>Test Button</Button>)
    expect(screen.getByRole("button", { name: "Test Button" })).toBeInTheDocument()
  })

  it("handles click events", () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByRole("button"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("applies variant classes correctly", () => {
    render(<Button variant="destructive">Destructive Button</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("bg-destructive")
  })

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole("button")
    expect(button).toBeDisabled()
  })
})
