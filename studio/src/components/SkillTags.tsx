type Props = {
  skills: readonly string[];
};

export function SkillTags({ skills }: Props) {
  return (
    <ul className="skill-tags" aria-label="Skills demonstrated">
      {skills.map((skill) => (
        <li key={skill}>{skill}</li>
      ))}
    </ul>
  );
}
