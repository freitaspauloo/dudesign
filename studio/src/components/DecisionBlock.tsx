import type { CaseDecision } from "@/src/content/types";

type Props = {
  decisions: CaseDecision[];
};

export function DecisionBlock({ decisions }: Props) {
  return (
    <div className="decisions">
      {decisions.map((d, i) => (
        <article key={d.title} className="decision">
          <p className="decision__index">Decision {i + 1}</p>
          <h3 className="decision__title">{d.title}</h3>
          <p className="decision__chosen">
            <strong>Chose:</strong> {d.chosen}
          </p>
          <p className="decision__rejected">
            <strong>Rejected:</strong> {d.rejected}
          </p>
        </article>
      ))}
    </div>
  );
}
