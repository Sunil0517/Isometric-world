import { certifications, education, portfolio } from "@/lib/portfolio";

export function ResumeDetails() {
  return (
    <div className="resume-details">
      <section aria-label="Education">
        <h3>Education</h3>
        <strong>{education.degree}</strong>
        <p>{education.institution}</p>
        <p>
          {education.dates} · {education.grade}
        </p>
      </section>
      <section aria-label="Certifications">
        <h3>Certifications</h3>
        <ul>
          {certifications.map((certificate) => (
            <li key={certificate.title}>
              {certificate.title} <strong>· {certificate.issuer}</strong>
            </li>
          ))}
        </ul>
      </section>
      <a className="text-button" href={portfolio.resumeUrl} download>
        Download resume (.docx) ↗
      </a>
    </div>
  );
}
