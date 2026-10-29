import { BREAKPOINTS, SPACE_SCALE, type Space } from "nr-ui-kit";

// The one spacing scale behind gap / padding in Container, Stack and Grid (pixels).
// Without `responsive` a token keeps its laptop value everywhere.
export default function SpacingScale() {
  const tokens = Object.keys(SPACE_SCALE) as Space[];
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[420px] text-left text-sm tabular-nums">
        <thead className="text-muted">
          <tr>
            <th className="py-2 pr-4 font-medium">Token</th>
            {BREAKPOINTS.map((bp) => (
              <th key={bp} className="py-2 pr-4 font-medium">"{bp}"</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token} className="border-t border-separator">
              <td className="py-2 pr-4 font-mono">{token}</td>
              {BREAKPOINTS.map((bp) => (
                <td key={bp} className="py-2 pr-4">
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-block h-3 rounded-sm bg-accent" style={{ width: SPACE_SCALE[token][bp] }} />
                    {SPACE_SCALE[token][bp]}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
