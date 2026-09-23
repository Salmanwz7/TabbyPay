/**
 * Tabby's app mark.
 *
 * Paths copied verbatim from Tabby's published icon (tabby.ai/icon-v2.svg) —
 * a #6CFF93 squircle with the T glyph in black. Not redrawn: an approximated
 * logo is a wrong logo, and this one is being shown to the people who
 * commissioned it.
 *
 * Only the literal hex values are swapped for tokens, so the mark can never
 * drift from the palette.
 *
 * Used twice: the page masthead, and the merchant app's own top bar inside the
 * device frame — because a Tabby product would carry Tabby's mark.
 */

export default function TabbyMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      role="img"
      aria-label="تابي"
      className="flex-none"
    >
      <path
        d="M100 29.9042C100 13.3886 86.6115 0 70.0958 0H29.9042C13.3886 0 0 13.3885 0 29.9042V70.0958C0 86.6114 13.3885 100 29.9042 100H70.0958C86.6114 100 100 86.6115 100 70.0958V29.9042Z"
        fill="var(--tabby-green)"
      />
      <path
        d="M55.1374 43.6425V48.4575H71.4049V60.0125H55.1374C55.2174 64.025 57.3849 65.79 61.7974 65.79C64.5524 65.79 67.4699 64.9925 71.4024 63.1575V76.3175C68.1649 78.055 63.6124 79.6 58.0774 79.59C47.9324 79.5725 39.4099 74.3375 39.4099 61.055V60.0125H28.5249L27.8024 48.4575H39.4099V43.6425H27.6424L26.9199 32.0875H39.4099V20.855H55.1374V32.0875H71.4049V43.6425H55.1374Z"
        fill="var(--tabby-black)"
      />
    </svg>
  );
}
