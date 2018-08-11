#### TO DO

- `colorpicker` component
  - Make colorpickers lockable
  - Make colorpicker edit features only visible on hover (template + @hover)
  - Display (and maybe make editable) H S V component values
  - Restrict input values to valid hex characters (and # only at front)
- sample components
  - Create components for `chartsample`, `syntaxsample`
  - Bind text/chart/syntax colors to colors data by ID (using properties)
- Vue app
  - Make colorpickers re-arrangeable (and samples reorder as well)
  - Seed page with starter colors (dark, light, bright) (random within HSV ranges)
  - Add space bar/refresh button for new colors
  - Add ability to set each of 2 background colors in right side columns (by color ID)
  - Add colors to URL when set/added/removed (onChange, not onInput)
    And add characters for extras, like `!` means locked, `.` means background color
    Example: `E4F6C0-FCFCFC!.-CC0000.-33113C!-EE44CC`
  - Add animations (new color, page initialization)
  - Improved random color generation
- Page
  - Add top bar with: about, title, link to github/my website

#### Features

- colorpicker
  - Input color with HSV slider or hex code
  - Display input color as background
  - emit updated color value to parent
  - Add new colors with button
- Page
  - Responsive flexbox layout to display arbitrary number of colors as text, chart lines, and syntax highlighting (doesn't currently use dynamic colors)