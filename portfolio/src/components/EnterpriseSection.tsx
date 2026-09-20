import Image from "next/image";
import Link from "next/link";

import { enterpriseWork } from "@/src/content/enterprise-work";

import { assetPath } from "@/src/lib/asset-path";

import { SwapLabel } from "@/src/components/SwapLabel";
import { Reveal } from "./motion/Reveal";

import { SectionIntro } from "./motion/SectionIntro";



type Props = {

  /** Only supplied on the home page, which numbers its sections. */

  index?: string;

  variant?: "default" | "paper" | "frame";

};



type FrameHighlight = {
  client: string;
  title: string;
  href: string;
  image: { src: string; alt: string };
};

function FrameEnterpriseCard({ item }: { item: FrameHighlight }) {
  return (
    <Link href={item.href} className="frame-work__card frame-enterprise__card">
      <div className="frame-enterprise__media" data-cursor="case">
        <Image
          src={assetPath(item.image.src)}
          alt={item.image.alt}
          fill
          unoptimized
          sizes="(max-width: 960px) 100vw, 33vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="frame-work__meta">
        <span className="frame-work__title">
          <SwapLabel>{item.title}</SwapLabel>
        </span>
        <span className="frame-work__role">{item.client.toUpperCase()}</span>
      </div>
    </Link>
  );
}



export function EnterpriseSection({ index, variant = "default" }: Props) {

  if (variant === "frame") {

    const rows = [

      enterpriseWork.highlights,

      enterpriseWork.secondaryHighlights,

    ];



    return (

      <section
        id="enterprise-work"
        className="frame-enterprise"
        aria-labelledby="enterprise-heading"
      >

        <div className="frame-logo-wall-shell">
          <Reveal targets=".frame-logo-wall li" stagger={0.04}>
            <ul className="frame-logo-wall" aria-label="Clients">
              {enterpriseWork.clientLogos.map((client) => (
                <li key={client.name}>
                  {client.logos.map((logo) => (
                    <img key={logo.src} src={assetPath(logo.src)} alt={logo.alt} />
                  ))}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>



        <Reveal targets="[data-reveal]">
          <div className="frame-enterprise__intro">

          <h2 id="enterprise-heading" className="frame-enterprise__headline" data-reveal>
            <span className="frame-enterprise__headline-line">
              {enterpriseWork.headline}
            </span>
            <span className="frame-enterprise__headline-line frame-enterprise__headline-line--soft">
              {enterpriseWork.subheadline}
            </span>
          </h2>

          <div className="frame-enterprise__copy" data-reveal>

            {enterpriseWork.body.map((paragraph) => (

              <p key={paragraph.slice(0, 40)}>{paragraph}</p>

            ))}

          </div>

        </div>
        </Reveal>



        {rows.map((row) => (

          <Reveal key={row[0]?.title} targets=".frame-enterprise__card" stagger={0.08}>
            <div className="frame-enterprise__row">

            {row.map((item) => (

              <FrameEnterpriseCard key={item.title} item={item} />

            ))}

            </div>
          </Reveal>

        ))}

      </section>

    );

  }



  if (variant === "paper") {

    return (

      <section className="paper-enterprise" aria-labelledby="enterprise-heading">

        <div className="paper-enterprise__intro">

          <h2 id="enterprise-heading" className="paper-enterprise__headline">

            {enterpriseWork.headline}{" "}

            <span className="is-soft">{enterpriseWork.subheadline}</span>

          </h2>

          <div className="paper-enterprise__copy">

            {enterpriseWork.body.map((paragraph) => (

              <p key={paragraph.slice(0, 40)}>{paragraph}</p>

            ))}

          </div>

        </div>



        <div className="logo-wall-shell">
          <ul className="logo-wall paper-logo-wall" aria-label="Clients">
            {enterpriseWork.clientLogos.map((client) => (
              <li key={client.name}>
                {client.logos.map((logo) => (
                  <img key={logo.src} src={assetPath(logo.src)} alt={logo.alt} />
                ))}
              </li>
            ))}
          </ul>
        </div>



        <div className="paper-enterprise__highlights">

          {enterpriseWork.highlights.map((item) => (

            <article key={item.client} className="paper-enterprise-card">

              <div className="paper-enterprise-card__media">

                <Image

                  src={assetPath(item.image.src)}

                  alt={item.image.alt}

                  fill

                  unoptimized

                  sizes="(max-width: 960px) 100vw, 33vw"

                  style={{ objectFit: "cover" }}

                />

              </div>

              <div className="paper-enterprise-card__body">

                <h3>{item.title}</h3>

                <p>{item.client.toUpperCase()} • ENTERPRISE</p>

              </div>

            </article>

          ))}

        </div>

      </section>

    );

  }



  return (

    <section
      id="enterprise-work"
      className="enterprise-section"
      aria-labelledby="enterprise-heading"
    >

      <SectionIntro

        index={index}

        label="Fortune 500 work"

        aside="Previously at XIX3D"

      />



      <Reveal targets="[data-reveal]" className="enterprise-intro">

        <div className="enterprise-copy" data-reveal>

          <h2 id="enterprise-heading" className="enterprise-headline">

            <span>{enterpriseWork.headline}</span>

            <span className="is-soft">{enterpriseWork.subheadline}</span>

          </h2>

          {enterpriseWork.body.map((paragraph) => (

            <p key={paragraph.slice(0, 40)}>{paragraph}</p>

          ))}

        </div>

        <div data-reveal>

          <div className="enterprise-mosaic">

            <Image

              src={assetPath(enterpriseWork.mosaic.src)}

              alt={enterpriseWork.mosaic.alt}

              fill

              unoptimized

              sizes="(max-width: 960px) 100vw, 42vw"

              style={{ objectFit: "contain" }}

            />

          </div>

        </div>

      </Reveal>



      <Reveal>
        <div className="logo-wall-shell">
          <ul className="logo-wall" aria-label="Clients">
            {enterpriseWork.clientLogos.map((client) => (
              <li key={client.name}>
                {client.logos.map((logo) => (
                  <img key={logo.src} src={assetPath(logo.src)} alt={logo.alt} />
                ))}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>



      <Reveal targets=".enterprise-card" stagger={0.12}>

        <div className="enterprise-highlights">

          {enterpriseWork.highlights.map((item) => (

            <Link key={item.client} href={item.href} className="enterprise-card">

              <div className="enterprise-card-media">

                <Image

                  src={assetPath(item.image.src)}

                  alt={item.image.alt}

                  fill

                  unoptimized

                  sizes="(max-width: 960px) 100vw, 33vw"

                  style={{ objectFit: "cover" }}

                />

              </div>

              <div className="enterprise-card-body">

                <div className="enterprise-card-logos">

                  {item.logos.map((logo) => (

                    <img key={logo.src} src={assetPath(logo.src)} alt={logo.alt} />

                  ))}

                </div>

                <h3>
                  <SwapLabel>{item.title}</SwapLabel>
                </h3>
                <p>{item.description}</p>

              </div>

            </Link>

          ))}

        </div>

      </Reveal>

    </section>

  );

}


